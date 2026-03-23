"use client";

/**
 * Generator dashboard page.
 *
 * Data sources
 * ────────────
 * ┌─────────────────────────────┬──────────────────────────────────────────────┐
 * │ Live telemetry              │ MQTT over WebSocket → useMqttTelemetry hook  │
 * │                             │ refresh ≈ 2 s (throttled in the hook)        │
 * ├─────────────────────────────┼──────────────────────────────────────────────┤
 * │ Static generator info       │ GET /generators/:id        (DB via API)       │
 * │ Alarm history               │ GET /generators/:id/alarms (DB via API)       │
 * └─────────────────────────────┴──────────────────────────────────────────────┘
 */

import { useEffect, useMemo, useState } from "react";
import { Activity, ChartNetwork, Cpu, Network } from "lucide-react";

import MetricContainer from "@/components/metrics/MetricContainer";
import MetricCard from "@/components/metrics/MetricCard";
import Header from "./Header";
import AlertDefault from "@/components/ui/alert";
import DataTable2 from "@/components/ui/table";

import {
	useMqttTelemetry,
	type MqttConnectionStatus,
} from "../../hooks/useMqttTelemetry";

import { buildPayload } from "../../lib/buildPayload";

// ─── Configuration ────────────────────────────────────────────────────────────

const GENERATOR_ID = 35;
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

// ─── Alarm severity helper ────────────────────────────────────────────────────

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
	idle:         { label: "Sem Tópico",   colorClass: "bg-slate-500"              },
	connecting:   { label: "Conectando…",  colorClass: "bg-yellow-400 animate-pulse" },
	connected:    { label: "Conectado",    colorClass: "bg-emerald-400"            },
	reconnecting: { label: "Reconectando", colorClass: "bg-yellow-400 animate-pulse" },
	error:        { label: "Erro MQTT",    colorClass: "bg-red-500"                },
	disconnected: { label: "Desconectado", colorClass: "bg-slate-500"              },
};

function MqttStatusBadge({ status }: { status: MqttConnectionStatus }) {
	const { label, colorClass } = STATUS_CONFIG[status];
	return (
		<span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
			<span className={`w-2 h-2 rounded-full inline-block ${colorClass}`} />
			{label}
		</span>
	);
}

// ─── Alarm table columns ──────────────────────────────────────────────────────

