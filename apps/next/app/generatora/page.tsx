"use client";
// temporary test page

import { useState, useEffect } from "react";
import { AlertDefault, AlertDescription, AlertTitle } from "@/components/ui/alert";

// ─── Minimal Shadcn-style primitives (self-contained) ────────────────────────
const cn = (...classes) => classes.filter(Boolean).join(" ");

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    destructive: "bg-red-500/20 text-red-400 border border-red-500/30",
    warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    secondary: "bg-slate-700/60 text-slate-300 border border-slate-600/40",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = "default", size = "default", className, onClick, ...props }) => {
  const variants = {
    default: "bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/20",
    outline: "border border-slate-600 hover:border-cyan-500/60 hover:bg-slate-800 text-slate-300",
    ghost: "hover:bg-slate-800 text-slate-400 hover:text-slate-200",
    destructive: "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30",
    success: "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30",
  };
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
    icon: "p-2",
  };
  return (
    <button
      onClick={onClick}
      className={cn("inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer", variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className }) => (
  <div className={cn("rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm", className)}>{children}</div>
);

const CardHeader = ({ children, className }) => (
  <div className={cn("flex items-center justify-between px-5 py-4 border-b border-slate-700/40", className)}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={cn("p-5", className)}>{children}</div>
);

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

const Icons = {
  power: "M12 2v10M4.93 4.93A10 10 0 1 0 19.07 4.93",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  thermometer: "M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z",
  wifi: "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  settings: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  chart: "M18 20V10M12 20V4M6 20v-6",
  cpu: "M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM9 9h6v6H9z",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  history: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5M12 7v5l4 2",
  network: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 0 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 0-2-2V9m0 0h18",
};

// ─── Sparkline ────────────────────────────────────────────────────────────────
const Sparkline = ({ data, color = "#06b6d4", height = 40 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((v - min) / (max - min || 1)) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${height} ${pts} 100,${height}`} fill={color} fillOpacity="0.08" stroke="none" />
    </svg>
  );
};

// ─── Toggle Switch ────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 cursor-pointer border",
      checked ? "bg-cyan-500 border-cyan-400" : "bg-slate-700 border-slate-600"
    )}
  >
    <span className={cn("inline-block h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300", checked ? "translate-x-6" : "translate-x-1")} />
  </button>
);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const alarmData = [
  { id: "ALM-001", type: "Overvoltage", severity: "critical", timestamp: "2025-02-23 14:32:11", value: "248.3V", status: "active" },
  { id: "ALM-002", type: "High Current", severity: "warning", timestamp: "2025-02-23 13:15:04", value: "18.7A", status: "active" },
  { id: "ALM-003", type: "Temp Threshold", severity: "warning", timestamp: "2025-02-23 11:08:57", value: "72°C", status: "acknowledged" },
  { id: "ALM-004", type: "Comm Timeout", severity: "info", timestamp: "2025-02-23 09:44:22", value: "—", status: "resolved" },
  { id: "ALM-005", type: "Power Surge", severity: "critical", timestamp: "2025-02-22 23:11:03", value: "+12%", status: "resolved" },
];

const historyData = [
  { ts: "14:30", voltage: "230.1V", current: "12.4A", power: "2853W", pf: "0.97", temp: "61°C" },
  { ts: "14:00", voltage: "229.8V", current: "11.9A", power: "2735W", pf: "0.96", temp: "59°C" },
  { ts: "13:30", voltage: "231.2V", current: "13.1A", power: "3028W", pf: "0.98", temp: "63°C" },
  { ts: "13:00", voltage: "228.5V", current: "10.8A", power: "2468W", pf: "0.95", temp: "57°C" },
  { ts: "12:30", voltage: "230.0V", current: "12.0A", power: "2760W", pf: "0.97", temp: "60°C" },
  { ts: "12:00", voltage: "229.3V", current: "11.5A", power: "2636W", pf: "0.96", temp: "58°C" },
];

const voltageHistory = [229, 230.1, 231.2, 229.8, 230.5, 248.3, 230.1, 229.5, 230.0, 229.8, 230.2, 231.0];
const currentHistory = [11.2, 12.4, 13.1, 11.9, 12.0, 18.7, 12.2, 11.8, 12.4, 12.0, 11.5, 12.8];
const powerHistory = [2574, 2853, 3028, 2735, 2760, 4310, 2806, 2714, 2760, 2753, 2645, 2944];

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function IoTDashboard() {
  const [deviceOn, setDeviceOn] = useState(true);
  const [notification, setNotification] = useState(true);
  const [activeTab, setActiveTab] = useState("alarms");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const severityBadge = (s) => ({ critical: "destructive", warning: "warning", info: "default" })[s] || "secondary";
  const statusBadge = (s) => ({ active: "destructive", acknowledged: "warning", resolved: "success" })[s] || "secondary";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" style={{ fontFamily: "'IBM Plex Mono', 'Courier New', monospace" }}>
      {/* Grid noise overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Top accent line */}
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent z-50" />

      <div className="relative max-w-7xl mx-auto px-4 py-6 space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className={cn("w-2.5 h-2.5 rounded-full", deviceOn ? "bg-emerald-400 shadow-lg shadow-emerald-400/60 animate-pulse" : "bg-slate-600")} />
              <span className="text-xs text-slate-500 uppercase tracking-widest">IOT Monitor</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">SMARTMETER <span className="text-cyan-400">PRO-X7</span></h1>
            <p className="text-xs text-slate-500 mt-0.5">{time.toLocaleString()} · Last sync 12s ago</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="" variant="outline" size="sm" onClick={() => alert("Opening graphs…")}>
              <Icon className d={Icons.chart} size={14} /> View Graphs
            </Button>
            <Button className="" variant="outline" size="sm" onClick={() => alert("Opening device manager…")}>
              <Icon className d={Icons.settings} size={14} /> Manage
            </Button>
            <Button className="" variant="outline" size="sm" onClick={() => alert("Opening edit form…")}>
              <Icon className d={Icons.edit} size={14} /> Edit
            </Button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60">
              <span className="text-xs text-slate-400">{deviceOn ? "ON" : "OFF"}</span>
              <Toggle checked={deviceOn} onChange={setDeviceOn} />
            </div>
          </div>
        </div>

        {/* ── Notification banner ── */}
        {notification && (
          <div className="relative rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex items-start gap-3 animate-fade-in">
            <Icon d={Icons.bell} size={16} className="text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-300">Active Alert — Overvoltage Detected</p>
              <p className="text-xs text-slate-400 mt-0.5">Voltage reading of <strong className="text-amber-400">248.3V</strong> exceeded threshold (245V) on channel A. Alarm ALM-001 triggered at 14:32:11.</p>
            </div>
            <button onClick={() => setNotification(false)} className="text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
              <Icon className="" d={Icons.x} size={14} />
            </button>
          </div>
        )}

        {/* ── Live Metrics Row ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "VOLTAGE", value: "230.1", unit: "V", sub: "±0.3V nominal", data: voltageHistory, color: "#06b6d4", icon: Icons.zap, change: "+0.2%" },
            { label: "CURRENT", value: "12.4", unit: "A", sub: "Channel A active", data: currentHistory, color: "#a78bfa", icon: Icons.activity, change: "+3.3%" },
            { label: "POWER", value: "2.85", unit: "kW", sub: "PF: 0.97", data: powerHistory, color: "#34d399", icon: Icons.thermometer, change: "-1.2%" },
          ].map(({ label, value, unit, sub, data, color, icon, change }) => (
            <Card className="" key={label}>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold tracking-tight" style={{ color }}>{value}</span>
                      <span className="text-sm text-slate-400">{unit}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{sub}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="p-2 rounded-lg bg-slate-800/60" style={{ color }}>
                      <Icon className="" d={icon} size={16} />
                    </div>
                    <span className={cn("text-xs font-medium", change.startsWith("+") ? "text-emerald-400" : "text-red-400")}>{change}</span>
                  </div>
                </div>
                <div className="h-10">
                  <Sparkline data={data} color={color} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Info + ID Cards ── */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="">
            <CardHeader className="">
              <div className="flex items-center gap-2">
                <Icon d={Icons.info} size={15} className="text-cyan-400" />
                <span className="text-sm font-semibold text-slate-200">General Information</span>
              </div>
              <Badge className="" variant="success">Nominal</Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              {[
                ["Location", "Grid Sector B-12"],
                ["Site", "Southpark Substation"],
                ["Phase Config", "Single-phase 230V"],
                ["Frequency", "60 Hz"],
                ["Install Date", "2023-07-14"],
                ["Firmware", "v4.2.1"],
                ["Uptime", "47d 13h 22m"],
                ["Temp", "61°C / 141.8°F"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-slate-500 mb-0.5">{k}</p>
                  <p className="text-slate-200 font-medium">{v}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader className="">
              <div className="flex items-center gap-2">
                <Icon d={Icons.cpu} size={15} className="text-violet-400" />
                <span className="text-sm font-semibold text-slate-200">Device Identification</span>
              </div>
              <Badge className="" variant="secondary">Registered</Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              {[
                ["Device ID", "SM-PRO-X7-00842"],
                ["Serial No.", "SN20231407-0842"],
                ["Manufacturer", "Nexus IoT Corp"],
                ["Model", "SmartMeter PRO-X7"],
                ["MAC Address", "A4:C3:F0:82:1D:4E"],
                ["IP Address", "192.168.10.82"],
                ["Protocol", "MQTT / Modbus TCP"],
                ["Cert Valid", "2026-07-14"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-slate-500 mb-0.5">{k}</p>
                  <p className="text-slate-200 font-medium font-mono">{v}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Connectivity Card ── */}
        <Card className="">
          <CardHeader className="">
            <div className="flex items-center gap-2">
              <Icon d={Icons.wifi} size={15} className="text-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">Connectivity & Status</span>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-4 text-xs">
            {[
              { label: "Signal Strength", value: "-48 dBm", status: "excellent", bar: 90 },
              { label: "Latency", value: "12 ms", status: "good", bar: 75 },
              { label: "Packet Loss", value: "0.01%", status: "excellent", bar: 99 },
              { label: "Data Rate", value: "1.2 Mbps", status: "good", bar: 70 },
            ].map(({ label, value, status, bar }) => (
              <div key={label}>
                <p className="text-slate-500 mb-1">{label}</p>
                <p className="text-slate-200 font-medium mb-2">{value}</p>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all" style={{ width: `${bar}%` }} />
                </div>
                <p className={cn("mt-1 capitalize", status === "excellent" ? "text-emerald-400" : "text-cyan-400")}>{status}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── Tables Section ── */}
        <Card className="">
          <CardHeader className="">
            <div className="flex gap-1">
              {["alarms", "history"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all cursor-pointer",
                    activeTab === tab ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon className="" d={tab === "alarms" ? Icons.alert : Icons.history} size={12} />
                    {tab === "alarms" ? "Alarm Log" : "History Data"}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "alarms" && (
                <Badge className="" variant="destructive">{alarmData.filter(a => a.status === "active").length} active</Badge>
              )}
              <Button onClick="" className="" variant="ghost" size="sm">Export CSV</Button>
            </div>
          </CardHeader>

          {activeTab === "alarms" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800/60">
                    {["Alarm ID", "Type", "Severity", "Timestamp", "Value", "Status", "Action"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alarmData.map((row, i) => (
                    <tr key={row.id} className={cn("border-b border-slate-800/30 transition-colors hover:bg-slate-800/30", i % 2 === 0 ? "" : "bg-slate-900/30")}>
                      <td className="px-5 py-3 font-mono text-cyan-400">{row.id}</td>
                      <td className="px-5 py-3 text-slate-300">{row.type}</td>
                      <td className="px-5 py-3"><Badge className="" variant={severityBadge(row.severity)}>{row.severity}</Badge></td>
                      <td className="px-5 py-3 text-slate-400 font-mono">{row.timestamp}</td>
                      <td className="px-5 py-3 text-slate-300 font-mono">{row.value}</td>
                      <td className="px-5 py-3"><Badge className="" variant={statusBadge(row.status)}>{row.status}</Badge></td>
                      <td className="px-5 py-3">
                        <Button className="" variant="ghost" size="sm" onClick={() => alert(`Viewing alarm ${row.id}`)}>View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "history" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800/60">
                    {["Timestamp", "Voltage", "Current", "Power", "Power Factor", "Temperature"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-slate-500 font-medium uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((row, i) => (
                    <tr key={i} className={cn("border-b border-slate-800/30 transition-colors hover:bg-slate-800/30", i % 2 === 0 ? "" : "bg-slate-900/30")}>
                      <td className="px-5 py-3 font-mono text-cyan-400">Today {row.ts}</td>
                      <td className="px-5 py-3 text-slate-300 font-mono">{row.voltage}</td>
                      <td className="px-5 py-3 text-slate-300 font-mono">{row.current}</td>
                      <td className="px-5 py-3 text-slate-300 font-mono">{row.power}</td>
                      <td className="px-5 py-3 text-slate-300 font-mono">{row.pf}</td>
                      <td className="px-5 py-3 text-slate-300 font-mono">{row.temp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-5 py-3 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {activeTab === "alarms" ? alarmData.length : historyData.length} records</span>
            <div className="flex gap-1">
              <Button onClick="" className="" variant="ghost" size="sm">← Prev</Button>
              <Button onClick="" className="" variant="ghost" size="sm">Next →</Button>
            </div>
          </div>
        </Card>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-1 pb-4">
          <span>SmartMeter PRO-X7 · Nexus IoT Corp · v4.2.1</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live data streaming
          </span>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        @keyframes fade-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}