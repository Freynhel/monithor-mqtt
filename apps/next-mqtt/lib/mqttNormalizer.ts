/**
 * lib/mqttNormalizer.ts
 *
 * Client-side mirror of the backend normalizers.
 * Converts raw MQTT register values (dl) into a unified, dashboard-ready
 * NormalizedTelemetry shape — no business logic divergence from the server.
 *
 * Add new device types by implementing a normalizer function and registering
 * it in the `normalizers` map at the bottom of this file.
 */

// ─── Unified telemetry shape ──────────────────────────────────────────────────

export type NormalizedTelemetry = {
	// ── Identification ──────────────────────────────────────────────
	deviceType: string;
	timestamp: string | null;

	// ── General / controller ────────────────────────────────────────
	controllerType: number | null;
	/** Raw numeric mode: 0=Off 1=Auto 2=Manual 3=Teste */
	operationMode: number | null;
	/** Raw numeric state: 0=Parado 1=Pré-Inicialização 2=Subida 3=Em Funcionamento */
	gensetState: number | null;
	activeFault: number | null;
	/** Raw numeric fault type: 0=Normal 1=Aviso 4=Desligamento */
	activeFaultType: number | null;
	battery: string | null;          // volts, pre-formatted
	oilPressure: number | null;      // KPA
	coolantTemp: string | null;      // °C, pre-formatted

	// ── Engine ──────────────────────────────────────────────────────
	rotation: number | null;         // RPM
	starts: number | null;
	hourmeter: number | null;        // hours

	// ── Generator electrical ────────────────────────────────────────
	genFrequency: string | null;     // Hz, pre-formatted
	genPhaseAN: number | null;       // V
	genPhaseBN: number | null;
	genPhaseCN: number | null;
	genPhaseAB: number | null;
	genPhaseBC: number | null;
	genPhaseCA: number | null;
	genPhaseA: number | null;        // A
	genPhaseB: number | null;
	genPhaseC: number | null;
	genActive: number | null;        // kW
	genReactive: number | null;      // kVAR
	genApparent: number | null;      // kVA
	genFactor: number | null;        // power factor

	// ── Network / utility (if device supports it) ───────────────────
	netPhaseAN: number | null;
	netPhaseBN: number | null;
	netPhaseCN: number | null;
	netPhaseAB: number | null;
	netPhaseBC: number | null;
	netPhaseCA: number | null;
	netPhaseA: number | null;
	netPhaseB: number | null;
	netPhaseC: number | null;
	netActive: number | null;
	netReactive: number | null;
	netApparent: number | null;
	netFactor: number | null;
	netFrequency: string | null;
};

// ─── Utility helpers (same logic as @/lib/utils in the backend) ───────────────

/** Divides by 10 and formats to `decimals` decimal places. Returns null on bad input. */
function toFixed(value: number | undefined | null, decimals = 1): string | null {
	if (value == null || isNaN(value as number)) return null;
	return ((value as number) / 10).toFixed(decimals);
}

/** Calculates hourmeter from its two 16-bit halves. */
function calcHourmeter(high?: number, low?: number): number | null {
	if (high === undefined || low === undefined || high === null || low === null) return null;
	return high * 65536 + low;
}

// ─── Null-filled base object ──────────────────────────────────────────────────

function emptyTelemetry(deviceType: string, timestamp: string | null): NormalizedTelemetry {
	return {
		deviceType,
		timestamp,
		controllerType: null,
		operationMode: null,
		gensetState: null,
		activeFault: null,
		activeFaultType: null,
		battery: null,
		oilPressure: null,
		coolantTemp: null,
		rotation: null,
		starts: null,
		hourmeter: null,
		genFrequency: null,
		genPhaseAN: null, genPhaseBN: null, genPhaseCN: null,
		genPhaseAB: null, genPhaseBC: null, genPhaseCA: null,
		genPhaseA: null,  genPhaseB: null,  genPhaseC: null,
		genActive: null, genReactive: null, genApparent: null, genFactor: null,
		netPhaseAN: null, netPhaseBN: null, netPhaseCN: null,
		netPhaseAB: null, netPhaseBC: null, netPhaseCA: null,
		netPhaseA: null,  netPhaseB: null,  netPhaseC: null,
		netActive: null, netReactive: null, netApparent: null,
		netFactor: null, netFrequency: null,
	};
}

// ─── Device-specific normalizers ─────────────────────────────────────────────

type DL = Record<string, number>;
type PartialTelemetry = Partial<Omit<NormalizedTelemetry, "deviceType" | "timestamp">>;