const alarmsColumns = [
	{ header: "ID",        accessorKey: "id"        },
	{ header: "Mensagem",  accessorKey: "title"     },
	{ header: "Código",    accessorKey: "code"      },
	{ header: "Severidade",accessorKey: "severity"  },
	{ header: "Timestamp", accessorKey: "timestamp" },
	{ header: "Saída",     accessorKey: "exit"      },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function GeneratorView() {
	// ── Static / historical state ─────────────────────────────────────────────
	const [generatorInfo, setGeneratorInfo] = useState<GeneratorInfo | null>(null);
	const [mqttTopic, setMqttTopic]         = useState<string | null>(null);
	const [alarms, setAlarms]               = useState<AlarmRow[]>([]);
	const [dbLoading, setDbLoading]         = useState(true);
	const [dbError, setDbError]             = useState<string | null>(null);

	// ── Live telemetry ────────────────────────────────────────────────────────
	const { telemetry, status: mqttStatus, lastUpdate } = useMqttTelemetry(mqttTopic);

	// ── Active alarm banner ───────────────────────────────────────────────────
	const activeAlarm = useMemo(
		() => alarms.find((a) => a.Exit === null) ?? null,
		[alarms],
	);

	// ── Load static data from API ─────────────────────────────────────────────
	useEffect(() => {
		let cancelled = false;

		async function loadAll() {
			try {
				setDbLoading(true);
				setDbError(null);

				const [genRes, alarmsRes] = await Promise.all([
					fetch(`${API_BASE}/generators/${GENERATOR_ID}`),
					fetch(`${API_BASE}/generators/${GENERATOR_ID}/alarms?limit=50`),
				]);

				if (!genRes.ok)    throw new Error(`Generator fetch failed: ${genRes.status}`);
				if (!alarmsRes.ok) throw new Error(`Alarms fetch failed: ${alarmsRes.status}`);

				const [gen, alarmsData]: [GeneratorInfo, AlarmRow[]] = await Promise.all([
					genRes.json(),
					alarmsRes.json(),
				]);

				if (cancelled) return;

				setGeneratorInfo(gen);
				setMqttTopic(gen.TopicMQTT ?? null);
				setAlarms(alarmsData);
			} catch (err) {
				if (!cancelled) {
					const msg = err instanceof Error ? err.message : "Unknown error";
					console.error("[generator] Failed to load DB data:", err);
					setDbError(msg);
				}
			} finally {
				if (!cancelled) setDbLoading(false);
			}
		}

		loadAll();
		return () => { cancelled = true; };
	}, []);

	// ── Build display payload ─────────────────────────────────────────────────
	const payload = useMemo(
		() => buildPayload(generatorInfo, telemetry, lastUpdate),
		[generatorInfo, telemetry, lastUpdate],
	);

	const { layout } = payload;

	// ── Alarm table rows ──────────────────────────────────────────────────────
	const alarmTableRows = useMemo(
		() =>
			alarms.map((a) => ({
				id:        a.AlarmID,
				title:     a.Message,
				code:      a.Code,
				severity:  alarmSeverity(a.Code),
				timestamp: new Date(a.DateTime).toLocaleString("pt-BR"),
				exit:      a.Exit ? new Date(a.Exit).toLocaleString("pt-BR") : "Ativo",
			})),
		[alarms],
	);

	// ─────────────────────────────────────────────────────────────────────────

	return (
		<div className="relative max-w-7xl mx-auto px-4 py-6 space-y-5">

			{/* ── Header + MQTT status ──────────────────────────────────────── */}
			<div className="flex items-end justify-between">
				<Header />
				<div className="pb-1">
					<MqttStatusBadge status={mqttStatus} />
				</div>
			</div>

			{/* ── DB error banner ───────────────────────────────────────────── */}
			{dbError && (
				<AlertDefault
					props={{
						title:       "Erro ao carregar dados históricos",
						description: dbError,
						variant:     "alert",
					}}
				/>
			)}

			{/* ── Active alarm banner ───────────────────────────────────────── */}
			{activeAlarm && (
				<AlertDefault
					props={{
						title:       `Alarme Ativo — ${activeAlarm.Message}`,
						description: `Código ${activeAlarm.Code} · Entrada: ${
							activeAlarm.Entrance
								? new Date(activeAlarm.Entrance).toLocaleString("pt-BR")
								: new Date(activeAlarm.DateTime).toLocaleString("pt-BR")
						}`,
						variant: "alert",
					}}
				/>
			)}

			{/* ── Top metrics row ───────────────────────────────────────────── */}
			<div className="px-5 pt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
				{payload.metrics.map((metric) => (
					<MetricCard
						key={metric.field}
						label={metric.label}
						value={metric.value}
						unit={metric.unit}
						icon={metric.icon}
						color={metric.color}
						sub=""
					/>
				))}
			</div>

			{/* ── Generator electrical ─────────────────────────────────────── */}
			<div className="px-5 grid grid-cols-1 lg:grid-cols-3 gap-3">
				{MetricContainer({
					icon:           Activity,
					containerLabel: "Tensões",
					badgeLabel:     "Gerador",
					color:          "cyan",
					payload:        payload.generatorVoltages,
				})}

				{MetricContainer({
					icon:           Activity,
					containerLabel: "Correntes",
					badgeLabel:     "Gerador",
					cols:           3,
					color:          "yellow",
					payload:        payload.generatorCurrents,
				})}

				{MetricContainer({
					icon:           Activity,
					containerLabel: "Potências",
					badgeLabel:     "Gerador",
					cols:           2,
					color:          "purple",
					payload:        payload.generatorPower,
				})}
			</div>

			{/* ── Network electrical (PCC3300 + MCM3320 only) ───────────────── */}
			{layout?.hasNetworkSection && (
				<div className="px-5 grid grid-cols-1 lg:grid-cols-3 gap-3">
					{MetricContainer({
						icon:           Network,
						containerLabel: "Tensões",
						badgeLabel:     "Rede",
						color:          "blue",
						payload:        payload.networkVoltages,
					})}

					{MetricContainer({
						icon:           Network,
						containerLabel: "Correntes",
						badgeLabel:     "Rede",
						cols:           3,
						color:          "indigo",
						payload:        payload.networkCurrents,
					})}

					{MetricContainer({
						icon:           Network,
						containerLabel: "Potências",
						badgeLabel:     "Rede",
						cols:           2,
						color:          "emerald",
						payload:        payload.networkPower,
					})}
				</div>
			)}

			{/* ── General info + unifilar ───────────────────────────────────── */}
			<div className="px-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
				{MetricContainer({
					icon:           Cpu,
					containerLabel: "Informações Gerais",
					badgeLabel:     "Info",
					cols:           2,
					color:          "red",
					useCard:        false,
					payload:        payload.generalInfo,
				})}

				{/* Unifilar section — MCM3320 only */}
				{layout?.hasUnifilarSection && (
					MetricContainer({
						icon:           ChartNetwork,
						containerLabel: "Unifilar",
						badgeLabel:     "MCM3320",
						cols:           2,
						color:          "red",
						useCard:        false,
						payload:        payload.networkPower.map((m) => [m.label, m.value] as [string, string]),
					})
				)}
			</div>

			{/* ── Alarm table ───────────────────────────────────────────────── */}
			{dbLoading ? (
				<div className="px-5 py-8 text-center text-sm text-slate-500 animate-pulse">
					Carregando dados históricos…
				</div>
			) : (
				<DataTable2
					props={{
						columns: alarmsColumns,
						data:    alarmTableRows,
					}}
				/>
			)}
		</div>
	);
}