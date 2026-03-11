"use client";

/**
 * apps/next-mqtt/app/generatorc/page.tsx
 *
 * Generator C dashboard.
 *
 * Data sources
 * ────────────
 * ┌─────────────────────────────┬──────────────────────────────────────────────┐
 * │ Live telemetry              │ MQTT over WebSocket → useMqttTelemetry hook  │
 * │                             │ refresh ≈ 2 s (throttled in the hook)        │
 * ├─────────────────────────────┼──────────────────────────────────────────────┤
 * │ Static generator info       │ GET /generators/:id        (DB via API)       │
 * │ Alarm history               │ GET /generators/:id/alarms (DB via API)       │
 * │ Historical telemetry table  │ GET /generators/:id/history (DB via API)      │
 * └─────────────────────────────┴──────────────────────────────────────────────┘
 *
 * NOTE: Replace GENERATOR_ID with a route param (useParams) when this page
 * is moved to a dynamic route (e.g. /generatorc/[id]).
 */

import { useEffect, useMemo, useState } from "react";
import {
	Activity,
	BatteryCharging,
	ChartColumn,
	ChartNetwork,
	Cpu,
	Fuel,
	Gauge,
	Power,
	SquareArrowRight,
	ThermometerSnowflake,
	TriangleAlert,
	WavesArrowDown,
	Wifi,
	Zap,
} from "lucide-react";

import MetricContainer from "@/components/metrics/MetricContainer";
import MetricCard from "@/components/metrics/MetricCard";
import Header from "./Header";
import AlertDefault from "@/components/ui/alert";
import DataTable2 from "@/components/ui/table";
import {
	useMqttTelemetry,
	type MqttConnectionStatus,
} from "./../../hooks/useMqttTelemetry";
import {
	operationModeLabel,
	gensetStateLabel,
	type NormalizedTelemetry,
} from "./../../lib/mqttNormalizer";

// ─── Configuration ────────────────────────────────────────────────────────────

/** TODO: derive from route params once this page becomes /generatorc/[id] */
const GENERATOR_ID = 45;
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ─── Types ────────────────────────────────────────────────────────────────────

type GeneratorInfo = {
	GeneratorID: number;
	SerialNumber: string | null;
	Name: string | null;
	Address: string | null;
	Status: string | null;
	Mode: string | null;
	Year: number | null;
	ModelName: string | null;
	ContactName: string | null;
	ContactNumber: string | null;
	ContactEmail: string | null;
	TopicMQTT: string | null;
};

type AlarmRow = {
	AlarmID: number;
	GeneratorID: number;
	DateTime: string;
	Entrance: string | null;
	Exit: string | null;
	Code: number;
	Message: string;
};

type HistoryRow = Record<string, string | number | null>;

// ─── Alarm severity helper ────────────────────────────────────────────────────

/**
 * Maps alarm Code ranges to a UI severity label.
 * Extend as your alarm code taxonomy grows.
 */
function alarmSeverity(code: number): "critical" | "warning" | "info" {
	if (code >= 400) return "critical";
	if (code >= 200) return "warning";
	return "info";
}

// ─── MQTT status badge ────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
	MqttConnectionStatus,
	{ label: string; colorClass: string }
> = {
	idle: { label: "Sem Tópico", colorClass: "bg-slate-500" },
	connecting: {
		label: "Conectando…",
		colorClass: "bg-yellow-400 animate-pulse",
	},
	connected: { label: "Conectado", colorClass: "bg-emerald-400" },
	reconnecting: {
		label: "Reconectando",
		colorClass: "bg-yellow-400 animate-pulse",
	},
	error: { label: "Erro MQTT", colorClass: "bg-red-500" },
	disconnected: { label: "Desconectado", colorClass: "bg-slate-500" },
};

function MqttStatusBadge({ status }: { status: MqttConnectionStatus }) {
	const { label, colorClass } = STATUS_CONFIG[status];
	return (
		<span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
			<span
				className={`w-2 h-2 rounded-full inline-block ${colorClass}`}
			/>
			{label}
		</span>
	);
}

// ─── Payload builder ──────────────────────────────────────────────────────────

/**
 * Merges static generator info with live MQTT telemetry into the dashboard
 * payload shape expected by the existing MetricCard / MetricContainer components.
 * Falls back to "–" for any value that hasn't arrived yet.
 */
