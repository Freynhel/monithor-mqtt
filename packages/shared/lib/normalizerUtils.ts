/**
 * This function needs reviewing. Since it's expecting to receive a number and it's returning a string.
 */
export function toFixed(value?: number | null, divider: number = 10, decimals: number = 1): string | null {
	if (value == null) return null;
	return (value / divider).toFixed(decimals);
}

export function toBinary16(value?: number | null): string | null {
	if (value == null) return null;
	if (value < 0) value += 65536;
	return (value >>> 0).toString(2).padStart(16, "0");
}

export function calcHourmeter(high?: number, low?: number): number | null {
	// Handle negative low byte
	if (low != null && low < 0) { low += 65536; }
	if (high == null || low == null) { return null; }
	return ((high * 65535 + low) * 0.1) / 3600;
}

export function formatDateLocaleBR(dateStr: string): string {
	let formattedDate = new Date(dateStr).toLocaleString("pt-BR", {
		timeZone: "America/Sao_Paulo",
		hour12: false,
	});

	return formattedDate.replace(",", "");
}

export function timestamp() {
	let timestamp = new Date().toLocaleString("pt-BR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});

	timestamp = timestamp.replace(",", "");
	return timestamp;
}