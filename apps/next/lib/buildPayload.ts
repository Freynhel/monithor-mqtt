/**
 * lib/buildPayload.ts
 *
 * Builds the display payload consumed by MetricCard and MetricContainer.
 * Device-type aware — uses the layout config to determine which fields
 * and sections to include.
 *
 * All values come from the raw NormalizedTelemetry and are formatted
 * here at the display boundary using formatField.
 */

import type { NormalizedTelemetry } from "./mqttNormalizer";
import {
	gensetStateLabel,
	operationModeLabel,
	isPCC1302,
	isPCC3300,
	isMCM3320,
} from "./mqttNormalizer";
import { FIELD_DISPLAY } from "./displayConfig";
import { formatField } from "./format";
import { getFieldMeta } from "./fieldMeta";
import { getDeviceLayout, type DeviceLayoutConfig } from "./deviceLayout";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MetricItem = {
	field: string;
	label: string;
	value: string;
	unit: string;
	icon: any;
	color: string;
	sub?: string;
};

export type DashboardPayload = {
	layout: DeviceLayoutConfig | null;
	metrics: MetricItem[];
	generalInfo: [string, string][];
	generatorVoltages: MetricItem[];
	generatorCurrents: MetricItem[];
	generatorPower: MetricItem[];
	networkVoltages: MetricItem[];
	networkCurrents: MetricItem[];
	networkPower: MetricItem[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

type GeneratorInfo = {
	SerialNumber: string | null;
	ModelName: string | null;
	Address: string | null;
	Mode: string | null;
	ContactName: string | null;
	ContactNumber: string | null;
	ContactEmail: string | null;
	TopicMQTT: string | null;
};

/**
 * Reads a field value from anywhere in the telemetry object.
 * Searches general → generator → network → unifilar.
 */
function getTelemetryValue(
	t: NormalizedTelemetry,
	field: string,
): number | null {
	const sections = [
		t.general,
		t.generator,
		"network" in t ? t.network : null,
		"unifilar" in t ? t.unifilar : null,
	];

	for (const section of sections) {
		if (section && field in section) {
			const value = (section as Record<string, unknown>)[field];
			return typeof value === "number" ? value : null;
		}
	}
	return null;
}

/**
 * Some fields use label functions rather than raw numeric formatting.
 * Returns a formatted string for these special cases.
 */
function getSpecialFieldValue(
	t: NormalizedTelemetry,
	field: string,
): string | null {
	const raw = getTelemetryValue(t, field);

	switch (field) {
		case "switch_position":
		case "operation_mode":
			return operationModeLabel(raw);
		case "genset_state":
			return gensetStateLabel(raw);
		case "ptc_state":
			return raw != null ? String(raw) : "–";
		default:
			return null;
	}
}

const SPECIAL_FIELDS = new Set([
	"switch_position",
	"operation_mode",
	"genset_state",
	"ptc_state",
]);

/**
 * Builds a MetricItem for a given field name from telemetry.
 */
function buildMetricItem(
	t: NormalizedTelemetry,
	field: string,
): MetricItem {
	const config = FIELD_DISPLAY[field];
	const meta = getFieldMeta(field);

	const value = SPECIAL_FIELDS.has(field)
		? (getSpecialFieldValue(t, field) ?? "–")
		: formatField(getTelemetryValue(t, field), field);

	return {
		field,
		label: config?.label ?? field,
		value,
		unit: SPECIAL_FIELDS.has(field) ? "" : (config?.unit ?? ""),
		icon: meta.icon,
		color: meta.color,
	};
}

// ─── Main Builder ─────────────────────────────────────────────────────────────

export function buildPayload(
	info: GeneratorInfo | null,
	t: NormalizedTelemetry | null,
	lastUpdate: Date | null,
): DashboardPayload {
	const deviceType = t?.deviceType ?? null;
	const layout = deviceType ? (getDeviceLayout(deviceType) ?? null) : null;

	const empty: DashboardPayload = {
		layout,
		metrics:          [],
		generalInfo:      [],
		generatorVoltages: [],
		generatorCurrents: [],
		generatorPower:   [],
		networkVoltages:  [],
		networkCurrents:  [],
		networkPower:     [],
	};

	if (!t) return empty;

	// ── Metrics row ───────────────────────────────────────────────────────────
	const metrics = (layout?.metricsFields ?? []).map((field) =>
		buildMetricItem(t, field),
	);

	// ── Generator sections ────────────────────────────────────────────────────
	const generatorVoltages = (layout?.generatorVoltageFields ?? []).map(
		(field) => buildMetricItem(t, field),
	);
	const generatorCurrents = (layout?.generatorCurrentFields ?? []).map(
		(field) => buildMetricItem(t, field),
	);
	const generatorPower = (layout?.generatorPowerFields ?? []).map(
		(field) => buildMetricItem(t, field),
	);

	// ── Network sections (optional) ───────────────────────────────────────────
	const networkVoltages =
		layout?.hasNetworkSection
			? (layout.networkVoltageFields ?? []).map((field) => buildMetricItem(t, field))
			: [];

	const networkCurrents =
		layout?.hasNetworkSection
			? (layout.networkCurrentFields ?? []).map((field) => buildMetricItem(t, field))
			: [];

	const networkPower =
		layout?.hasNetworkSection
			? (layout.networkPowerFields ?? []).map((field) => buildMetricItem(t, field))
			: [];

	// ── General info (static + live) ──────────────────────────────────────────
	const gensetState = (() => {
		if (isPCC1302(t) || isPCC3300(t)) {
			return gensetStateLabel(t.general.genset_state);
		}
		if (isMCM3320(t)) {
			return gensetStateLabel(t.general.genset_state);
		}
		return "–";
	})();

	const operationMode = (() => {
		if (isPCC1302(t) || isPCC3300(t)) {
			return operationModeLabel(t.general.switch_position);
		}
		if (isMCM3320(t)) {
			return operationModeLabel(t.general.operation_mode);
		}
		return "–";
	})();

	const generalInfo: [string, string][] = [
		["Número de Série",  info?.SerialNumber ?? "–"],
		["Modelo",           info?.ModelName    ?? "–"],
		["Tipo Dispositivo", deviceType         ?? "–"],
		["Último Dado",      lastUpdate ? lastUpdate.toLocaleString("pt-BR") : "Aguardando…"],
		["Modo",             info?.Mode         ?? "–"],
		["Operação",         operationMode],
		["Estado Gerador",   gensetState],
		["Nome Contato",     info?.ContactName  ?? "–"],
		["Telefone",         info?.ContactNumber ?? "–"],
		["Endereço",         info?.Address      ?? "–"],
	];

	return {
		layout,
		metrics,
		generalInfo,
		generatorVoltages,
		generatorCurrents,
		generatorPower,
		networkVoltages,
		networkCurrents,
		networkPower,
	};
}