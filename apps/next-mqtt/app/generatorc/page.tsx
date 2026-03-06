"use client";

import MetricContainer from "@/components/metrics/MetricContainer";
import MetricCard from "@/components/metrics/MetricCard";
import Header from "./Header";
import { Activity, Zap, ChartColumn, Info, Cpu, Check, Gauge, BatteryCharging, ThermometerSnowflake, Wifi, Fuel, WavesArrowDown, Waves, Power, SquareArrowRight, TriangleAlert, ChartNetwork } from "lucide-react";
import AlertDefault from "@/components/ui/alert";
import DataTable from "@/components/datatable/DataTable";
import DataTable2 from "@/components/ui/table";
import { useEffect } from "react";

const payload = {
	"metrics": [
		{ id: 1, label: "Funcionamento", value: "4.820", unit: "h", icon: Activity, color: "teal", },
		{ id: 2, label: "Partidas", value: "660", unit: "", icon: Power, color: "pink", },
		{ id: 3, label: "Temp. Refrig.", value: "52.0", unit: "°C", icon: ThermometerSnowflake, color: "yellow", },
		{ id: 4, label: "Pressão Óleo", value: "8,4", unit: "KPA", icon: WavesArrowDown, color: "blue", },
		{ id: 5, label: "Modo de Operação", value: "Auto", unit: "", icon: SquareArrowRight, color: "orange", },
		{ id: 6, label: "Rotação", value: "1.740", unit: "rpm", icon: Gauge, color: "teal", },
		{ id: 7, label: "Frequência", value: "60,0", unit: "Hz", icon: Wifi, color: "pink", },
		{ id: 8, label: "Tensão Bateria", value: "27", unit: "Vcc", icon: BatteryCharging, color: "yellow", },
		{ id: 9, label: "Nível Combustível", value: "100", unit: "%", icon: Fuel, color: "blue", },
		{ id: 10, label: "Falha Ativa", value: "0", unit: "", icon: TriangleAlert, color: "orange", },
	],
	"generalInfo": [
		["Número de Série", "SN1234567890"],
		["Modelo", "C600"],
		["Último Funcionamento", "2026-02-15 14:32:10"],
		["Modo", "Stand-by"],
		["Nome Contato", "Nome Sobrenome"],
		["Endereço", "Rua Exemplo, 123, Cidade, Estado"],
		["Telefone Contato", "(51) 99999-9999"],
		["Email Contato", "contato@exemplo.com"],
	],
	"unifilar": [],
	"generatorCurrent": [
		{ label: "AN", value: "127", unit: "V", icon: Activity, color: "cyan", },
		{ label: "BN", value: "128", unit: "V", icon: Activity, color: "cyan", },
		{ label: "CN", value: "123", unit: "V", icon: Activity, color: "cyan", },
		{ label: "AB", value: "221", unit: "V", icon: Activity, color: "cyan", },
		{ label: "BC", value: "223", unit: "V", icon: Activity, color: "cyan", },
		{ label: "CA", value: "217", unit: "V", icon: Activity, color: "cyan", },
	],
	"generatorVoltage": [
		{ label: "Fase A", value: "15.2", unit: "A", icon: Zap, color: "yellow", },
		{ label: "Fase B", value: "14.8", unit: "A", icon: Zap, color: "yellow", },
		{ label: "Fase C", value: "16.5", unit: "A", icon: Zap, color: "yellow", },
	],
	"generatorPower": [
		{ label: "Ativa", value: "8.2", unit: "kW", icon: ChartColumn, color: "purple", },
		{ label: "Reativa", value: "3.1", unit: "kVAR", icon: ChartColumn, color: "pink", },
		{ label: "Aparente", value: "8,8", unit: "kVA", icon: ChartColumn, color: "fuchsia", },
		{ label: "Fat. Potência", value: "0.93", unit: "", color: "violet", }
	],
	"networkCurrent": [
		{ label: "AN", value: "215", unit: "V", icon: Activity, color: "cyan", },
		{ label: "BN", value: "214", unit: "V", icon: Activity, color: "cyan", },
		{ label: "CN", value: "216", unit: "V", icon: Activity, color: "cyan", },
		{ label: "AB", value: "373", unit: "V", icon: Activity, color: "cyan", },
		{ label: "BC", value: "372", unit: "V", icon: Activity, color: "cyan", },
		{ label: "CA", value: "370", unit: "V", icon: Activity, color: "cyan", },
	],
	"networkVoltage": [
		{ label: "Fase A", value: "538", unit: "A", icon: Zap, color: "yellow", },
		{ label: "Fase B", value: "536", unit: "A", icon: Zap, color: "yellow", },
		{ label: "Fase C", value: "531", unit: "A", icon: Zap, color: "yellow", },
	],
	"networkPower": [
		{ label: "Ativa", value: "343", unit: "kW", icon: ChartColumn, color: "purple", },
		{ label: "Reativa", value: "55", unit: "kVAR", icon: ChartColumn, color: "pink", },
		{ label: "Aparente", value: "348", unit: "kVA", icon: ChartColumn, color: "fuchsia", },
		{ label: "Fat. Potência", value: "0.99", unit: "", color: "violet", }
	],
	"dataTable": [

	],
}
const alertsPayload = [
	{ id: 1, title: "Overvoltage Detected", description: "Voltage reading of 248.3V exceeded threshold (245V) on channel A. Alarm ALM-001 triggered at 14:32:11.", severity: "critical", status: "active" },
	{ id: 2, title: "High Temperature", description: "Temperature reading of 85.6°C exceeded threshold (80°C) on engine coolant. Alarm ALM-002 triggered at 14:35:22.", severity: "warning", status: "acknowledged" },
	{ id: 3, title: "Low Oil Pressure", description: "Oil pressure reading of 5.2 KPA dropped below threshold (10 KPA) on channel B. Alarm ALM-003 triggered at 14:40:05.", severity: "critical", status: "active" },
	{ id: 4, title: "Sensor Failure", description: "Sensor SNR-01 failed to respond for 30 seconds. Alarm ALM-004 triggered at 14:45:10.", severity: "info", status: "resolved" },
	{ id: 5, title: "Power Supply Issue", description: "Voltage fluctuation detected in power supply. Alarm ALM-005 triggered at 14:50:30.", severity: "warning", status: "active" },
]
const alertsColumns = [
	{ header: "ID", accessorKey: "id" },
	{ header: "Title", accessorKey: "title" },
	{ header: "Severity", accessorKey: "severity" },
	{ header: "Timestamp", accessorKey: "timestamp" },
	{ header: "Value", accessorKey: "value" },
]


