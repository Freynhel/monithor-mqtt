"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { AlertDefault as Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Battery,
  Bell,
  BellRing,
  ChevronDown,
  Cpu,
  Edit,
  Gauge,
  History,
  Info,
  MoreVertical,
  Power,
  Settings,
  Thermometer,
  Wifi,
  Zap,
  ZapOff,
  X,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const alarms = [
  { id: 1, time: "2026-02-24 14:32:01", type: "Crítico", message: "Sobrecorrente Fase A", status: "Ativo" },
  { id: 2, time: "2026-02-24 13:15:44", type: "Aviso", message: "Tensão Fase BN acima do limite", status: "Ativo" },
  { id: 3, time: "2026-02-24 10:02:18", type: "Info", message: "Dispositivo reiniciado", status: "Reconhecido" },
  { id: 4, time: "2026-02-23 22:47:55", type: "Aviso", message: "Bateria abaixo de 20%", status: "Resolvido" },
  { id: 5, time: "2026-02-23 18:30:00", type: "Crítico", message: "Falha de comunicação", status: "Resolvido" },
];

const history = [
  { id: 1, time: "2026-02-24 14:00:00", corrA: "12.4 A", corrB: "12.1 A", corrC: "12.3 A", potAtiva: "8.2 kW", potAparente: "8.8 kVA" },
  { id: 2, time: "2026-02-24 13:00:00", corrA: "11.9 A", corrB: "11.8 A", corrC: "12.0 A", potAtiva: "7.9 kW", potAparente: "8.8 kVA" },
  { id: 3, time: "2026-02-24 12:00:00", corrA: "13.1 A", corrB: "12.9 A", corrC: "13.0 A", potAtiva: "8.7 kW", potAparente: "8.8 kVA" },
  { id: 4, time: "2026-02-24 11:00:00", corrA: "0.0 A", corrB: "0.0 A", corrC: "0.0 A", potAtiva: "0.0 kW", potAparente: "8.8 kVA" },
  { id: 5, time: "2026-02-24 10:00:00", corrA: "12.7 A", corrB: "12.5 A", corrC: "12.6 A", potAtiva: "8.4 kW", potAparente: "8.8 kVA" },
  { id: 6, time: "2026-02-24 10:00:00", corrA: "12.7 A", corrB: "12.5 A", corrC: "12.6 A", potAtiva: "8.4 kW", potAparente: "8.8 kVA" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ label, value, unit, icon: Icon, color = "text-cyan-400", sub }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider font-medium">
        {Icon && <Icon size={13} className={color} />}
        {label}
      </div>
      <div className={`text-2xl font-bold font-mono ${color}`}>
        {value}
        {unit && <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>}
      </div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, color = "text-cyan-400" }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={16} className={color} />
      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-300">{title}</h3>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

