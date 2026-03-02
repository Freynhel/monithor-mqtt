"use client";

import MetricContainer from "@/components/metrics/MetricContainer";
import MetricCard from "@/components/metrics/MetricCard";
import Header from "./Header";
import { Activity, Zap, ChartColumn, Info, Cpu, Check, Gauge, BatteryCharging, ThermometerSnowflake, Wifi, Fuel, WavesArrowDown, Waves, Power, SquareArrowRight, TriangleAlert, ChartNetwork } from "lucide-react";

const payloadX = [
	{
		id: 1,
		label: "Funcionamento",
		value: "4.820",
		unit: "h",
		icon: Activity,
		color: "teal",
	},
	{
		label: "Partidas",
		value: "660",
		unit: "",
		icon: Power,
		color: "pink",				
	},
	{
		label: "Temp. Refrig.",
		value: "52.0",
		unit: "°C",
		icon: ThermometerSnowflake,
		color: "yellow",
	},
	{
		id: 4,
		label: "Pressão Óleo",
		value: "8,4",
		unit: "KPA",
		icon: WavesArrowDown,
		color: "blue",
	},
	{
		id: 5,
		label: "Modo de Operação",
		value: "Auto",
		unit: "",
		icon: SquareArrowRight,
		color: "orange",
	},
	{
		id: 6,
		label: "Rotação",
		value: "1.740",
		unit: "rpm",
		icon: Gauge,
		color: "teal",
	},
	{
		id: 7,
		label: "Frequência",
		value: "60,0",
		unit: "Hz",
		icon: Wifi,
		color: "pink",
	},
	{
		id: 8,
		label: "Tensão Bateria",
		value: "27",
		unit: "Vcc",
		icon: BatteryCharging,
		color: "yellow",
	},
	{
		id: 9,
		label: "Nível Combustível",
		value: "100",
		unit: "%",
		icon: Fuel,
		color: "blue",
	},
	{
		id: 10,
		label: "Falha Ativa",
		value: "0",
		unit: "",
		icon: TriangleAlert,
		color: "orange",
	},
	
];

const infoPayload01 = [
	["Nome", "Gerador GMG 01"],
	["Modelo", "C600"],
	["Cliente", "BELTRAME SUPERMERCADOS"],
	["Status", "Parado"],
	["Alarme", "Alarme Ativo"],
	["Falha Ativa", "0"],
	["Modo de Operação", "Auto"],
	["Último Funcionamento", "2026-02-15 14:32:10"],
];

const infoPayload02 = [

];

const examplePayload01 = [
	{
		label: "AN",
		value: "127",
		unit: "V",
		icon: Activity,
		color: "cyan",
	},
	{
		label: "BN",
		value: "128",
		unit: "V",
		icon: Activity,
		color: "cyan",
	},
	{
		label: "CN",
		value: "123",
		unit: "V",
		icon: Activity,
		color: "cyan",
	},
	{
		label: "AB",
		value: "221",
		unit: "V",
		icon: Activity,
		color: "cyan",
	},
	{
		label: "BC",
		value: "223",
		unit: "V",
		icon: Activity,
		color: "cyan",
	},
	{
		label: "CA",
		value: "217",
		unit: "V",
		icon: Activity,
		color: "cyan",
	},
];

const examplePayload02 = [
	{
		label: "Fase A",
		value: "15.2",
		unit: "A",
		icon: Zap,
		color: "yellow",
	},
	{
		label: "Fase B",
		value: "14.8",
		unit: "A",
		icon: Zap,
		color: "yellow",
	},
	{
		label: "Fase C",
		value: "16.5",
		unit: "A",
		icon: Zap,
		color: "yellow",
	},
];

const examplePayload03 = [
	{
		label: "Ativa",
		value: "8.2",
		unit: "kW",
		icon: ChartColumn,
		color: "purple",
	},
	{
		label: "Reativa",
		value: "3.1",
		unit: "kVAR",
		icon: ChartColumn,
		color: "pink",
	},
	{
		label: "Aparente",
		value: "8,8",
		unit: "kVA",
		icon: ChartColumn,
		color: "fuchsia",
	},
	{
		label: "Fat. Potência",
		value: "0.93",
		unit: "",
		color: "violet",
	}
];

export default function GeneratorView() {
	return (<div className="relative max-w-7xl mx-auto px-4 py-6 space-y-5">
		{/* Header */}
		<Header />

		{/* ── General Info Row ── */}
		<div className="px-5 pt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
			{payloadX.map((metric, index) => (
				<MetricCard key={index} {...metric} />
			))}
		</div>

		{/* Metric Data, Current, Power, Voltage */}
		<div className="px-5 grid grid-cols-3 gap-3">
			{MetricContainer({
				icon: Activity,
				containerLabel: "Tensões",
				badgeLabel: "Gerador",
				color: "cyan",
				payload: examplePayload01,
			})}
			
			{MetricContainer({
				icon: Activity,
				containerLabel: "Correntes",
				badgeLabel: "Gerador",
				color: "yellow",
				payload: examplePayload02,
			})}

			{MetricContainer({
				icon: Activity,
				containerLabel: "Potências",
				badgeLabel: "Gerador",
				color: "purple",
				payload: examplePayload03,
			})}
		</div>

		{/* Temp */}
		<div className="px-5 grid grid-cols-2 gap-3">
			{MetricContainer({
				icon: Cpu,
				containerLabel: "Informações Gerais",
				badgeLabel: "I",
				cols: 2,
				color: "red",
				useCard: false,
				payload: infoPayload01,
			})}
			{MetricContainer({
				icon: ChartNetwork,
				containerLabel: "Unifilar",
				badgeLabel: "II",
				cols: 2,
				color: "red",
				useCard: false,
				payload: infoPayload02,
			})}
		</div>
	</div>	
	);
}
