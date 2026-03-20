import type { PCC3300 } from "@monithor-mqtt/shared/types/devices";
import { toFixed, toBinary16, calcHourmeter } from "@/lib/utils";

export function normalizePCC3300(dl: Record<string, number>): PCC3300 {
	return {
		general: {
			controller_type: null, // ❓ não recebido
			switch_position: dl.switch_position ?? null,
			genset_state: dl.genset_state ?? null,
			active_fault: dl.active_fault ?? null,
			active_fault_type: dl.active_fault_type ?? null,
			battery_voltage: toFixed(dl.battery_voltage ?? null, 1),
			oil_pressure: toFixed(dl.oil_pressure ?? null, 1),
			coolant_temperature: toFixed(dl.coolant_temperature ?? null, 1),
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
			net_active: null,  // ❓ não recebido
			net_reactive:null,  // ❓ não recebido
			net_apparent: null,  // ❓ não recebido
			net_factor: dl.net_factor ?? null,
			net_frequency: toFixed(dl.net_frequency ?? null), // 6010 → 60.1 Hz
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
			gen_active: null,   // ❓ não recebido
			gen_reactive: null, // ❓ não recebido
			gen_apparent: null, // ❓ não recebido
			gen_factor: dl.gen_factor ?? null,
			gen_frequency: toFixed(dl.gen_frequency ?? null), // 6010 → 60.1 Hz
		},
	};
}