function buildPayload(
	info: GeneratorInfo | null,
	t: NormalizedTelemetry | null,
	lastUpdate: Date | null,
) {
	const v = (n: number | null | undefined): string =>
		n != null ? String(n) : "–";

	console.log("Building payload with info:", info, "and telemetry:", t);
	return {
		metrics: [
			{
				id: 1,
				label: "Funcionamento",
				value: v(t?.hourmeter),
				unit: "h",
				icon: Activity,
				color: "teal",
			},
			{
				id: 2,
				label: "Partidas",
				value: v(t?.starts),
				unit: "",
				icon: Power,
				color: "pink",
			},
			{
				id: 3,
				label: "Temp. Refrig.",
				value: t?.coolantTemp ?? "–",
				unit: "°C",
				icon: ThermometerSnowflake,
				color: "yellow",
			},
			{
				id: 4,
				label: "Pressão Óleo",
				value: v(t?.oilPressure),
				unit: "KPA",
				icon: WavesArrowDown,
				color: "blue",
			},
			{
				id: 5,
				label: "Modo de Operação",
				value: operationModeLabel(t?.operationMode ?? null),
				unit: "",
				icon: SquareArrowRight,
				color: "orange",
			},
			{
				id: 6,
				label: "Rotação",
				value: v(t?.rotation),
				unit: "rpm",
				icon: Gauge,
				color: "teal",
			},
			{
				id: 7,
				label: "Frequência",
				value: t?.genFrequency ?? "–",
				unit: "Hz",
				icon: Wifi,
				color: "pink",
			},
			{
				id: 8,
				label: "Tensão Bateria",
				value: t?.battery ?? "–",
				unit: "Vcc",
				icon: BatteryCharging,
				color: "yellow",
			},
			{
				id: 9,
				label: "Nível Combustível",
				value: "–",
				unit: "%",
				icon: Fuel,
				color: "blue",
			},
			{
				id: 10,
				label: "Falha Ativa",
				value: v(t?.activeFault),
				unit: "",
				icon: TriangleAlert,
				color: "orange",
			},
		],

		generalInfo: [
			["Número de Série", info?.SerialNumber ?? "–"],
			["Modelo", info?.ModelName ?? "–"],
			[
				"Último Dado",
				lastUpdate ? lastUpdate.toLocaleString("pt-BR") : "Aguardando…",
			],
			["Modo", info?.Mode ?? "–"],
			["Status Controlador", gensetStateLabel(t?.gensetState ?? null)],
			["Nome Contato", info?.ContactName ?? "–"],
			["Endereço", info?.Address ?? "–"],
			["Telefone Contato", info?.ContactNumber ?? "–"],
			["Email Contato", info?.ContactEmail ?? "–"],
		],

		unifilar: [],

		// Tensões (voltages)
		generatorCurrent: [
			{
				label: "AN",
				value: v(t?.genPhaseAN),
				unit: "V",
				icon: Activity,
				color: "cyan",
			},
			{
				label: "BN",
				value: v(t?.genPhaseBN),
				unit: "V",
				icon: Activity,
				color: "cyan",
			},
			{
				label: "CN",
				value: v(t?.genPhaseCN),
				unit: "V",
				icon: Activity,
				color: "cyan",
			},
			{
				label: "AB",
				value: v(t?.genPhaseAB),
				unit: "V",
				icon: Activity,
				color: "cyan",
			},
			{
				label: "BC",
				value: v(t?.genPhaseBC),
				unit: "V",
				icon: Activity,
				color: "cyan",
			},
			{
				label: "CA",
				value: v(t?.genPhaseCA),
				unit: "V",
				icon: Activity,
				color: "cyan",
			},
		],

		// Correntes (currents)
		generatorVoltage: [
			{
				label: "Fase A",
				value: v(t?.genPhaseA),
				unit: "A",
				icon: Zap,
				color: "yellow",
			},
			{
				label: "Fase B",
				value: v(t?.genPhaseB),
				unit: "A",
				icon: Zap,
				color: "yellow",
			},
			{
				label: "Fase C",
				value: v(t?.genPhaseC),
				unit: "A",
				icon: Zap,
				color: "yellow",
			},
		],

		// Potências (power)
		generatorPower: [
			{
				label: "Ativa",
				value: v(t?.genActive),
				unit: "kW",
				icon: ChartColumn,
				color: "purple",
			},
			{
				label: "Reativa",
				value: v(t?.genReactive),
				unit: "kVAR",
				icon: ChartColumn,
				color: "pink",
			},
			{
				label: "Aparente",
				value: v(t?.genApparent),
				unit: "kVA",
				icon: ChartColumn,
				color: "fuchsia",
			},
			{
				label: "Fat. Pot",
				value: v(t?.genFactor),
				unit: "",
				icon: ChartColumn,
				color: "orange",
			},
		],
	};
}

