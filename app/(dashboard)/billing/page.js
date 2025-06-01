import { BillingOverview } from "@/components/billing/billing-overview"
import { SubscriptionCard } from "@/components/billing/subscription-card"
import { UsageChart } from "@/components/billing/usage-chart"
import { InvoiceHistory } from "@/components/billing/invoice-history"

export default function BillingPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Billing & Subscription</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SubscriptionCard />
        <BillingOverview />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <UsageChart />
        <InvoiceHistory />
      </div>
    </div>
  )
}
