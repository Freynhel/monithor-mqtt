import type { MCM3320 } from "@monithor-mqtt/shared/types/devices";
import { toFixed, toBinary16, calcHourmeter } from "@monithor-mqtt/shared/lib/normalizerUtils";

export function normalizeMCM3320(dl: Record<string, number>): MCM3320 {
	  return {
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
			gen_factor: dl.gen_factor ?? null,
			gen_apparent: dl.gen_apparent ?? null,
			gen_frequency: dl.gen_frequency ?? null, //toFixed(dl.gen_frequency, 2),
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
			net_factor: dl.net_factor ?? null,
			net_apparent: dl.net_apparent ?? null,
			net_frequency: dl.net_frequency ?? null //toFixed(dl.net_frequency, 2),
		},
		unifilar: {
			generator: dl.generator ?? null,
			network: dl.network ?? null,
			cgr: dl.cgr ?? null,
			crd: dl.crd ?? null,
		},
		general: {
			number_gensets: dl.number_gensets ?? null,
			system_capacity: dl.system_capacity ?? null,
			online_capacity: dl.online_capacity ?? null,
			operation_mode: dl.operation_mode ?? null,
			controller_on_time: dl.controller_on_time ?? null,
			ptc_state: dl.ptc_state ?? null,
			genset_state: dl.genset_state ?? null,
			active_fault: dl.active_fault ?? null,
		},
	}
}