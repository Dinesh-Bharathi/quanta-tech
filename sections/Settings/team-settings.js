import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Mail } from "lucide-react"

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@acme.com",
    role: "Admin",
    status: "Active",
    avatar: "/placeholder-user.jpg",
    initials: "JD",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@acme.com",
    role: "Manager",
    status: "Active",
    avatar: "/placeholder-user.jpg",
    initials: "SW",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@acme.com",
    role: "Staff",
    status: "Active",
    avatar: "/placeholder-user.jpg",
    initials: "MJ",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@acme.com",
    role: "Viewer",
    status: "Pending",
    avatar: "/placeholder-user.jpg",
    initials: "ED",
  },
]

export function TeamSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team members and their roles</CardDescription>
          <div className="flex items-center space-x-2">
            <Input placeholder="Enter email address" className="flex-1" />
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Resend Invitation
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Remove Member</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Configure what each role can access and modify</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium">
              <div>Permission</div>
              <div className="text-center">Admin</div>
              <div className="text-center">Manager</div>
              <div className="text-center">Staff</div>
            </div>

            {[
              "Manage Team",
              "View Analytics",
              "Manage Inventory",
              "Process Orders",
              "Access Billing",
              "Export Data",
            ].map((permission) => (
              <div key={permission} className="grid grid-cols-4 gap-4 items-center py-2 border-b">
                <div className="text-sm">{permission}</div>
                <div className="text-center">✓</div>
                <div className="text-center">{["Manage Team", "Access Billing"].includes(permission) ? "✗" : "✓"}</div>
                <div className="text-center">
                  {["Manage Team", "Access Billing", "Export Data"].includes(permission) ? "✗" : "✓"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