export default function GeneratorView() {
	useEffect(() => {
		// usar para receber dados e atualizar o estado do componente 
		// E.G. os dados das tabelas de histórico de alertas
	}, []);
	return (<div className="relative max-w-7xl mx-auto px-4 py-6 space-y-5">
		{/* Header */}
		<Header />
		<AlertDefault
			props={{
				title: "Active Alert — Overvoltage Detected",
				description: "Voltage reading of 248.3V exceeded threshold (245V) on channel A. Alarm ALM-001 triggered at 14:32:11.",
				variant: "alert"
			}} />

		{/* ── General Info Row ── */}
		<div className="px-5 pt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
			{payload.metrics.map((metric, index) => (
				<MetricCard key={index} {...metric} />
			))}
		</div>

		{/* Metric Data, Current, Power, Voltage */}
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

			{/* {MetricContainer({
				icon: Activity,
				containerLabel: "Tensões",
				badgeLabel: "Rede",
				color: "cyan",
				payload: payload.networkCurrent,
			})}

			{MetricContainer({
				icon: Activity,
				containerLabel: "Correntes",
				badgeLabel: "Gerador e Rede",
				color: "yellow",
				payload: payload.networkVoltage,
			})}

			{MetricContainer({
				icon: Activity,
				containerLabel: "Potências",
				badgeLabel: "Rede",
				color: "purple",
				payload: payload.networkPower,
			})} */}

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

		{/* Tabela */}
		{/* <DataTable props={{ columns: alertsColumns, data: alertsPayload }} /> */}
		<DataTable2 props={{ columns: alertsColumns, data: alertsPayload }} />
		
	</div>
	);
}
