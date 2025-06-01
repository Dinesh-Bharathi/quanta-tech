import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, Warehouse } from "lucide-react"

const stats = [
  {
    title: "Total Products",
    value: "1,234",
    icon: Package,
    description: "Active products in inventory",
  },
  {
    title: "Low Stock Items",
    value: "23",
    icon: AlertTriangle,
    description: "Products below minimum threshold",
  },
  {
    title: "Total Value",
    value: "$2.4M",
    icon: TrendingUp,
    description: "Current inventory value",
  },
  {
    title: "Warehouses",
    value: "8",
    icon: Warehouse,
    description: "Active storage locations",
  },
]

export function InventoryStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
