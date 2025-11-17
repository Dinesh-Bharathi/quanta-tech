"use client";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Plus,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
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
import { useConfirmation } from "@/context/ConfirmationContext";
import { toast } from "sonner";
import { decryption } from "@/lib/encryption";

const Roles = () => {
  const router = useRouter();
  const { tentDetails } = useAuth();
  const { showConfirmation } = useConfirmation();
  const [loading, setLoading] = useState(true);
  const [dataTableLoading, setDataTableLoading] = useState(true);
  const [rolesList, setRolesList] = useState([]);
  const [filteredRolesList, setFilteredRolesList] = useState([]);

  const onDataTableSearch = useCallback(
    (searchValue) => {
      if (!searchValue || searchValue.trim() === "") {
        // If search is empty, show all roles
        setFilteredRolesList(rolesList);
        return;
      }

      const lowerSearchValue = searchValue.toLowerCase();

      const filtered = rolesList.filter((role) => {
        // Define which keys to search in
        const searchableKeys = ["role_name", "description"];

        // Check if search value matches any of the searchable keys
        return searchableKeys.some((key) => {
          const fieldValue = role[key];
          if (fieldValue === null || fieldValue === undefined) {
            return false;
          }
          return fieldValue.toString().toLowerCase().includes(lowerSearchValue);
        });
      });

      setFilteredRolesList(filtered);
    },
    [rolesList]
  );

  // Update the useEffect to populate filteredRolesList when data loads
  useEffect(() => {
    if (rolesList.length > 0) {
      setFilteredRolesList(rolesList);
    }
  }, [rolesList]);

  const getTenantRoles = useCallback(async () => {
    if (!rolesList.length > 0) {
      setLoading(true);
    }
    setDataTableLoading(true);
    try {
      const response = await ControlsApi.tenantRoles(tentDetails?.tent_uuid);
      const descryptRes = decryption(response?.data?.data);
      const data = descryptRes?.data || [];
      setRolesList(data);
    } catch (err) {
      console.error("Fetch roles:", err);
    } finally {
      setLoading(false);
      setDataTableLoading(false);
    }
  }, [rolesList.length, tentDetails?.tent_uuid]);

  useEffect(() => {
    if (tentDetails?.tent_uuid) getTenantRoles();
  }, [getTenantRoles, tentDetails?.tent_uuid]);

  const handleDeleteRole = async (role_uuid, roleName) => {
    const confirmed = await showConfirmation({
      title: "Delete Role",
      message: `Are you sure you want to delete the role "${roleName}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      isDangerous: true,
      onConfirm: async () => {
        try {
          await ControlsApi.deleteTenantRole(role_uuid);
          toast.success("Role deleted successfully!", { id: role_uuid });
          getTenantRoles();
          // setRolesList(rolesList.filter(role => role.role_uuid !== role_uuid));
        } catch (err) {
          toast.error("Please try again!", { id: role_uuid });
          console.error("Delete role error:", err);
        }
      },
    });
  };

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
    {
      accessorKey: "created_at",
      headerName: "Created On",
      header: "Created On",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created On
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return (
          <div className="text-sm text-muted-foreground px-4">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      headerName: "actions",
      cell: ({ row }) => {
        const role = row.original;
        const isSystemRole = role.role_type === "SYSTEM";
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
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
              <DropdownMenuItem
                className="text-destructive"
                disabled={isSystemRole}
                onClick={() => handleDeleteRole(role.role_uuid, role.role_name)}
              >
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
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
        <Card className="bg-card border-border">
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
          <Card key={i} className="bg-card border-border">
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

      {dataTableLoading ? (
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
      ) : (
        <DataTable
          columns={columns}
          rows={filteredRolesList}
          onDataTableSearch={onDataTableSearch}
          searchplaceholder={"Search roles..."}
          filterColumns={["is_active"]}
        />
      )}
    </div>
  );
};

export default Roles;
