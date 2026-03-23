/**
 * lib/fieldMeta.ts
 *
 * Maps field names to their Lucide icon and Tailwind color for display.
 * Frontend-only — not shared with the backend.
 *
 * Used by buildPayload to construct MetricCard and MetricContainer props.
 */

import {
	Activity,
	BatteryCharging,
	ChartColumn,
	Cpu,
	Gauge,
	Power,
	ThermometerSnowflake,
	TriangleAlert,
	WavesArrowDown,
	Wifi,
	Zap,
	Clock,
	Network,
	type LucideIcon,
} from "lucide-react";

export type FieldMeta = {
	icon: LucideIcon;
	color: string;
};

export const FIELD_META: Record<string, FieldMeta> = {
	// ── General (PCC1302 / PCC3300) ───────────────────────────────────────────
	hourmeter:           { icon: Activity,            color: "teal"    },
	starts:              { icon: Power,               color: "pink"    },
	coolant_temperature: { icon: ThermometerSnowflake, color: "yellow" },
	oil_pressure:        { icon: WavesArrowDown,       color: "blue"   },
	switch_position:     { icon: Gauge,               color: "orange"  },
	rotation:            { icon: Gauge,               color: "teal"    },
	battery_voltage:     { icon: BatteryCharging,     color: "yellow"  },
	active_fault:        { icon: TriangleAlert,       color: "orange"  },

	// ── General (MCM3320) ─────────────────────────────────────────────────────
	number_gensets:      { icon: Cpu,                 color: "cyan"    },
	system_capacity:     { icon: Zap,                 color: "emerald" },
	online_capacity:     { icon: Zap,                 color: "teal"    },
	operation_mode:      { icon: Gauge,               color: "orange"  },
	controller_on_time:  { icon: Clock,               color: "teal"    },
	ptc_state:           { icon: Power,               color: "blue"    },
	genset_state:        { icon: Power,               color: "pink"    },

	// ── Generator voltages ────────────────────────────────────────────────────
	gen_phase_an:        { icon: Activity,            color: "cyan"    },
	gen_phase_bn:        { icon: Activity,            color: "cyan"    },
	gen_phase_cn:        { icon: Activity,            color: "cyan"    },
	gen_phase_ab:        { icon: Activity,            color: "cyan"    },
	gen_phase_bc:        { icon: Activity,            color: "cyan"    },
	gen_phase_ca:        { icon: Activity,            color: "cyan"    },

	// ── Generator currents ────────────────────────────────────────────────────
	gen_phase_a:         { icon: Zap,                 color: "yellow"  },
	gen_phase_b:         { icon: Zap,                 color: "yellow"  },
	gen_phase_c:         { icon: Zap,                 color: "yellow"  },

	// ── Generator power ───────────────────────────────────────────────────────
	gen_active:          { icon: ChartColumn,         color: "purple"  },
	gen_reactive:        { icon: ChartColumn,         color: "pink"    },
	gen_apparent:        { icon: ChartColumn,         color: "fuchsia" },
	gen_factor:          { icon: ChartColumn,         color: "orange"  },
	gen_frequency:       { icon: Wifi,                color: "pink"    },

	// ── Network voltages ──────────────────────────────────────────────────────
	net_phase_an:        { icon: Activity,            color: "blue"    },
	net_phase_bn:        { icon: Activity,            color: "blue"    },
	net_phase_cn:        { icon: Activity,            color: "blue"    },
	net_phase_ab:        { icon: Activity,            color: "blue"    },
	net_phase_bc:        { icon: Activity,            color: "blue"    },
	net_phase_ca:        { icon: Activity,            color: "blue"    },

	// ── Network currents ──────────────────────────────────────────────────────
	net_phase_a:         { icon: Zap,                 color: "indigo"  },
	net_phase_b:         { icon: Zap,                 color: "indigo"  },
	net_phase_c:         { icon: Zap,                 color: "indigo"  },

	// ── Network power ─────────────────────────────────────────────────────────
	net_active:          { icon: ChartColumn,         color: "emerald" },
	net_reactive:        { icon: ChartColumn,         color: "teal"    },
	net_apparent:        { icon: ChartColumn,         color: "green"   },
	net_factor:          { icon: ChartColumn,         color: "cyan"    },
	net_frequency:       { icon: Wifi,                color: "blue"    },
};

/** Returns the meta for a field, with safe fallback */
export function getFieldMeta(field: string): FieldMeta {
	return FIELD_META[field] ?? { icon: Activity, color: "slate" };
}