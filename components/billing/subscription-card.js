import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, CreditCard } from "lucide-react"

export function SubscriptionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Current Plan
        </CardTitle>
        <CardDescription>Manage your subscription and billing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Enterprise Plan</h3>
            <p className="text-sm text-muted-foreground">$99/month</p>
          </div>
          <Badge variant="secondary">Active</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Users</span>
            <span>25 / 100</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Storage</span>
            <span>2.4 GB / 10 GB</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>API Calls</span>
            <span>8,432 / 50,000</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <CreditCard className="mr-2 h-4 w-4" />
            Manage Billing
          </Button>
          <Button className="flex-1">Upgrade Plan</Button>
        </div>
      </CardContent>
    </Card>
  )
}
