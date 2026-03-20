import type { PCC1302 } from "@monithor-mqtt/shared/types/devices";
import { toFixed, toBinary16, calcHourmeter } from "@monithor-mqtt/shared/lib/normalizerUtils";

export function normalizePCC1302(dl: Record<string, number>): PCC1302 {
	return {
		general: {
			controller_type: dl.controller_type ?? null,
			switch_position: dl.switch_position ?? null,
			genset_state: dl.genset_state ?? null,
			active_fault: dl.active_fault ?? null,
			active_fault_type: dl.active_fault_type ?? null,
			battery_voltage: dl.battery_voltage ?? null, //toFixed(dl.battery_voltage),
			oil_pressure: dl.oil_pressure ?? null,
			coolant_temperature: dl.coolant_temperature ?? null,//toFixed(dl.coolant_temperature),
			hourmeter_highbyte: dl.hourmeter_highbyte ?? null,
			hourmeter_lowbyte: dl.hourmeter_lowbyte ?? null,
			hourmeter: calcHourmeter(dl.hourmeter_highbyte, dl.hourmeter_lowbyte),
			rotation: dl.rotation ?? null,
			starts: dl.starts ?? null,
		},

		alarm: {
			fault_register: toBinary16(dl.fault_register),
			fault_register_extended: toBinary16(dl.fault_register_extended),
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
			gen_apparent: dl.gen_apparent ?? null,
			gen_active: dl.gen_active ?? null,
			gen_reactive: dl.gen_reactive ?? null,
			gen_factor: dl.gen_factor ?? null, //toFixed(dl.power_6, 1),
		}
	};
}