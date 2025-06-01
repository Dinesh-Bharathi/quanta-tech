import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye } from "lucide-react"

const invoices = [
  {
    id: "INV-001",
    date: "2024-01-01",
    amount: "$99.00",
    status: "Paid",
    description: "Enterprise Plan - January 2024",
  },
  {
    id: "INV-002",
    date: "2023-12-01",
    amount: "$99.00",
    status: "Paid",
    description: "Enterprise Plan - December 2023",
  },
  {
    id: "INV-003",
    date: "2023-11-01",
    amount: "$99.00",
    status: "Paid",
    description: "Enterprise Plan - November 2023",
  },
]

export function InvoiceHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice History</CardTitle>
        <CardDescription>Download and view your past invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">{invoice.id}</p>
                <p className="text-sm text-muted-foreground">{invoice.description}</p>
                <p className="text-sm text-muted-foreground">{invoice.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{invoice.status}</Badge>
                <span className="font-semibold">{invoice.amount}</span>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
