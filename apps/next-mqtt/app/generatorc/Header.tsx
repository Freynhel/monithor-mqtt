import { useState } from "react";
import { BarChart3, Bell, Edit, Settings, ZapOff, Zap, Power, Cpu, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function GeneratorHeader() {
	const [deviceOn, setDeviceOn] = useState(true);
	const [confirmPowerOpen, setConfirmPowerOpen] = useState(false);

	function handlePowerToggle() {
	setDeviceOn((v) => !v);
	setConfirmPowerOpen(false);
	}

	return (
		<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7 px-5">
			<div className="flex items-center gap-4">
				<div className="relative">
					<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
						<Cpu size={22} className="text-white" />
					</div>
					{deviceOn && (
						<span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
					)}
				</div>
				<div>
					<div className="flex items-center gap-2">
						<h1 className="text-2xl font-bold text-white tracking-tight">
							Gerador GMG #03
						</h1>
						<Badge
							className={`text-xs px-2 py-0.5 rounded-full ${deviceOn ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-slate-500/15 text-slate-400 border border-slate-500/30"}`}
						>
							{deviceOn ? "Online" : "Offline"}
						</Badge>
						<Badge
							className={`text-xs px-2 py-0.5 rounded-full ${deviceOn ? "bg-orange-500/15 text-orange-400 border border-orange-500/30" : "bg-slate-500/15 text-slate-400 border border-slate-500/30"}`}
						>
							{deviceOn ? "Em Funcionamento" : "Parado"}
						</Badge>
					</div>
					<p className="text-sm text-slate-400 mt-0.5">
						<span className="text-slate-500">Cliente:</span>{" "}
						<span className="text-slate-300 font-medium">
							BELTRAME SUPERMERCADOS
						</span>
						<span className="mx-2 text-slate-600">•</span>
						<span className="text-slate-500">
							Tópico MQTT:
						</span>{" "}
						<span className="font-mono text-slate-300 text-xs">
							up/99XX00YY77
						</span>
					</p>
				</div>
			</div>

			{/* ── Actions ── */}
			<div className="flex items-center gap-2 flex-wrap">
				<Button
					variant="outline"
					size="sm"
					className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 gap-2 hover:text-slate-100"
				>
					<RefreshCw size={14} className="text-orange-400" />
					Alterar View
				</Button>

				<Button
					variant="outline"
					size="sm"
					className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 gap-2 hover:text-slate-100"
				>
					<BarChart3 size={14} className="text-cyan-400" />
					Visualizar Gráficos
				</Button>

				<Button
					variant="outline"
					size="sm"
					className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 gap-2 hover:text-slate-100"
				>
					<Edit size={14} className="text-purple-400" />
					Editar Dados
				</Button>

				{/* Power Button with confirm */}
				<Dialog
					open={confirmPowerOpen}
					onOpenChange={setConfirmPowerOpen}
				>
					<DialogTrigger asChild>
						<Button
							size="sm"
							className={`gap-2 font-semibold transition-all ${
								deviceOn
									? "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
									: "bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30"
							}`}
						>
							{deviceOn ? (
								<ZapOff size={14} />
							) : (
								<Zap size={14} />
							)}
							{deviceOn ? "Desligar Leitura" : "Ligar Leitura"}
						</Button>
					</DialogTrigger>
					<DialogContent className="bg-slate-900 border border-white/15 text-white max-w-sm">
						<DialogHeader>
							<DialogTitle className="text-white flex items-center gap-2">
								<Power
									size={16}
									className={
										deviceOn
											? "text-red-400"
											: "text-green-400"
									}
								/>
								{deviceOn
									? "Desligar dispositivo?"
									: "Ligar dispositivo?"}
							</DialogTitle>
							<DialogDescription className="text-slate-400">
								{deviceOn
									? "O dispositivo será desligado imediatamente. Todas as operações em andamento serão interrompidas."
									: "O dispositivo será ligado e iniciará o processo de boot."}
							</DialogDescription>
						</DialogHeader>
						<div className="flex justify-end gap-2 mt-2">
							<Button
								variant="outline"
								size="sm"
								className="border-white/15 text-slate-300 "
								onClick={() => setConfirmPowerOpen(false)}
							>
								Cancelar
							</Button>
							<Button
								size="sm"
								className={
									deviceOn
										? "bg-red-600 hover:bg-red-700 text-white"
										: "bg-green-600 hover:bg-green-700 text-white"
								}
								onClick={handlePowerToggle}
							>
								Confirmar
							</Button>
						</div>
					</DialogContent>
				</Dialog>

				{/* Notification bell */}
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 relative hover:text-slate-100"
								// onClick={() => setShowNotification(true)}
							>
								<Bell size={14} />
								<span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-slate-900" />
							</Button>
						</TooltipTrigger>
						<TooltipContent
							side="bottom"
							className="bg-slate-800 text-white text-xs border-white/15"
						>
							Ver notificação de manutenção
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}