// ─── Table column definitions ─────────────────────────────────────────────────

const alarmsColumns = [
	{ header: "ID", accessorKey: "id" },
	{ header: "Mensagem", accessorKey: "title" },
	{ header: "Código", accessorKey: "code" },
	{ header: "Severidade", accessorKey: "severity" },
	{ header: "Timestamp", accessorKey: "timestamp" },
	{ header: "Saída", accessorKey: "exit" },
];

const historyColumns = [
	{ header: "Data/Hora", accessorKey: "timestamp" },
	{ header: "Estado", accessorKey: "gensetState" },
	{ header: "Modo", accessorKey: "operationMode" },
	{ header: "Horímetro", accessorKey: "hourmeter" },
	{ header: "AN (V)", accessorKey: "AN" },
	{ header: "BN (V)", accessorKey: "BN" },
	{ header: "CN (V)", accessorKey: "CN" },
	{ header: "Fase A (A)", accessorKey: "A" },
	{ header: "Aparente", accessorKey: "apparent" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function GeneratorView() {
	// ── Static / historical state (from DB via API) ───────────────────────────
	const [generatorInfo, setGeneratorInfo] = useState<GeneratorInfo | null>(
		null,
	);
	const [mqttTopic, setMqttTopic] = useState<string | null>(null);
	const [alarms, setAlarms] = useState<AlarmRow[]>([]);
	const [history, setHistory] = useState<HistoryRow[]>([]);
	const [dbLoading, setDbLoading] = useState(true);
	const [dbError, setDbError] = useState<string | null>(null);

	// ── Live telemetry (from MQTT over WebSocket) ─────────────────────────────
	const {
		telemetry,
		status: mqttStatus,
		lastUpdate,
	} = useMqttTelemetry(mqttTopic);

	// ── Active alarm for the top banner ──────────────────────────────────────
	const activeAlarm = useMemo(
		() => alarms.find((a) => a.Exit === null) ?? null,
		[alarms],
	);

	// ── Load static + historical data from the API on mount ──────────────────
	useEffect(() => {
		let cancelled = false;

		async function loadAll() {
			try {
				setDbLoading(true);
				setDbError(null);

				const [genRes, alarmsRes, histRes] = await Promise.all([
					fetch(`${API_BASE}/generators/${GENERATOR_ID}`),
					fetch(
						`${API_BASE}/generators/${GENERATOR_ID}/alarms?limit=50`,
					),
					// fetch(`${API_BASE}/generators/${GENERATOR_ID}/history?limit=30`),
				]);

				if (!genRes.ok)
					throw new Error(`Generator fetch failed: ${genRes.status}`);
				if (!alarmsRes.ok)
					throw new Error(`Alarms fetch failed: ${alarmsRes.status}`);
				// if (!histRes.ok)   throw new Error(`History fetch failed: ${histRes.status}`);

				const [gen, alarmsData /*histData*/]: [
					GeneratorInfo,
					AlarmRow[],
					HistoryRow[],
				] = await Promise.all([
					genRes.json(),
					alarmsRes.json() /*histRes.json()*/,
				]);

				if (cancelled) return;

				setGeneratorInfo(gen);
				setMqttTopic(gen.TopicMQTT ?? null);
				setAlarms(alarmsData);
				// setHistory(histData);
			} catch (err) {
				if (!cancelled) {
					const msg =
						err instanceof Error ? err.message : "Unknown error";
					console.error("[generatorc] Failed to load DB data:", err);
					setDbError(msg);
				}
			} finally {
				if (!cancelled) setDbLoading(false);
			}
		}

		loadAll();
		return () => {
			cancelled = true;
		};
	}, []);

	// ── Build the live payload from MQTT telemetry + static info ─────────────
	const payload = useMemo(
		() => buildPayload(generatorInfo, telemetry, lastUpdate),
		[generatorInfo, telemetry, lastUpdate],
	);

	// ── Map DB alarm rows → table row shape ───────────────────────────────────
	const alarmTableRows = useMemo(
		() =>
			alarms.map((a) => ({
				id: a.AlarmID,
				title: a.Message,
				code: a.Code,
				severity: alarmSeverity(a.Code),
				timestamp: new Date(a.DateTime).toLocaleString("pt-BR"),
				exit: a.Exit
					? new Date(a.Exit).toLocaleString("pt-BR")
					: "Ativo",
			})),
		[alarms],
	);

	// ── Map DB history rows → table row shape ─────────────────────────────────
	const historyTableRows = useMemo(
		() =>
			history.map((h) => ({
				timestamp: h.dateTime
					? new Date(h.dateTime as string).toLocaleString("pt-BR")
					: "–",
				gensetState: h.gensetState ?? "–",
				operationMode: h.operationMode ?? "–",
				hourmeter: h.hourmeter ?? "–",
				AN: h.AN ?? "–",
				BN: h.BN ?? "–",
				CN: h.CN ?? "–",
				A: h.A ?? "–",
				apparent: h.apparent ?? "–",
			})),
		[history],
	);

	// ─────────────────────────────────────────────────────────────────────────

	return (
		<div className="relative max-w-7xl mx-auto px-4 py-6 space-y-5">
			{/* Header + MQTT connection status */}
			<div className="flex items-end justify-between">
				<Header />
				<div className="pb-1">
					<MqttStatusBadge status={mqttStatus} />
				</div>
			</div>

			{/* DB error banner (only shown when API calls fail) */}
			{dbError && (
				<AlertDefault
					props={{
						title: "Erro ao carregar dados históricos",
						description: dbError,
						variant: "alert",
					}}
				/>
			)}

			{/* Active alarm banner (driven by DB alarm history) */}
			{activeAlarm && (
				<AlertDefault
					props={{
						title: `Alarme Ativo — ${activeAlarm.Message}`,
						description: `Código ${activeAlarm.Code} · Entrada: ${
							activeAlarm.Entrance
								? new Date(activeAlarm.Entrance).toLocaleString(
										"pt-BR",
									)
								: new Date(activeAlarm.DateTime).toLocaleString(
										"pt-BR",
									)
						}`,
						variant: "alert",
					}}
				/>
			)}

			{/* ── Metric cards row ─────────────────────────────────────────── */}
			<div className="px-5 pt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
				{payload.metrics.map((metric) => (
					<MetricCard key={metric.id} {...metric} />
				))}
			</div>

			{/* ── Electrical measurements ──────────────────────────────────── */}
			<div className="px-5 grid grid-cols-1 lg:grid-cols-3 gap-3">
				{MetricContainer({
					icon: Activity,
					containerLabel: "Tensões",
					badgeLabel: "Gerador",
					color: "cyan",
					payload: payload.generatorCurrent,
				})}

				{MetricContainer({
					icon: Activity,
					containerLabel: "Correntes",
					badgeLabel: "Gerador",
					cols: 2,
					color: "yellow",
					payload: payload.generatorVoltage,
				})}

				{MetricContainer({
					icon: Activity,
					containerLabel: "Potências",
					cols: 2,
					badgeLabel: "Gerador",
					color: "purple",
					payload: payload.generatorPower,
				})}
			</div>

			{/* ── General info + unifilar ───────────────────────────────────── */}
			<div className="px-5 grid grid-cols-2 gap-3">
				{MetricContainer({
					icon: Cpu,
					containerLabel: "Informações Gerais",
					badgeLabel: "I",
					cols: 2,
					color: "red",
					useCard: false,
					payload: payload.generalInfo,
				})}

				{MetricContainer({
					icon: ChartNetwork,
					containerLabel: "Unifilar",
					badgeLabel: "II",
					cols: 2,
					color: "red",
					useCard: false,
					payload: payload.unifilar,
				})}
			</div>

			{/* ── History & Alarms table (data from DB) ────────────────────── */}
			{dbLoading ? (
				<div className="px-5 py-8 text-center text-sm text-slate-500 animate-pulse">
					Carregando dados históricos…
				</div>
			) : (
				<DataTable2
					props={{
						columns:
							alarmTableRows.length > 0
								? alarmsColumns
								: historyColumns,
						data:
							alarmTableRows.length > 0
								? alarmTableRows
								: historyTableRows,
					}}
				/>
			)}
		</div>
	);
}
