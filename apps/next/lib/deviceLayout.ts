/**
 * lib/deviceLayout.ts
 *
 * Defines which fields and sections are relevant for each device type.
 * This is the single source of truth for conditional rendering on the dashboard.
 *
 * Pure data — no icons, no formatting, no React dependencies.
 */

export type DeviceLayoutConfig = {
	/** Fields shown in the top metrics row */
	metricsFields: string[];
	/** Generator voltage fields (AN, BN, CN, AB, BC, CA) */
	generatorVoltageFields: string[];
	/** Generator current fields (A, B, C) */
	generatorCurrentFields: string[];
	/** Generator power fields (active, reactive, apparent, factor) */
	generatorPowerFields: string[];
	/** Whether to show the network electrical section */
	hasNetworkSection: boolean;
	networkVoltageFields: string[];
	networkCurrentFields: string[];
	networkPowerFields: string[];
	/** Whether to show the unifilar section (MCM3320 only) */
	hasUnifilarSection: boolean;
};

// ─── Shared field groups ──────────────────────────────────────────────────────

const GENERATOR_VOLTAGES = [
	"gen_phase_an", "gen_phase_bn", "gen_phase_cn",
	"gen_phase_ab", "gen_phase_bc", "gen_phase_ca",
];

const GENERATOR_CURRENTS = ["gen_phase_a", "gen_phase_b", "gen_phase_c"];

const GENERATOR_POWER = [
	"gen_active", "gen_reactive", "gen_apparent", "gen_factor",
];

const NETWORK_VOLTAGES = [
	"net_phase_an", "net_phase_bn", "net_phase_cn",
	"net_phase_ab", "net_phase_bc", "net_phase_ca",
];

const NETWORK_CURRENTS = ["net_phase_a", "net_phase_b", "net_phase_c"];

const NETWORK_POWER = [
	"net_active", "net_reactive", "net_apparent", "net_factor",
];

// ─── Layout definitions ───────────────────────────────────────────────────────

const PCC1302_LAYOUT: DeviceLayoutConfig = {
	metricsFields: [
		"hourmeter",
		"starts",
		"coolant_temperature",
		"oil_pressure",
		"switch_position",
		"rotation",
		"battery_voltage",
		"active_fault",
	],
	generatorVoltageFields: GENERATOR_VOLTAGES,
	generatorCurrentFields: GENERATOR_CURRENTS,
	generatorPowerFields:   GENERATOR_POWER,
	hasNetworkSection:      false,
	networkVoltageFields:   [],
	networkCurrentFields:   [],
	networkPowerFields:     [],
	hasUnifilarSection:     false,
};

const PCC3300_LAYOUT: DeviceLayoutConfig = {
	metricsFields: [
		"hourmeter",
		"starts",
		"coolant_temperature",
		"oil_pressure",
		"switch_position",
		"rotation",
		"gen_frequency",
		"battery_voltage",
		"active_fault",
	],
	generatorVoltageFields: GENERATOR_VOLTAGES,
	generatorCurrentFields: GENERATOR_CURRENTS,
	generatorPowerFields:   GENERATOR_POWER,
	hasNetworkSection:      true,
	networkVoltageFields:   NETWORK_VOLTAGES,
	networkCurrentFields:   NETWORK_CURRENTS,
	networkPowerFields:     NETWORK_POWER,
	hasUnifilarSection:     false,
};

const MCM3320_LAYOUT: DeviceLayoutConfig = {
	metricsFields: [
		"number_gensets",
		"system_capacity",
		"online_capacity",
		"operation_mode",
		"controller_on_time",
		"ptc_state",
		"genset_state",
		"active_fault",
	],
	generatorVoltageFields: GENERATOR_VOLTAGES,
	generatorCurrentFields: GENERATOR_CURRENTS,
	generatorPowerFields:   GENERATOR_POWER,
	hasNetworkSection:      true,
	networkVoltageFields:   NETWORK_VOLTAGES,
	networkCurrentFields:   NETWORK_CURRENTS,
	networkPowerFields:     NETWORK_POWER,
	hasUnifilarSection:     true,
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const DEVICE_LAYOUT: Record<string, DeviceLayoutConfig> = {
	PCC1301:          PCC1302_LAYOUT,
	PCC1302:          PCC1302_LAYOUT,
	PS500:            PCC1302_LAYOUT,
	PS600:            PCC1302_LAYOUT,
	PCC3300:          PCC3300_LAYOUT,
	"PCC3300PTC-A":   PCC3300_LAYOUT,
	MCM3320:          MCM3320_LAYOUT,
};

/** Returns the layout for a given device type, or undefined if unknown */
export function getDeviceLayout(deviceType: string): DeviceLayoutConfig | undefined {
	return DEVICE_LAYOUT[deviceType];
}