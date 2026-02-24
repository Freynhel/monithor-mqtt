import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Zap, Activity } from "lucide-react";

function MetricCard({
	label,
	value,
	unit,
	icon: Icon,
	color = "text-cyan-400",
	sub = "",
}) {
	return (
		<div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
			<div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-medium">
				{Icon && <Icon size={13} className={color} />}
				{label}
			</div>
			<div className={`text-2xl font-bold font-mono ${color}`}>
				{value}
				{unit && (
					<span className="text-sm font-normal text-slate-400 ml-1">
						{unit}
					</span>
				)}
			</div>
			{sub && <div className="text-xs text-slate-500">{sub}</div>}
		</div>
	);
}

function deviceCurrent() {
	return (
		<Card className="">
			<CardHeader className="flex items-center justify-between px-5 py-4 border-b border-slate-700/40">
				<div className="flex items-center gap-2">
					<Activity size={15} className="text-cyan-400" />
					<span className="text-sm font-semibold text-slate-200">Tensão</span>
				</div>

				<Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">Gerador</Badge>
			</CardHeader>
			<CardContent className="p-5 grid grid-cols-3 gap-x-6 gap-y-3 text-xs">
				<MetricCard label="Fase AN" value="127" unit="V" icon={Activity} />
				<MetricCard label="Fase BB" value="128" unit="V" icon={Activity} />
				<MetricCard label="Fase CN" value="123" unit="V" icon={Activity} />
				<MetricCard label="Fase AB" value="221" unit="V" icon={Activity} />
				<MetricCard label="Fase BC" value="223" unit="V" icon={Activity} />
				<MetricCard label="Fase CA" value="217" unit="V" icon={Activity} />
			</CardContent>
		</Card>
	);
} // Device only information for current metrics

function networkCurrent() {} // Network only information for current metrics

function mixupCurrent() {} // Mixup of device and network information for current metrics

export { deviceCurrent, networkCurrent, mixupCurrent };