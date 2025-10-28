"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Copy,
  Edit,
  MoreHorizontal,
  Phone,
  Plus,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ControlsApi from "@/services/controls/api";
import { useAuth } from "@/context/AuthContext";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/navigation";

const Roles = () => {
  const router = useRouter();
  const { tentDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rolesList, setRolesList] = useState([]);

  useEffect(() => {
    const getTenantRoles = async () => {
      setLoading(true);
      try {
        const response = await ControlsApi.tenantRoles(tentDetails?.tent_uuid);
        const data = response.data?.data || [];
        setRolesList(data);
      } catch (err) {
        console.error("Fetch roles:", err);
      } finally {
        setLoading(false);
      }
    };

    if (tentDetails?.tent_uuid) getTenantRoles();
  }, [tentDetails?.tent_uuid]);

  const columns = [
    {
      accessorKey: "role_name",
      headerName: "Role Name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const roleName = row.getValue("role_name");
        return (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{roleName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      headerName: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description");
        return (
          <div className="text-sm text-muted-foreground max-w-md">
            {description || "No description"}
          </div>
        );
      },
    },
    {
      accessorKey: "role_type",
      header: "Type",
      headerName: "Type",
      cell: ({ row }) => {
        const roleType = row.getValue("role_type");
        return (
          <Badge variant={roleType === "SYSTEM" ? "default" : "secondary"}>
            {roleType}
          </Badge>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      headerName: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active");
        return (
          <Badge variant={isActive ? "success" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    // {
    //   accessorKey: "updated_at",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Last Updated
    //         <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     const date = row.getValue("updated_at");
    //     return (
    //       <div className="text-sm">
    //         {date ? format(new Date(date), "MMM dd, yyyy") : "-"}
    //       </div>
    //     );
    //   },
    // },
    {
      id: "actions",
      headerName: "actions",
      cell: ({ row }) => {
        const role = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(role.role_uuid)}
              >
                Copy role ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/controls/roles/edit/${role.role_uuid}`)
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit role
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-3 w-24 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
          <p className="text-muted-foreground">
            Manage your team members roles and their permissions with ease
          </p>
        </div>
        <Button onClick={() => router.push("/controls/roles/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{"1"}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-3 w-24 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable columns={columns} rows={rolesList} />
    </div>
  );
};

export default Roles;
