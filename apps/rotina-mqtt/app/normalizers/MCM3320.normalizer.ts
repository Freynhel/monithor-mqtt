import type { MCM3320 } from "@/app/types/devices";
import { toFixed, toBinary16, calcHourmeter } from "@/lib/utils";

export function normalizeMCM3320(dl: Record<string, number>): MCM3320 {
	  return {
			generator: {
			gen_status: dl.placeholder ?? null,
			gen_phase_an: dl.placeholder ?? null,
			gen_phase_bn: dl.placeholder ?? null,
			gen_phase_cn: dl.placeholder ?? null,
			gen_phase_ab: dl.placeholder ?? null,
			gen_phase_bc: dl.placeholder ?? null,
			gen_phase_ca: dl.placeholder ?? null,
			gen_phase_a: dl.placeholder ?? null,
			gen_phase_b: dl.placeholder ?? null,
			gen_phase_c: dl.placeholder ?? null,
			gen_active: dl.placeholder ?? null,
			gen_reactive: dl.placeholder ?? null,
			gen_factor: dl.placeholder ?? null,
			gen_apparent: dl.placeholder ?? null,
			gen_frequency: toFixed(dl.placeholder ?? null, 2),
		},
		network: {
			net_status: dl.placeholder ?? null,
			net_phase_an: dl.placeholder ?? null,
			net_phase_bn: dl.placeholder ?? null,
			net_phase_cn: dl.placeholder ?? null,
			net_phase_ab: dl.placeholder ?? null,
			net_phase_bc: dl.placeholder ?? null,
			net_phase_ca: dl.placeholder ?? null,
			net_phase_a: dl.placeholder ?? null,
			net_phase_b: dl.placeholder ?? null,
			net_phase_c: dl.placeholder ?? null,
			net_active: dl.placeholder ?? null,
			net_reactive: dl.placeholder ?? null,
			net_factor: dl.placeholder ?? null,
			net_apparent: dl.placeholder ?? null,
			net_frequency: toFixed(dl.placeholder ?? null, 2),
		},
		unifilar: {
			generator: dl.placeholder ?? null,
			network: dl.placeholder ?? null,
			cgr: dl.placeholder ?? null,
			crd: dl.placeholder ?? null,
		},
		other: {
			number_gensets: dl.placeholder ?? null,
			system_capacity: dl.placeholder ?? null,
			online_capacity: dl.placeholder ?? null,
			operation_mode: dl.placeholder ?? null,
			controller_on_time: dl.placeholder ?? null,
			ptc_state: dl.placeholder ?? null,
			genset_state: dl.placeholder ?? null,
			active_fault: dl.placeholder ?? null,
		},
	}
}