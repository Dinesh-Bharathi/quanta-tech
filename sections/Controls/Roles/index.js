"use client";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Plus,
  Shield,
  Trash2,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Skeleton } from "@/components/ui/skeleton";
import ControlsApi from "@/services/controls/api";
import { useAuth } from "@/context/AuthContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { decryption } from "@/lib/encryption";
import DataTable from "@/components/DataTable";

const Roles = () => {
  const router = useRouter();
  const { tentDetails } = useAuth();
  const { showConfirmation } = useConfirmation();

  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);

  const [rolesList, setRolesList] = useState([]);
  const [filteredRolesList, setFilteredRolesList] = useState([]);

  /* ------------------------------
        SEARCH FILTERING
  --------------------------------*/
  const onDataTableSearch = useCallback(
    (value) => {
      if (!value?.trim()) {
        setFilteredRolesList(rolesList);
        return;
      }

      const term = value.toLowerCase();
      const searchKeys = [
        "role_name",
        "description",
        "created_by",
        "updated_by",
      ];

      const filtered = rolesList.filter((role) =>
        searchKeys.some((key) =>
          role[key]?.toString().toLowerCase().includes(term)
        )
      );

      setFilteredRolesList(filtered);
    },
    [rolesList]
  );

  /* ------------------------------
        FETCH ROLES
  --------------------------------*/
  const getTenantRoles = useCallback(async () => {
    setLoading(true);
    setTableLoading(true);

    try {
      const res = await ControlsApi.tenantRoles(tentDetails?.tent_uuid);
      const decrypted = decryption(res?.data?.data);

      const data = decrypted?.data ?? [];
      setRolesList(data);
      setFilteredRolesList(data);
    } catch (err) {
      console.error("Fetch roles:", err);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  }, [tentDetails?.tent_uuid]);

  useEffect(() => {
    if (tentDetails?.tent_uuid) getTenantRoles();
  }, [tentDetails?.tent_uuid, getTenantRoles]);

  /* ------------------------------
        DELETE ROLE
  --------------------------------*/
  const handleDeleteRole = async (role_uuid, name) => {
    await showConfirmation({
      title: "Delete Role",
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      isDangerous: true,
      onConfirm: async () => {
        try {
          const res = await ControlsApi.deleteTenantRole(
            tentDetails?.tent_uuid,
            role_uuid
          );

          const decrypted = decryption(res.data.data);
          toast.success(decrypted?.message || "Role deleted successfully!");

          getTenantRoles();
        } catch (err) {
          const error = decryption(err, "error");
          toast.error(error?.message || "Please try again!");
        }
      },
    });
  };

  /* ------------------------------
        TABLE COLUMNS
  --------------------------------*/
  const columns = [
    {
      accessorKey: "role_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.getValue("role_name");
        const type = row.original.role_type;

        return (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{name}</span>

            {type === "SYSTEM" && (
              <Badge variant="outline" className="text-xs">
                System
              </Badge>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-sm truncate">
          {row.getValue("description")}
        </div>
      ),
    },

    {
      accessorKey: "assigned_users_count",
      header: "Users",
      cell: ({ row }) => {
        const count = row.getValue("assigned_users_count");
        return (
          <Badge variant={count > 0 ? "default" : "secondary"}>
            {count} users
          </Badge>
        );
      },
    },

    {
      accessorKey: "created_by",
      header: "Created By",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.getValue("created_by") || "System"}
        </span>
      ),
    },

    {
      accessorKey: "updated_by",
      header: "Updated By",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.getValue("updated_by") || "—"}
        </span>
      ),
    },

    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated On
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const dt = row.getValue("updated_at");
        if (!dt) return <span className="text-muted-foreground">—</span>;

        return (
          <span className="text-sm text-muted-foreground">
            {new Date(dt).toLocaleDateString()}
          </span>
        );
      },
    },

    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const active = row.getValue("is_active");
        return (
          <Badge variant={active ? "success" : "destructive"}>
            {active ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const role = row.original;
        const isSystem = role.role_type === "SYSTEM";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(role.role_uuid)}
              >
                Copy Role ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  router.push(`/controls/roles/edit/${role.role_uuid}`)
                }
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={isSystem}
                className="text-destructive"
                onClick={() => handleDeleteRole(role.role_uuid, role.role_name)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  /* ------------------------------
       ENTERPRISE METRIC CARDS
  --------------------------------*/
  const totalRoles = rolesList.length;
  const activeRoles = rolesList.filter((r) => r.is_active).length;
  const totalUsers = rolesList.reduce(
    (sum, r) => sum + (r.assigned_users_count || 0),
    0
  );

  const metricCards = [
    {
      title: "Total Roles",
      value: totalRoles,
      icon: Shield,
    },
    {
      title: "Active Roles",
      value: activeRoles,
      icon: Shield,
    },
    {
      title: "Assigned Users",
      value: totalUsers,
      icon: Users,
    },
  ];

  /* ------------------------------
         ENTERPRISE SKELETON
  --------------------------------*/
  const EnterpriseSkeleton = () => (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}

        <Card className="col-span-full mt-4">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  /* ------------------------------
         MAIN UI
  --------------------------------*/
  return (
    <div className="flex-1 space-y-6">
      {/* Metrics */}
      {loading ? (
        <EnterpriseSkeleton />
      ) : (
        <div>
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Roles</h2>
              <p className="text-muted-foreground">
                Manage user roles, permissions, and access policies.
              </p>
            </div>

            <Button onClick={() => router.push("/controls/roles/add")}>
              <Plus className="mr-2 h-4 w-4" /> Add Role
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {metricCards.map((card, idx) => (
              <Card key={idx}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">{card.title}</CardTitle>
                  <card.icon className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{card.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Data Table */}
          <div className="mt-4">
            <Card>
              <CardHeader></CardHeader>
              <CardContent>
                <DataTable
                  columns={columns}
                  rows={filteredRolesList}
                  onDataTableSearch={onDataTableSearch}
                  searchplaceholder="Search roles..."
                  filterColumns={["is_active"]}
                  isLoading={tableLoading}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
