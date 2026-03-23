/**
 * lib/mqttNormalizer.ts
 *
 * Client-side MQTT payload normalizer.
 * Converts raw MQTT register values (dl) into typed telemetry objects
 * aligned with the shared device types from @monithor-mqtt/shared.
 *
 * All values are kept as raw numbers — no formatting is applied here.
 * Use displayConfig + format.ts for display concerns.
 */

import type { PCC1302, PCC3300, MCM3320 } from "@monithor-mqtt/shared/types/devices"
import { calcHourmeter, toBinary16 } from "@monithor-mqtt/shared/lib/normalizerUtils"

// ─── Telemetry Types ──────────────────────────────────────────────────────────

type TelemetryBase = {
	timestamp: string | null
}

export type PCC1302Telemetry = TelemetryBase & {
	deviceType: "PCC1302" | "PCC1301" | "PS500" | "PS600"
} & PCC1302

export type PCC3300Telemetry = TelemetryBase & {
	deviceType: "PCC3300" | "PCC3300PTC-A"
} & PCC3300

export type MCM3320Telemetry = TelemetryBase & {
	deviceType: "MCM3320"
} & MCM3320

export type NormalizedTelemetry =
	| PCC1302Telemetry
	| PCC3300Telemetry
	| MCM3320Telemetry

// ─── Type Guards ──────────────────────────────────────────────────────────────

export function isPCC1302(t: NormalizedTelemetry): t is PCC1302Telemetry {
	return ["PCC1302", "PCC1301", "PS500", "PS600"].includes(t.deviceType)
}

export function isPCC3300(t: NormalizedTelemetry): t is PCC3300Telemetry {
	return ["PCC3300", "PCC3300PTC-A"].includes(t.deviceType)
}

export function isMCM3320(t: NormalizedTelemetry): t is MCM3320Telemetry {
	return t.deviceType === "MCM3320"
}

// ─── Internal Utilities ───────────────────────────────────────────────────────

type DL = Record<string, number>

/** Safe accessor — returns null if key is missing from dl */
const get = (dl: DL) => (key: string) => dl[key] ?? null

// ─── Normalizers ──────────────────────────────────────────────────────────────

function normalizePCC1302Payload(
	dl: DL,
	deviceType: PCC1302Telemetry["deviceType"],
	timestamp: string | null,
): PCC1302Telemetry {
	const g = get(dl)
	return {
		deviceType,
		timestamp,
		general: {
			controller_type:     g("controller_type"),
			switch_position:     g("switch_position"),
			genset_state:        g("genset_state"),
			active_fault:        g("active_fault"),
			active_fault_type:   g("active_fault_type"),
			battery_voltage:     g("battery_voltage"),
			oil_pressure:        g("oil_pressure"),
			coolant_temperature: g("coolant_temperature"),
			rotation:            g("rotation"),
			starts:              g("starts"),
			hourmeter_highbyte:  g("hourmeter_highbyte"),
			hourmeter_lowbyte:   g("hourmeter_lowbyte"),
			hourmeter:           calcHourmeter(dl.hourmeter_highbyte, dl.hourmeter_lowbyte),
		},
		alarm: {
			fault_register:          toBinary16(dl.fault_register),
			fault_register_extended: toBinary16(dl.fault_register_extended),
		},
		generator: {
			gen_phase_an: g("gen_phase_an"),
			gen_phase_bn: g("gen_phase_bn"),
			gen_phase_cn: g("gen_phase_cn"),
			gen_phase_ab: g("gen_phase_ab"),
			gen_phase_bc: g("gen_phase_bc"),
			gen_phase_ca: g("gen_phase_ca"),
			gen_phase_a:  g("gen_phase_a"),
			gen_phase_b:  g("gen_phase_b"),
			gen_phase_c:  g("gen_phase_c"),
			gen_active:   g("gen_active"),
			gen_reactive: g("gen_reactive"),
			gen_apparent: g("gen_apparent"),
			gen_factor:   g("gen_factor"),
		},
	}
}

function normalizePCC3300Payload(
	dl: DL,
	deviceType: PCC3300Telemetry["deviceType"],
	timestamp: string | null,
): PCC3300Telemetry {
	const g = get(dl)
	return {
		deviceType,
		timestamp,
		general: {
			controller_type:     g("controller_type"),
			switch_position:     g("switch_position"),
			genset_state:        g("genset_state"),
			active_fault:        g("active_fault"),
			active_fault_type:   g("active_fault_type"),
			battery_voltage:     g("battery_voltage"),
			oil_pressure:        g("oil_pressure"),
			coolant_temperature: g("coolant_temperature"),
			rotation:            g("rotation"),
			starts:              g("starts"),
			hourmeter_highbyte:  g("hourmeter_highbyte"),
			hourmeter_lowbyte:   g("hourmeter_lowbyte"),
			hourmeter:           calcHourmeter(dl.hourmeter_highbyte, dl.hourmeter_lowbyte),
		},
		alarm: {
			fault_register:          toBinary16(dl.fault_register),
			fault_register_extended: toBinary16(dl.fault_register_extended),
		},
		generator: {
			gen_phase_an:  g("gen_phase_an"),
			gen_phase_bn:  g("gen_phase_bn"),
			gen_phase_cn:  g("gen_phase_cn"),
			gen_phase_ab:  g("gen_phase_ab"),
			gen_phase_bc:  g("gen_phase_bc"),
			gen_phase_ca:  g("gen_phase_ca"),
			gen_phase_a:   g("gen_phase_a"),
			gen_phase_b:   g("gen_phase_b"),
			gen_phase_c:   g("gen_phase_c"),
			gen_active:    g("gen_active"),
			gen_reactive:  g("gen_reactive"),
			gen_apparent:  g("gen_apparent"),
			gen_factor:    g("gen_factor"),
			gen_frequency: g("gen_frequency"),
		},
		network: {
			net_phase_an:  g("net_phase_an"),
			net_phase_bn:  g("net_phase_bn"),
			net_phase_cn:  g("net_phase_cn"),
			net_phase_ab:  g("net_phase_ab"),
			net_phase_bc:  g("net_phase_bc"),
			net_phase_ca:  g("net_phase_ca"),
			net_phase_a:   g("net_phase_a"),
			net_phase_b:   g("net_phase_b"),
			net_phase_c:   g("net_phase_c"),
			net_active:    g("net_active"),
			net_reactive:  g("net_reactive"),
			net_apparent:  g("net_apparent"),
			net_factor:    g("net_factor"),
			net_frequency: g("net_frequency"),
		},
	}
}

