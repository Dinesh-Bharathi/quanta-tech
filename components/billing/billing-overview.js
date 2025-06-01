import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Calendar, CreditCard, AlertCircle } from "lucide-react"

export function BillingOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Overview</CardTitle>
        <CardDescription>Your current billing information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <DollarSign className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm font-medium">Current Balance</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Calendar className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm font-medium">Next Billing Date</p>
            <p className="text-lg font-semibold">January 15, 2024</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <CreditCard className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm font-medium">Payment Method</p>
            <p className="text-lg font-semibold">•••• •••• •••• 4242</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <AlertCircle className="h-8 w-8 text-orange-500" />
          <div>
            <p className="text-sm font-medium">Trial Ends</p>
            <p className="text-lg font-semibold">7 days remaining</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
