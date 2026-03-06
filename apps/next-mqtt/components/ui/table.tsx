"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Card, CardHeader } from "./card"
import { Button } from "./button"
import { useState } from "react"
import DataTable from "../datatable/DataTable"
import { Badge } from "./badge"

// Mock data for demonstration
const alarmData = [
  { id: "ALM-001", type: "Overvoltage", severity: "critical", timestamp: "2025-02-23 14:32:11", value: "248.3V", status: "active" },
  { id: "ALM-002", type: "High Current", severity: "warning", timestamp: "2025-02-23 13:15:04", value: "18.7A", status: "active" },
  { id: "ALM-003", type: "Temp Threshold", severity: "warning", timestamp: "2025-02-23 11:08:57", value: "72°C", status: "acknowledged" },
  { id: "ALM-004", type: "Comm Timeout", severity: "info", timestamp: "2025-02-23 09:44:22", value: "—", status: "resolved" },
  { id: "ALM-005", type: "Power Surge", severity: "critical", timestamp: "2025-02-22 23:11:03", value: "+12%", status: "resolved" },
];
const alarmColumns = [
  { header: "ID", accessorKey: "id" },
  { header: "Type", accessorKey: "type" },
  { header: "Severity", accessorKey: "severity" },
  { header: "Timestamp", accessorKey: "timestamp" },
  { header: "Value", accessorKey: "value" },
  { header: "Status", accessorKey: "status" },
  { header: "Action", accessorKey: "action" },
]

const historyData = [
  { ts: "14:30", voltage: "230.1V", current: "12.4A", power: "2853W", pf: "0.97", temp: "61°C" },
  { ts: "14:00", voltage: "229.8V", current: "11.9A", power: "2735W", pf: "0.96", temp: "59°C" },
  { ts: "13:30", voltage: "231.2V", current: "13.1A", power: "3028W", pf: "0.98", temp: "63°C" },
  { ts: "13:00", voltage: "228.5V", current: "10.8A", power: "2468W", pf: "0.95", temp: "57°C" },
  { ts: "12:30", voltage: "230.0V", current: "12.0A", power: "2760W", pf: "0.97", temp: "60°C" },
  { ts: "12:00", voltage: "229.3V", current: "11.5A", power: "2636W", pf: "0.96", temp: "58°C" },
];
const historyColumns = [
  { header: "Timestamp", accessorKey: "ts" },
  { header: "Voltage", accessorKey: "voltage" },
  { header: "Current", accessorKey: "current" },
  { header: "Power", accessorKey: "power" },
  { header: "Power Factor", accessorKey: "pf" },
  { header: "Temperature", accessorKey: "temp" },
]

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

const Icon = ({ d, size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

/* const Badge = ({ children, variant = "default", className }) => {
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
}; */

export default function TableDefault({ props: { columns, data, ...props } }) {
  const severityBadge = (s) => ({ critical: "destructive", warning: "warning", info: "default" })[s] || "secondary";
  const statusBadge = (s) => ({ active: "destructive", acknowledged: "warning", resolved: "success" })[s] || "secondary";

  const [activeTab, setActiveTab] = useState("alarms");

  return (

    <Card className="mx-5">
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
          <Button className="" variant="ghost" size="sm">Export CSV</Button>
        </div>
      </CardHeader>

      {activeTab === "alarms" && (
        <div className="overflow-x-auto">
          <DataTable
            props={{
              columns: alarmColumns,
              data: alarmData,

            }}
          />
          {/* <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800/60">
                {columns.map(h => (
                  <th key={h.header} className="px-5 py-3 text-left text-slate-500 font-medium uppercase tracking-wider">{h.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id} className={cn("border-b border-slate-800/30 transition-colors hover:bg-slate-800/30", i % 2 === 0 ? "" : "bg-slate-900/30")}>
                  <td className="px-5 py-3 font-mono text-cyan-400">{row.id}</td>
                  <td className="px-5 py-3 text-slate-300">{row.title}</td>
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
          </table> */}
        </div>
      )}

      {activeTab === "history" && (
        <div className="overflow-x-auto">
          <DataTable
            props={{
              columns: historyColumns,
              data: historyData,

            }}
          />
          {/* <table className="w-full text-xs">
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
          </table> */}
        </div>
      )}

      <div className="px-5 py-3 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-500">
        <span>Showing {activeTab === "alarms" ? alarmData.length : historyData.length} records</span>
        <div className="flex gap-1">
          <Button className="" variant="ghost" size="sm">← Prev</Button>
          <Button className="" variant="ghost" size="sm">Next →</Button>
        </div>
      </div>
    </Card>
  )
}





function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
