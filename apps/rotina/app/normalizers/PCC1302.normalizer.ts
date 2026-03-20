import type { PCC1302 } from "@monithor-mqtt/shared/types/devices";
import { toFixed, toBinary16, calcHourmeter } from "@/lib/utils";

export function normalizePCC1302(dl: Record<string, number>): PCC1302 {
	return {
		general: {
			controller_type: dl.general_1 ?? null,
			switch_position: dl.general_2 ?? null,
			genset_state: dl.general_3 ?? null,
			active_fault: dl.general_4 ?? null,
			active_fault_type: dl.general_5 ?? null,
			battery_voltage: toFixed(dl.general_1_1),
			oil_pressure: dl.general_1_2 ?? null,
			coolant_temperature: toFixed(dl.temperature),
			hourmeter_highbyte: dl.engine_3 ?? null,
			hourmeter_lowbyte: dl.engine_4 ?? null,
			hourmeter: calcHourmeter(dl.engine_3, dl.engine_4),
			rotation: dl.engine_1 ?? null,
			starts: dl.engine_2 ?? null,
		},

		alarm: {
			fault_register: toBinary16(dl.alarm_1),
			fault_register_extended: toBinary16(dl.alarm_2),
		},

		generator: {
			gen_phase_an: dl.voltage_1 ?? null,
			gen_phase_bn: dl.voltage_2 ?? null,
			gen_phase_cn: dl.voltage_3 ?? null,
			gen_phase_ab: dl.voltage_5 ?? null,
			gen_phase_bc: dl.voltage_6 ?? null,
			gen_phase_ca: dl.voltage_7 ?? null,
			gen_phase_a: dl.current_1 ?? null,
			gen_phase_b: dl.current_2 ?? null,
			gen_phase_c: dl.current_3 ?? null,
			gen_apparent: dl.power_4 ?? null,
		}
	};
}