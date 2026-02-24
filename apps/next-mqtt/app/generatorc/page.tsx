"use client";

import { deviceCurrent } from "@/components/metrics/current";

export default function GeneratorView() {
	return (
		<div className="p-5">
			{deviceCurrent()}
		</div>
	);
}
