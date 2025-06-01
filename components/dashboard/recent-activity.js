import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: "John Doe",
    action: "created a new product",
    target: "iPhone 15 Pro",
    time: "2 minutes ago",
    avatar: "/placeholder-user.jpg",
    initials: "JD",
  },
  {
    user: "Sarah Wilson",
    action: "updated inventory for",
    target: "MacBook Air",
    time: "5 minutes ago",
    avatar: "/placeholder-user.jpg",
    initials: "SW",
  },
  {
    user: "Mike Johnson",
    action: "processed order",
    target: "#12345",
    time: "10 minutes ago",
    avatar: "/placeholder-user.jpg",
    initials: "MJ",
  },
  {
    user: "Emily Davis",
    action: "added new warehouse",
    target: "West Coast Hub",
    time: "15 minutes ago",
    avatar: "/placeholder-user.jpg",
    initials: "ED",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions in your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                <AvatarFallback>{activity.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user} {activity.action} <span className="font-semibold">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
