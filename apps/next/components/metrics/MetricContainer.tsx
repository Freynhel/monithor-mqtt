import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetricCard from "./MetricCard";

export default function MetricContainer({ icon: Icon, containerLabel, badgeLabel, cols = 3, color, useCard = true, payload }) {
	return (
		<Card className="">
			<CardHeader className="flex items-center justify-between px-5 py-4 border-b border-slate-700/40">
				<div className="flex items-center gap-2">
					<Icon size={15} className={`text-${color}-400`} />
					<span className="text-sm font-semibold text-slate-200">{containerLabel}</span>
				</div>

				<Badge className={`bg-${color}-500/20 text-${color}-300 border border-${color}-500/30 font-medium`}>{badgeLabel}</Badge>
			</CardHeader>
			<CardContent className={`p-5 grid grid-cols-${cols} gap-x-6 gap-y-3 text-xs`}>
				{useCard ?
					payload.map((metric) => (
						<MetricCard key={metric.label} label={metric.label} value={metric.value} unit={metric.unit} icon={metric.icon} color={metric.color} sub={metric.sub} />))
					:
					payload.map(([k, v]) => (
						<div key={k}>
							<p className="text-slate-500 mb-0.5">{k}</p>
							<p className="text-slate-200 font-medium">{v}</p>
						</div> ))}
			</CardContent>
		</Card>
	);
} // Device only information for current metrics

function networkCurrent() {} // Network only information for current metrics

function mixupCurrent() {} // Mixup of device and network information for current metrics

export { MetricContainer, networkCurrent, mixupCurrent };