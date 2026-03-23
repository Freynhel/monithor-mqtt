import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MetricCard from "./MetricCard";

const variants = {
	yellow: {
		icon: "text-yellow-400",
		badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
	},
	cyan: {
		icon: "text-cyan-400",
		badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
	},
	red: {
		icon: "text-red-400",
		badge: "bg-red-500/20 text-red-300 border-red-500/30"
	},
	purple: {
		icon: "text-purple-400",
		badge: "bg-purple-500/20 text-purple-300 border-purple-500/30"
	},
	blue: {
		icon: "text-blue-400",
		badge: "bg-blue-500/20 text-blue-300 border-blue-500/30"
	},
	indigo: {
		icon: "text-indigo-400",
		badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
	},
	emerald: {
		icon: "text-emerald-400",
		badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
	},
	teal: {
		icon: "text-teal-400",
		badge: "bg-teal-500/20 text-teal-300 border-teal-500/30"
	},
	pink: {
		icon: "text-pink-400",
		badge: "bg-pink-500/20 text-pink-300 border-pink-500/30"
	},
	orange: {
		icon: "text-orange-400",
		badge: "bg-orange-500/20 text-orange-300 border-orange-500/30"
	},
	slate: {
		icon: "text-slate-400",
		badge: "bg-slate-500/20 text-slate-300 border-slate-500/30"
	},
} as const;

export default function MetricContainer({ icon: Icon, containerLabel, badgeLabel, cols = 3, color, useCard = true, payload }) {
	return (
		<Card className="">
			<CardHeader className="flex items-center justify-between px-5 py-4 border-b border-slate-700/40">
				<div className="flex items-center gap-2">
					<Icon size={15} className={variants[color].icon} />
					<span className="text-sm font-semibold text-slate-200">{containerLabel}</span>
				</div>

				<Badge className={variants[color].badge}>{badgeLabel}</Badge>
			</CardHeader>
			<CardContent className={`p-5 grid grid-cols-${cols} gap-x-4 gap-y-4 text-xs`}>
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