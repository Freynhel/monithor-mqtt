"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Card, CardHeader } from "./card"
import { Button } from "./button"
import { useState } from "react"
import DataTable from "../datatable/DataTable"
import { Badge } from "./badge"
import { alarmColumns, PCC3300Columns } from "../datatable/tableHeaders";

// Mock data for demonstration
const alarmData = [
  { id: "ALM-001", type: "Overvoltage", severity: "critical", timestamp: "2025-02-23 14:32:11", value: "248.3V", status: "active" },
  { id: "ALM-002", type: "High Current", severity: "warning", timestamp: "2025-02-23 13:15:04", value: "18.7A", status: "active" },
  { id: "ALM-003", type: "Temp Threshold", severity: "warning", timestamp: "2025-02-23 11:08:57", value: "72°C", status: "acknowledged" },
  { id: "ALM-004", type: "Comm Timeout", severity: "info", timestamp: "2025-02-23 09:44:22", value: "—", status: "resolved" },
  { id: "ALM-005", type: "Power Surge", severity: "critical", timestamp: "2025-02-22 23:11:03", value: "+12%", status: "resolved" },
];

const historyData = [
  { ts: "14:32:11", status: "active", operation: "Manual", hourmeter: 1234, rotations: 1500, starts: 45, temp: 85, oilpressure: 5.2, battery: 12.6, an: 127, bn: 128, cn: 123, ab: 221, bc: 223, ca: 217, a: 15.2, b: 14.8, c: 16.5, active: 8.2, reactive: 3.1, apparent: 8.8, pf: 0.93 },
  { ts: "13:15:04", status: "active", operation: "Auto", hourmeter: 1230, rotations: 1480, starts: 44, temp: 80, oilpressure: 5.5, battery: 12.7, an: 126, bn: 127, cn: 122, ab: 220, bc: 222, ca: 216, a: 14.8, b: 14.5, c: 16.0, active: 7.8, reactive: 2.9, apparent: 8.3, pf: 0.94 },
  { ts: "11:08:57", status: "acknowledged", operation: "Manual", hourmeter: 1220, rotations: 1450, starts: 43, temp: 78, oilpressure: 5.8, battery: 12.8, an: 125, bn: 126, cn: 121, ab: 219, bc: 221, ca: 215, a: 14.5, b: 14.2, c: 15.8, active: 7.5, reactive: 2.7, apparent: 8.0, pf: 0.95 },
  { ts: "09:44:22", status: "resolved", operation: "Auto", hourmeter: 1200, rotations: 1400, starts: 40, temp: 75, oilpressure: 6.0, battery: 12.9, an: 124, bn: 125, cn: 120, ab: 218, bc: 220, ca: 214, a: 14.2, b: 14.0, c: 15.5, active: 7.0, reactive: 2.5, apparent: 7.5, pf: 0.96 },
  { ts: "23:11:03", status: "resolved", operation: "Manual", hourmeter: 1180, rotations: 1350, starts: 38, temp: 70, oilpressure: 6.5, battery: 13.0, an: 123, bn: 124, cn: 119, ab: 217, bc: 219, ca: 213, a: 14.0, b: 13.8, c: 15.2, active: 6.5, reactive: 2.3, apparent: 7.0, pf: 0.97 },
  { ts: "21:45:30", status: "active", operation: "Auto", hourmeter: 1150, rotations: 1300, starts: 35, temp: 68, oilpressure: 6.8, battery: 13.1, an: 122, bn: 123, cn: 118, ab: 216, bc: 218, ca: 212, a: 13.8, b: 13.5, c: 15.0, active: 6.0, reactive: 2.0, apparent: 6.5, pf: 0.98 },
  { ts: "20:30:15", status: "acknowledged", operation: "Manual", hourmeter: 1100, rotations: 1250, starts: 30, temp: 65, oilpressure: 7.0, battery: 13.2, an: 121, bn: 122, cn: 117, ab: 215, bc: 217, ca: 211, a: 13.5, b: 13.2, c: 14.8, active: 5.5, reactive: 1.8, apparent: 6.0, pf: 0.99 },
];

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

export default function TableDefault({ props: { data, ...props } }) {
  const severityBadge = (s) => ({ critical: "destructive", warning: "warning", info: "default" })[s] || "secondary";
  const statusBadge = (s) => ({ active: "destructive", acknowledged: "warning", resolved: "success" })[s] || "secondary";

  const [activeTab, setActiveTab] = useState("alarms");

  const generatorColumns = () => {
    // need to return different columns depending on the current generator
    if (activeTab === "history") {
      return PCC3300Columns;
    }
  }

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
              columns: generatorColumns(),
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
