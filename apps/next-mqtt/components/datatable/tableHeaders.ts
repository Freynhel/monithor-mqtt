const alarmColumns = [
  { header: "ID", accessorKey: "id" },
  { header: "Mensagem", accessorKey: "type" },
  { header: "Severidade", accessorKey: "severity" },
  { header: "Entrada", accessorKey: "timestamp" },
  { header: "Value", accessorKey: "value" },
  { header: "Status", accessorKey: "status" },
  { header: "Action", accessorKey: "action" },
]

const PCC3300Columns = [
  { header: "Timestamp", accessorKey: "ts" },
  { header: "Status", accessorKey: "status"},
  { header: "Modo de Operação", accessorKey: "operation" },
  { header: "Horímetro", accessorKey: "hourmeter" },
  { header: "Rotação", accessorKey: "rotations" },
  { header: "Partidas", accessorKey: "starts" },
  { header: "Temperatura", accessorKey: "temp" },
  { header: "Pressão Óleo", accessorKey: "oilpressure" },
  { header: "Tensão Bateria", accessorKey: "battery" },
  { header: "AN", accessorKey: "an" },
  { header: "BN", accessorKey: "bn" },
  { header: "CN", accessorKey: "cn" },
  { header: "AB", accessorKey: "ab" },
  { header: "BC", accessorKey: "bc" },
  { header: "CA", accessorKey: "ca" },
  { header: "A", accessorKey: "a" },
  { header: "B", accessorKey: "b" },
  { header: "C", accessorKey: "c" },
  { header: "Ativa", accessorKey: "active" },
  { header: "Reativa", accessorKey: "reactive" },
  { header: "Aparente", accessorKey: "apparent" },
  { header: "PF", accessorKey: "pf" },
]

export { alarmColumns, PCC3300Columns };