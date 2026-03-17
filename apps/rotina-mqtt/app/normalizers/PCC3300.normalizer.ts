import type { PCC3300 } from "@/app/types/devices";
import { toFixed, toBinary16, calcHourmeter } from "@/lib/utils";

/*
	PCC3300 – Exemplo de Payload:

{
    switch_position: 1,
    genset_state: 3,
    active_fault: 11,
    active_fault_type: 12,
    fault_register: 16,
    fault_register_extended: 17,
    gen_phase_an: 127,
    gen_phase_bn: 128,
    gen_phase_cn: 126,
    gen_phase_ab: 219,
    gen_phase_bc: 221,
    gen_phase_ca: 218,
    gen_phase_a: 55,
    gen_phase_b: 47,
    gen_phase_c: 60,
    gen_L1_kW: 6286,
    gen_L2_kW: 5414,
    gen_L3_kW: 6804,
    gen_Total_kW: 18504,
    gen_L1_kVAr: 3045,
    gen_L2_kVAr: 2623,
    gen_L3_kVAr: 3296,
    gen_total_kVAr: 8960,
    gen_factor: 90,
    gen_L1_kVA: 6985,
    gen_L2_kVA: 6016,
    gen_L3_kVA: 7560,
    gen_total_kVA: 20561,
    battery_voltage: 241,
    oil_pressure: 2,
    coolant_temperature: 42,
    rotation: 1800,
    hourmeter_highbyte: 32,
    hourmeter_lowbyte: 23456,
    net_phase_an: 127,
    net_phase_bn: 128,
    net_phase_cn: 126,
    net_phase_ab: 219,
    net_phase_bc: 221,
    net_phase_ca: 218,
    net_phase_a: 55,
    net_phase_b: 47,
    net_phase_c: 60,
    net_L1_kW: 6286,
    net_L2_kW: 5414,
    net_L3_kW: 6804,
    net_total_kW: 18504,
    net_L1_kVAr: 3045,
    net_L2_kVAr: 2623,
    net_L3_kVAr: 3296,
    net_total_kVAr: 8960,
    net_factor: 90,
    net_L1_kVA: 6985,
    net_L2_kVA: 6016,
    net_L3_kVA: 7560,
    net_total_kVA: 20562,
    net_frequency: 6000,
    net_frequency1: 6000
  }

*/

export function normalizePCC3300(dl: Record<string, number>): PCC3300 {
	return {
		general: {
			controller_type: null, // ❓ não recebido
			switch_position: dl.switch_position ?? null,
			genset_state: dl.genset_state ?? null,
			active_fault: dl.active_fault ?? null,
			active_fault_type: dl.active_fault_type ?? null,
			battery_voltage: toFixed(dl.battery_voltage ?? null, 1),
			oil_pressure: dl.oil_pressure ?? null,
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