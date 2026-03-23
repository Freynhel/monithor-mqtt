/**
 * lib/displayConfig.ts
 *
 * Defines how each raw numeric field should be formatted for display.
 * This is the single source of truth for:
 *   - How to divide the raw register value
 *   - How many decimal places to show
 *   - What unit label to append
 *   - What human-readable label to use
 *
 * Used by format.ts — never applied in the normalizer.
 */

export type FieldDisplay = {
	/** Divides the raw value before display (e.g. 241 / 10 = 24.1) */
	divider: number
	/** Decimal places to show after dividing */
	decimals: number
	/** Unit label shown after the value */
	unit: string
	/** Human-readable label for the field */
	label: string
}

export const FIELD_DISPLAY: Record<string, FieldDisplay> = {
	// ── General ──────────────────────────────────────────────────────────────
	battery_voltage:     { divider: 10,  decimals: 1, unit: "Vcc",  label: "Tensão Bateria"   },
	coolant_temperature: { divider: 10,  decimals: 1, unit: "°C",   label: "Temp. Refrig."    },
	oil_pressure:        { divider: 1,   decimals: 0, unit: "KPA",  label: "Pressão Óleo"     },
	rotation:            { divider: 1,   decimals: 0, unit: "rpm",  label: "Rotação"          },
	hourmeter:           { divider: 1,   decimals: 1, unit: "h",    label: "Horímetro"        },
	starts:              { divider: 1,   decimals: 0, unit: "",     label: "Partidas"         },

	// MCM3320 general
	number_gensets:      { divider: 1,   decimals: 0, unit: "",     label: "Nº Geradores"     },
	system_capacity:     { divider: 1,   decimals: 0, unit: "kVA",  label: "Cap. Sistema"     },
	online_capacity:     { divider: 1,   decimals: 0, unit: "kVA",  label: "Cap. Online"      },
	controller_on_time:  { divider: 1,   decimals: 0, unit: "h",    label: "Tempo Controlador"},

	// ── Generator ─────────────────────────────────────────────────────────────
	gen_phase_an:        { divider: 1,   decimals: 0, unit: "V",    label: "AN"               },
	gen_phase_bn:        { divider: 1,   decimals: 0, unit: "V",    label: "BN"               },
	gen_phase_cn:        { divider: 1,   decimals: 0, unit: "V",    label: "CN"               },
	gen_phase_ab:        { divider: 1,   decimals: 0, unit: "V",    label: "AB"               },
	gen_phase_bc:        { divider: 1,   decimals: 0, unit: "V",    label: "BC"               },
	gen_phase_ca:        { divider: 1,   decimals: 0, unit: "V",    label: "CA"               },
	gen_phase_a:         { divider: 1,   decimals: 1, unit: "A",    label: "Fase A"           },
	gen_phase_b:         { divider: 1,   decimals: 1, unit: "A",    label: "Fase B"           },
	gen_phase_c:         { divider: 1,   decimals: 1, unit: "A",    label: "Fase C"           },
	gen_active:          { divider: 1,   decimals: 1, unit: "kW",   label: "Ativa"            },
	gen_reactive:        { divider: 1,   decimals: 1, unit: "kVAR", label: "Reativa"          },
	gen_apparent:        { divider: 1,   decimals: 1, unit: "kVA",  label: "Aparente"         },
	gen_factor:          { divider: 100, decimals: 2, unit: "",     label: "Fat. Potência"    },
	gen_frequency:       { divider: 10,  decimals: 1, unit: "Hz",   label: "Frequência"       },

	// ── Network ───────────────────────────────────────────────────────────────
	net_phase_an:        { divider: 1,   decimals: 0, unit: "V",    label: "AN"               },
	net_phase_bn:        { divider: 1,   decimals: 0, unit: "V",    label: "BN"               },
	net_phase_cn:        { divider: 1,   decimals: 0, unit: "V",    label: "CN"               },
	net_phase_ab:        { divider: 1,   decimals: 0, unit: "V",    label: "AB"               },
	net_phase_bc:        { divider: 1,   decimals: 0, unit: "V",    label: "BC"               },
	net_phase_ca:        { divider: 1,   decimals: 0, unit: "V",    label: "CA"               },
	net_phase_a:         { divider: 1,   decimals: 1, unit: "A",    label: "Fase A"           },
	net_phase_b:         { divider: 1,   decimals: 1, unit: "A",    label: "Fase B"           },
	net_phase_c:         { divider: 1,   decimals: 1, unit: "A",    label: "Fase C"           },
	net_active:          { divider: 1,   decimals: 1, unit: "kW",   label: "Ativa"            },
	net_reactive:        { divider: 1,   decimals: 1, unit: "kVAR", label: "Reativa"          },
	net_apparent:        { divider: 1,   decimals: 1, unit: "kVA",  label: "Aparente"         },
	net_factor:          { divider: 100, decimals: 2, unit: "",     label: "Fat. Potência"    },
	net_frequency:       { divider: 10,  decimals: 1, unit: "Hz",   label: "Frequência"       },
}