function AlarmBadge({ type }) {
  const map = {
    Crítico: "destructive",
    Aviso: "outline",
    Info: "secondary",
  };
  const colorMap = {
    Crítico: "border-red-500 text-red-400 bg-red-500/10",
    Aviso: "border-yellow-500 text-yellow-400 bg-yellow-500/10",
    Info: "border-blue-500 text-blue-400 bg-blue-500/10",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colorMap[type]}`}>{type}</span>
  );
}

function StatusBadge({ status }) {
  const map = {
    Ativo: "border-red-500 text-red-400 bg-red-500/10",
    Reconhecido: "border-yellow-500 text-yellow-400 bg-yellow-500/10",
    Resolvido: "border-green-500 text-green-400 bg-green-500/10",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${map[status]}`}>{status}</span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IoTDashboard() {
  const [deviceOn, setDeviceOn] = useState(true);
  const [showNotification, setShowNotification] = useState(true);
  const [confirmPowerOpen, setConfirmPowerOpen] = useState(false);

  function handlePowerToggle() {
    setDeviceOn((v) => !v);
    setConfirmPowerOpen(false);
  }

  return (
    <div
      className="min-h-screen text-slate-100 p-6"
      style={{
        background: "radial-gradient(ellipse at top left, #0f172a 0%, #020617 60%, #0a0f1e 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap'); * { font-family: 'DM Sans', sans-serif; } .font-mono { font-family: 'DM Mono', monospace !important; }`}</style>

      {/* ── Notification Banner ── */}
      {showNotification && (
        <Alert className="mb-5 border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 relative">
          <BellRing className="h-4 w-4 text-yellow-400" />
          <AlertTitle className="text-yellow-300 font-semibold">Alerta de Manutenção</AlertTitle>
          <AlertDescription className="text-yellow-400/80 text-sm">
            Manutenção agendada para 27/02/2026 às 08h00. Obs: O dispositivo ficará offline por aproximadamente 2 horas.
          </AlertDescription>
          <button
            onClick={() => setShowNotification(false)}
            className="absolute top-3 right-3 text-yellow-400/60 hover:text-yellow-300 transition-colors"
          >
            <X size={14} />
          </button>
        </Alert>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
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
              <h1 className="text-2xl font-bold text-white tracking-tight">Gerador GMG #03</h1>
              <Badge className={`text-xs px-2 py-0.5 rounded-full ${deviceOn ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-slate-500/15 text-slate-400 border border-slate-500/30"}`}>
                {deviceOn ? "Online" : "Offline"}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              <span className="text-slate-500">Cliente:</span> <span className="text-slate-300 font-medium">BELTRAME SUPERMERCADOS</span>
              <span className="mx-2 text-slate-600">•</span>
              <span className="text-slate-500">Tópico MQTT:</span> <span className="font-mono text-slate-300 text-xs">up/99XX00YY77</span>
            </p>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 gap-2">
            <BarChart3 size={14} className="text-cyan-400" />
            Visualizar Gráficos
          </Button>

          <Button variant="outline" size="sm" className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 gap-2">
            <Edit size={14} className="text-purple-400" />
            Editar Dados
          </Button>

          <Button variant="outline" size="sm" className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 gap-2">
            <Settings size={14} className="text-orange-400" />
            Gerenciar Dispositivo
          </Button>

          {/* Power Button with confirm */}
          <Dialog open={confirmPowerOpen} onOpenChange={setConfirmPowerOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className={`gap-2 font-semibold transition-all ${
                  deviceOn
                    ? "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
                    : "bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30"
                }`}
              >
                {deviceOn ? <ZapOff size={14} /> : <Zap size={14} />}
                {deviceOn ? "Desligar Leitura" : "Ligar Leitura"}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border border-white/15 text-white max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Power size={16} className={deviceOn ? "text-red-400" : "text-green-400"} />
                  {deviceOn ? "Desligar dispositivo?" : "Ligar dispositivo?"}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  {deviceOn
                    ? "O dispositivo será desligado imediatamente. Todas as operações em andamento serão interrompidas."
                    : "O dispositivo será ligado e iniciará o processo de boot."}
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" size="sm" className="border-white/15 text-slate-300" onClick={() => setConfirmPowerOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  className={deviceOn ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
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
                  className="border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 relative"
                  onClick={() => setShowNotification(true)}
                >
                  <Bell size={14} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-slate-900" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-slate-800 text-white text-xs border-white/15">
                Ver notificação de manutenção
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* ── General Info Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
        <MetricCard sub="" label="Horas Funcionamento" value="4.820" unit="h" icon={Activity} color="text-teal-400" />
        <MetricCard label="RPM" value="1.740" unit="rpm" icon={Gauge} color="text-blue-400" sub="Nominal: 1.800 rpm" />
        <MetricCard label="Tensão Bateria" value="76" unit="Vcc" icon={Battery} color="text-green-400" sub="" />
        <MetricCard label="Pressão Óleo" value="8,4" unit="KPA" icon={Thermometer} color="text-orange-400" sub="Máx: 10 KPA" />
        <MetricCard sub="" label="Frequência" value="60,0" unit="Hz" icon={Wifi} color="text-purple-400" />
      </div>

      {/* ── Electrical Readings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

        {/* Correntes */}
        <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <SectionTitle icon={Zap} title="Correntes" color="text-yellow-400" />
          </CardHeader>
          <CardContent className="px-5 pb-5 grid grid-cols-3 gap-3">
            <MetricCard sub="" label="Fase A" value="12.4" unit="A" icon={Zap} color="text-yellow-400" />
            <MetricCard sub="" label="Fase B" value="12.1" unit="A" icon={Zap} color="text-yellow-400" />
            <MetricCard sub="" label="Fase C" value="12.3" unit="A" icon={Zap} color="text-yellow-400" />
          </CardContent>
        </Card>

        {/* Tensões */}
        <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <SectionTitle icon={Activity} title="Tensões" color="text-cyan-400" />
          </CardHeader>
          <CardContent className="px-5 pb-5 grid grid-cols-3 gap-3">
            <MetricCard sub="" label="AN" value="127" unit="V" icon={Activity} color="text-cyan-400" />
            <MetricCard sub="" label="BN" value="128" unit="V" icon={Activity} color="text-cyan-400" />
            <MetricCard sub="" label="CN" value="126" unit="V" icon={Activity} color="text-cyan-400" />
            <MetricCard sub="" label="AB" value="220" unit="V" icon={Activity} color="text-sky-400" />
            <MetricCard sub="" label="BC" value="221" unit="V" icon={Activity} color="text-sky-400" />
            <MetricCard sub="" label="CA" value="219" unit="V" icon={Activity} color="text-sky-400" />
          </CardContent>
        </Card>

        {/* Potências */}
        <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2 pt-4 px-5">
            <SectionTitle icon={BarChart3} title="Potências" color="text-purple-400" />
          </CardHeader>
          <CardContent className="px-5 pb-5 grid grid-cols-2 gap-3">
            <MetricCard sub="" label="Ativa" value="8,2" unit="kW" icon={BarChart3} color="text-purple-400" />
            <MetricCard sub="" label="Reativa" value="3,1" unit="kVAr" icon={BarChart3} color="text-pink-400" />
            <MetricCard sub="" label="Aparente" value="8,8" unit="kVA" icon={BarChart3} color="text-fuchsia-400" />
            <MetricCard label="Fat. Potência" value="0,93" unit="" icon={BarChart3} color="text-violet-400" sub="Bom" />
          </CardContent>
        </Card>
      </div>

      {/* ── Tables ── */}
      <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
        <CardContent className="p-0">
          <Tabs defaultValue="alarmes">
            <div className="px-5 mb-5pt-0 pb-0 border-b border-white/10 flex items-center justify-between">
              <TabsList className="bg-white/5 border border-white/10 p-1 mb-5 h-auto">
                <TabsTrigger value="alarmes" className="data-[state=active]:bg-white/15 data-[state=active]:text-white text-slate-400 text-sm gap-2 px-4 py-1.5">
                  <AlertTriangle size={13} className="text-red-400" />
                  Alarmes
                  <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">2</span>
                </TabsTrigger>
                <TabsTrigger value="historico" className="data-[state=active]:bg-white/15 data-[state=active]:text-white text-slate-400 text-sm gap-2 px-4 py-1.5">
                  <History size={13} className="text-blue-400" />
                  Histórico
                </TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-1.5 text-xs">
                Exportar <ChevronDown size={12} />
              </Button>
            </div>

            {/* Alarms Table */}
            <TabsContent value="alarmes" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wider pl-5">#</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Data/Hora</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Tipo</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Mensagem</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wider pr-5 text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alarms.map((a) => (
                    <TableRow key={a.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="text-slate-500 font-mono text-xs pl-5">{String(a.id).padStart(3, "0")}</TableCell>
                      <TableCell className="text-slate-400 font-mono text-xs">{a.time}</TableCell>
                      <TableCell><AlarmBadge type={a.type} /></TableCell>
                      <TableCell className="text-slate-300 text-sm">{a.message}</TableCell>
                      <TableCell><StatusBadge status={a.status} /></TableCell>
                      <TableCell className="pr-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-white">
                              <MoreVertical size={13} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-slate-900 border-white/15 text-slate-300 text-sm">
                            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">Reconhecer</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-red-400">Excluir</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* History Table */}
            <TabsContent value="historico" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wider pl-5">Data/Hora</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Corr. A</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Corr. B</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Corr. C</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wider pr-5">Pot. Ativa</TableHead>
                    <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wider pr-5">Pot. Aparente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h) => (
                    <TableRow key={h.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="text-slate-400 font-mono text-xs pl-5">{h.time}</TableCell>
                      <TableCell className="text-yellow-400 font-mono text-xs">{h.corrA}</TableCell>
                      <TableCell className="text-yellow-400 font-mono text-xs">{h.corrB}</TableCell>
                      <TableCell className="text-yellow-400 font-mono text-xs">{h.corrC}</TableCell>
                      <TableCell className="text-purple-400 font-mono text-xs pr-5">{h.potAtiva}</TableCell>
                      <TableCell className="text-purple-400 font-mono text-xs pr-5">{h.potAparente}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ── Footer ── */}
      <div className="mt-5 flex items-center justify-between text-xs text-slate-600">
        <span>Última atualização: 24/02/2026 14:45:00</span>
        <span>Monithor MQTT v1.0.1 · Monithor Dashboard</span>
      </div>
    </div>
  );
}