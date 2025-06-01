"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Download, Settings } from "lucide-react"

const actions = [
  {
    title: "Add Product",
    description: "Create a new product in inventory",
    icon: Plus,
    action: () => console.log("Add product"),
  },
  {
    title: "Import Data",
    description: "Upload CSV or Excel files",
    icon: Upload,
    action: () => console.log("Import data"),
  },
  {
    title: "Export Report",
    description: "Download inventory reports",
    icon: Download,
    action: () => console.log("Export report"),
  },
  {
    title: "Settings",
    description: "Configure system settings",
    icon: Settings,
    action: () => console.log("Open settings"),
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={action.action}
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
