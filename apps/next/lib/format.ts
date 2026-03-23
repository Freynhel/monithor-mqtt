/**
 * lib/format.ts
 *
 * Display formatting utilities.
 * Consumes displayConfig to convert raw numbers into display strings.
 *
 * Usage:
 *   formatField(241, 'battery_voltage')          // "24.1"
 *   formatFieldWithUnit(241, 'battery_voltage')  // "24.1 Vcc"
 *   formatFieldLabel('battery_voltage')          // "Tensão Bateria"
 */

import { FIELD_DISPLAY } from "./displayConfig"

/**
 * Formats a raw number value for display using the field's config.
 * Returns "–" if the value is null.
 */
export function formatField(value: number | null, field: string): string {
	if (value == null) return "–"
	const config = FIELD_DISPLAY[field]
	if (!config) return String(value)
	return (value / config.divider).toFixed(config.decimals)
}

/**
 * Same as formatField but appends the unit label.
 * Returns "–" if the value is null.
 */
export function formatFieldWithUnit(value: number | null, field: string): string {
	if (value == null) return "–"
	const config = FIELD_DISPLAY[field]
	if (!config) return String(value)
	const formatted = (value / config.divider).toFixed(config.decimals)
	return config.unit ? `${formatted} ${config.unit}` : formatted
}

/**
 * Returns the human-readable label for a field.
 * Falls back to the raw field name if not configured.
 */
export function formatFieldLabel(field: string): string {
	return FIELD_DISPLAY[field]?.label ?? field
}

/**
 * Returns the unit for a field, or an empty string if none.
 */
export function formatFieldUnit(field: string): string {
	return FIELD_DISPLAY[field]?.unit ?? ""
}