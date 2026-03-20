import type { PCC3300 } from "@monithor-mqtt/shared/types/devices";
import { toFixed, toBinary16, calcHourmeter } from "@monithor-mqtt/shared/lib/normalizerUtils";

export function normalizePCC3300(dl: Record<string, number>): PCC3300 {
	return {
		general: {
			controller_type: dl.controller_type ?? null,
			switch_position: dl.switch_position ?? null,
			genset_state: dl.genset_state ?? null,
			active_fault: dl.active_fault ?? null,
			active_fault_type: dl.active_fault_type ?? null,
			battery_voltage: dl.battery_voltage ?? null, //❗ toFixed(dl.battery_voltage, 1),
			oil_pressure: dl.oil_pressure ?? null, //❗ toFixed(dl.oil_pressure, 1),
			coolant_temperature: dl.coolant_temperature ?? null, //❗ toFixed(dl.coolant_temperature, 1),
			rotation: dl.rotation ?? null,
			starts: dl.starts ?? null,
			hourmeter_highbyte: dl.hourmeter_highbyte ?? null,
			hourmeter_lowbyte: dl.hourmeter_lowbyte ?? null,
			hourmeter: calcHourmeter(dl.hourmeter_highbyte, dl.hourmeter_lowbyte),
		},

		alarm: {
			fault_register: toBinary16(dl.fault_register ?? null) ,
			fault_register_extended: toBinary16(dl.fault_register_extended ?? null),
		},

		network: {
			net_phase_an: dl.net_phase_an ?? null,
			net_phase_bn: dl.net_phase_bn ?? null,
			net_phase_cn: dl.net_phase_cn ?? null,
			net_phase_ab: dl.net_phase_ab ?? null,
			net_phase_bc: dl.net_phase_bc ?? null,
			net_phase_ca: dl.net_phase_ca ?? null,
			net_phase_a: dl.net_phase_a ?? null,
			net_phase_b: dl.net_phase_b ?? null,
			net_phase_c: dl.net_phase_c ?? null,
			net_active: dl.net_active ?? null,
			net_reactive: dl.net_reactive ?? null,
			net_apparent: dl.net_apparent ?? null,
			net_factor: dl.net_factor ?? null,
			net_frequency: dl.net_frequency ?? null, //❗ toFixed(dl.net_frequency), // 6010 → 60.1 Hz
		},

		generator: {
			gen_phase_an: dl.gen_phase_an ?? null,
			gen_phase_bn: dl.gen_phase_bn ?? null,
			gen_phase_cn: dl.gen_phase_cn ?? null,	
			gen_phase_ab: dl.gen_phase_ab ?? null,
			gen_phase_bc: dl.gen_phase_bc ?? null,
			gen_phase_ca: dl.gen_phase_ca ?? null,
			gen_phase_a: dl.gen_phase_a ?? null,
			gen_phase_b: dl.gen_phase_b ?? null,	
			gen_phase_c: dl.gen_phase_c ?? null,
			gen_active: dl.gen_active ?? null,
			gen_reactive: dl.gen_reactive ?? null,
			gen_apparent: dl.gen_apparent ?? null,
			gen_factor: dl.gen_factor ?? null,
			gen_frequency: dl.gen_frequency ?? null, //❗ toFixed(dl.gen_frequency), // 6010 → 60.1 Hz
		},
	}
}