function normalizePCC1302(dl: DL): PartialTelemetry {
	return {
		controllerType:  dl.general_1   ?? null,
		operationMode:   dl.general_2   ?? null,
		gensetState:     dl.general_3   ?? null,
		activeFault:     dl.general_4   ?? null,
		activeFaultType: dl.general_5   ?? null,
		battery:         toFixed(dl.general_1_1),
		oilPressure:     dl.general_1_2 ?? null,
		coolantTemp:     toFixed(dl.temperature),
		rotation:        dl.engine_1    ?? null,
		starts:          dl.engine_2    ?? null,
		hourmeter:       calcHourmeter(dl.engine_3, dl.engine_4),
		genPhaseAN:      dl.voltage_1   ?? null,
		genPhaseBN:      dl.voltage_2   ?? null,
		genPhaseCN:      dl.voltage_3   ?? null,
		genPhaseAB:      dl.voltage_5   ?? null,
		genPhaseBC:      dl.voltage_6   ?? null,
		genPhaseCA:      dl.voltage_7   ?? null,
		genPhaseA:       dl.current_1   ?? null,
		genPhaseB:       dl.current_2   ?? null,
		genPhaseC:       dl.current_3   ?? null,
		genApparent:     dl.power_4     ?? null,
	};
}

function normalizePCC3300(dl: DL): PartialTelemetry {
	return {
		controllerType:  dl.General_1           ?? null,
		operationMode:   dl.General_2           ?? null,
		gensetState:     dl.General_3           ?? null,
		activeFault:     dl.General_4           ?? null,
		genFrequency:    toFixed(dl.frequency),
		hourmeter:       calcHourmeter(undefined, undefined),
		genPhaseAN:      dl.voltage_1           ?? null,
		genPhaseBN:      dl.voltage_2           ?? null,
		genPhaseCN:      dl.voltage_3           ?? null,
		genPhaseAB:      dl.voltage_5           ?? null,
		genPhaseBC:      dl.voltage_6           ?? null,
		genPhaseCA:      dl.voltage_7           ?? null,
		genPhaseA:       dl.current_1           ?? null,
		genPhaseB:       dl.current_2           ?? null,
		genPhaseC:       dl.current_3           ?? null,
		netPhaseA:       dl.utility_current_1   ?? null,
		netPhaseB:       dl.utility_current_2   ?? null,
		netPhaseC:       dl.utility_current_3   ?? null,
		netActive:       dl.utility_power_1     ?? null,
		netReactive:     dl.utility_power_2     ?? null,
		netApparent:     dl.utility_power_3     ?? null,
		netFactor:       dl.utility_power_4     ?? null,
		netFrequency:    toFixed(dl.utility_frequency),
	};
}

// ─── Normalizer registry ──────────────────────────────────────────────────────

const normalizers: Record<string, (dl: DL) => PartialTelemetry> = {
	PCC1301: normalizePCC1302,
	PCC1302: normalizePCC1302,
	PS500:   normalizePCC1302,
	PS600:   normalizePCC1302,
	PCC3300: normalizePCC3300,
	"PCC3300PTC-A": normalizePCC3300,
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Normalize a raw MQTT message payload into a unified NormalizedTelemetry object.
 * Returns `null` if no normalizer is registered for the given `deviceType`.
 */
export function normalizeMqttPayload(
	dl: DL,
	deviceType: string,
	timestamp: string | null,
): NormalizedTelemetry | null {
	const normalizer = normalizers[deviceType];
	if (!normalizer) {
		console.warn(`[mqttNormalizer] No normalizer for device type: "${deviceType}"`);
		return null;
	}
	return { ...emptyTelemetry(deviceType, timestamp), ...normalizer(dl) };
}

// ─── Label helpers (shared by page and any consumer) ─────────────────────────

export const GENSET_STATE_LABEL: Record<number, string> = {
	0: "Parado",
	1: "Pré-Inicialização",
	2: "Subida de Rotação",
	3: "Em Funcionamento",
};

export const OPERATION_MODE_LABEL: Record<number, string> = {
	0: "Off",
	1: "Auto",
	2: "Manual",
	3: "Teste",
};

export const FAULT_TYPE_LABEL: Record<number, string> = {
	0: "Normal",
	1: "Aviso",
	4: "Desligamento",
};

export function gensetStateLabel(state: number | null): string {
	if (state === null) return "–";
	return GENSET_STATE_LABEL[state] ?? String(state);
}

export function operationModeLabel(mode: number | null): string {
	if (mode === null) return "–";
	return OPERATION_MODE_LABEL[mode] ?? String(mode);
}

export function faultTypeLabel(type: number | null): string {
	if (type === null) return "–";
	return FAULT_TYPE_LABEL[type] ?? String(type);
}