function normalizeMCM3320Payload(
	dl: DL,
	timestamp: string | null,
): MCM3320Telemetry {
	const g = get(dl)
	return {
		deviceType: "MCM3320",
		timestamp,
		general: {
			number_gensets:     g("number_gensets"),
			system_capacity:    g("system_capacity"),
			online_capacity:    g("online_capacity"),
			operation_mode:     g("operation_mode"),
			controller_on_time: g("controller_on_time"),
			ptc_state:          g("ptc_state"),
			genset_state:       g("genset_state"),
			active_fault:       g("active_fault"),
		},
		generator: {
			gen_phase_an:  g("gen_phase_an"),
			gen_phase_bn:  g("gen_phase_bn"),
			gen_phase_cn:  g("gen_phase_cn"),
			gen_phase_ab:  g("gen_phase_ab"),
			gen_phase_bc:  g("gen_phase_bc"),
			gen_phase_ca:  g("gen_phase_ca"),
			gen_phase_a:   g("gen_phase_a"),
			gen_phase_b:   g("gen_phase_b"),
			gen_phase_c:   g("gen_phase_c"),
			gen_active:    g("gen_active"),
			gen_reactive:  g("gen_reactive"),
			gen_apparent:  g("gen_apparent"),
			gen_factor:    g("gen_factor"),
			gen_frequency: g("gen_frequency"),
		},
		network: {
			net_phase_an:  g("net_phase_an"),
			net_phase_bn:  g("net_phase_bn"),
			net_phase_cn:  g("net_phase_cn"),
			net_phase_ab:  g("net_phase_ab"),
			net_phase_bc:  g("net_phase_bc"),
			net_phase_ca:  g("net_phase_ca"),
			net_phase_a:   g("net_phase_a"),
			net_phase_b:   g("net_phase_b"),
			net_phase_c:   g("net_phase_c"),
			net_active:    g("net_active"),
			net_reactive:  g("net_reactive"),
			net_apparent:  g("net_apparent"),
			net_factor:    g("net_factor"),
			net_frequency: g("net_frequency"),
		},
		unifilar: {
			generator: g("generator"),
			network:   g("network"),
			cgr:       g("cgr"),
			crd:       g("crd"),
		},
	}
}

// ─── Normalizer Registry ──────────────────────────────────────────────────────

type NormalizerFn = (
	dl: DL,
	deviceType: string,
	timestamp: string | null,
) => NormalizedTelemetry

const normalizers: Record<string, NormalizerFn> = {
	PCC1301:        (dl, da, ts) => normalizePCC1302Payload(dl, da as PCC1302Telemetry["deviceType"], ts),
	PCC1302:        (dl, da, ts) => normalizePCC1302Payload(dl, da as PCC1302Telemetry["deviceType"], ts),
	PS500:          (dl, da, ts) => normalizePCC1302Payload(dl, da as PCC1302Telemetry["deviceType"], ts),
	PS600:          (dl, da, ts) => normalizePCC1302Payload(dl, da as PCC1302Telemetry["deviceType"], ts),
	PCC3300:        (dl, da, ts) => normalizePCC3300Payload(dl, da as PCC3300Telemetry["deviceType"], ts),
	"PCC3300PTC-A": (dl, da, ts) => normalizePCC3300Payload(dl, da as PCC3300Telemetry["deviceType"], ts),
	MCM3320:        (dl, _da, ts) => normalizeMCM3320Payload(dl, ts),
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function normalizeMqttPayload(
	dl: DL,
	deviceType: string,
	timestamp: string | null,
): NormalizedTelemetry | null {
	const normalizer = normalizers[deviceType]
	if (!normalizer) {
		console.warn(`[mqttNormalizer] No normalizer for device type: "${deviceType}"`)
		return null
	}
	return normalizer(dl, deviceType, timestamp)
}

// ─── Label Helpers ────────────────────────────────────────────────────────────

export const GENSET_STATE_LABEL: Record<number, string> = {
	0: "Parado",
	1: "Pré-Inicialização",
	2: "Subida de Rotação",
	3: "Em Funcionamento",
}

export const OPERATION_MODE_LABEL: Record<number, string> = {
	0: "Off",
	1: "Auto",
	2: "Manual",
	3: "Teste",
}

export const FAULT_TYPE_LABEL: Record<number, string> = {
	0: "Normal",
	1: "Aviso",
	4: "Desligamento",
}

export function gensetStateLabel(state: number | null): string {
	if (state === null) return "–"
	return GENSET_STATE_LABEL[state] ?? String(state)
}

export function operationModeLabel(mode: number | null): string {
	if (mode === null) return "–"
	return OPERATION_MODE_LABEL[mode] ?? String(mode)
}

export function faultTypeLabel(type: number | null): string {
	if (type === null) return "–"
	return FAULT_TYPE_LABEL[type] ?? String(type)
}