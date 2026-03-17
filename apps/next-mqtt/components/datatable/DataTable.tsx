"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

const severityBadge = (s) => ({ critical: "destructive", warning: "warning", info: "default" })[s] || "secondary";
const statusBadge = (s) => ({ active: "destructive", acknowledged: "warning", resolved: "success" })[s] || "secondary";

export default function DataTable({ props: { columns, data } }) {
  return (
    <div className="overflow-x-auto">
      <Table className="text-xs">
        {/* <TableHeader>
          <TableRow className="border-b border-slate-800/60 hover:bg-transparent">
            {columns.map(h => (
              <TableHead key={h.header} className="px-5 py-3 text-left text-slate-500 font-medium uppercase tracking-wider">{h.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader> */}

        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {data.map((row, i) => (
            <TableRow key={row.id || i} className={cn("border-b border-slate-800/30 transition-colors hover:bg-slate-800/30", i % 2 === 0 ? "" : "bg-slate-900/30")}>
              {columns.map(column => {
                const value = row[column.accessorKey as keyof typeof row];
                
                // Render different cell types based on column
                if (column.accessorKey === "id") {
                  return <TableCell key={column.accessorKey} className="px-5 py-3 font-mono text-cyan-400">{value}</TableCell>;
                } else if (column.accessorKey === "severity") {
                  return <TableCell key={column.accessorKey} className="px-5 py-3"><Badge className="" variant={severityBadge(value as string)}>{value}</Badge></TableCell>;
                } else if (column.accessorKey === "status") {
                  return <TableCell key={column.accessorKey} className="px-5 py-3"><Badge className="" variant={statusBadge(value as string)}>{value}</Badge></TableCell>;
                } else if (column.accessorKey === "action") {
                  return <TableCell key={column.accessorKey} className="px-5 py-3"><Button className="" variant="ghost" size="sm" onClick={() => alert(`Viewing ${row.id}`)}>View</Button></TableCell>;
                } else if (column.accessorKey === "ts") {
                  return <TableCell key={column.accessorKey} className="px-5 py-3 font-mono text-cyan-400">Today {value}</TableCell>;
                } else {
                  return <TableCell key={column.accessorKey} className="px-5 py-3 text-slate-300 font-mono">{value}</TableCell>;
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}