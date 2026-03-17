export default function MetricCard({ label, value, unit, icon: Icon, color, sub }) {
	return (
		<div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
			<div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-medium">
				{Icon && <Icon size={13} className={`text-${color}-400`} />}
				{label}
			</div>
			<div className={`text-2xl font-bold font-mono text-${color}-400`}>
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