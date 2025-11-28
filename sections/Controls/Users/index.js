"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Plus,
  Trash2,
  UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import ControlsApi from "@/services/controls/api";
import { decryption } from "@/lib/encryption";
import DataTable from "@/components/DataTable";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGuard } from "@/components/permissions/PermissionGuard";

const Users = () => {
  const router = useRouter();
  const { canAdd, canUpdate, canDelete, canRead } = usePermissions();
  const { tentDetails, currentBranch } = useAuth();
  const { showConfirmation } = useConfirmation();

  const [loading, setLoading] = useState(true);
  const [dataTableLoading, setDataTableLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [filteredUsersList, setFilteredUsersList] = useState([]);

  // 🔹 Search filter handler (updated to search in roles array)
  const onDataTableSearch = useCallback(
    (searchValue) => {
      if (!searchValue || searchValue.trim() === "") {
        setFilteredUsersList(usersList);
        return;
      }

      const lowerSearchValue = searchValue.toLowerCase();
      const filtered = usersList.filter((user) => {
        // Search in basic fields
        const basicFields = ["user_name", "user_email", "user_phone"];
        const basicMatch = basicFields.some((key) => {
          const fieldValue = user[key];
          if (!fieldValue) return false;
          return fieldValue.toString().toLowerCase().includes(lowerSearchValue);
        });

        // Search in roles array
        const rolesMatch = user.roles?.some(
          (role) =>
            role.role_name?.toLowerCase().includes(lowerSearchValue) ||
            role.branch?.branch_name?.toLowerCase().includes(lowerSearchValue)
        );

        return basicMatch || rolesMatch;
      });

      setFilteredUsersList(filtered);
    },
    [usersList]
  );

  // 🔹 Fetch Users API
  const getTenantUsers = useCallback(async () => {
    if (!usersList.length > 0) setLoading(true);
    setDataTableLoading(true);
    try {
      const response = await ControlsApi.getTenantUsers(
        tentDetails?.tenant_uuid,
        { all: false, branchUuid: currentBranch?.branch_uuid }
      );
      setUsersList(response?.data?.data || []);
    } catch (err) {
      console.error("Fetch users:", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
      setDataTableLoading(false);
    }
  }, [tentDetails?.tenant_uuid, currentBranch?.branch_uuid]);

  // 🔹 On mount
  useEffect(() => {
    if (tentDetails?.tenant_uuid) getTenantUsers();
  }, [tentDetails?.tenant_uuid, getTenantUsers]);

  // 🔹 Sync filtered data
  useEffect(() => {
    if (usersList.length > 0) setFilteredUsersList(usersList);
  }, [usersList]);

  // 🔹 Delete user
  const handleDeleteUser = async (tenant_user_uuid, user_name) => {
    await showConfirmation({
      title: "Delete User",
      message: `Are you sure you want to delete "${user_name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      isDangerous: true,
      onConfirm: async () => {
        try {
          await ControlsApi.deleteTenantUser(tenant_user_uuid);
          toast.success("User deleted successfully");
          getTenantUsers();
        } catch (err) {
          console.error("Delete user error:", err);
          toast.error("Failed to delete user");
        }
      },
    });
  };

  // 🔹 Helper: Get unique role names for filtering
  const getUniqueRoleNames = () => {
    const roleNames = new Set();
    usersList.forEach((user) => {
      user.roles?.forEach((role) => {
        if (role.role_name) roleNames.add(role.role_name);
      });
    });
    return Array.from(roleNames);
  };

  // 🔹 Helper: Get unique branch names for filtering
  const getUniqueBranchNames = () => {
    const branchNames = new Set();
    usersList.forEach((user) => {
      user.roles?.forEach((role) => {
        if (role.branch?.branch_name) {
          branchNames.add(role.branch.branch_name);
        }
      });
    });
    return Array.from(branchNames);
  };

  // 🔹 Calculate stats
  const stats = {
    totalUsers: usersList.length,
    usersWithTenantWideRoles: usersList.filter((user) =>
      user.roles?.some((role) => role.scope === "tenant")
    ).length,
    usersWithBranchRoles: usersList.filter((user) =>
      user.roles?.some((role) => role.scope === "branch")
    ).length,
    activeUsers: usersList.filter((user) => !user.is_owner).length,
  };

  // 🔹 DataTable columns
  const columns = [
    {
      accessorKey: "user_name",
      headerName: "Name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.getValue("user_name");
        const isOwner = row.original.is_owner;
        return (
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{name}</span>
            {isOwner && (
              <Badge variant="secondary" className="text-xs">
                Owner
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "user_email",
      headerName: "Email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          {row.getValue("user_email")}
        </div>
      ),
    },
    {
      accessorKey: "user_phone",
      headerName: "Phone",
      header: "Phone",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            {row?.original?.user_country_code
              ? `+${row?.original?.user_country_code}`
              : ""}{" "}
            {row.getValue("user_phone") || "—"}
          </div>
        );
      },
    },
    {
      accessorKey: "roles",
      headerName: "Roles & Branches",
      header: "Roles & Branches",
      cell: ({ row }) => {
        const roles = row.original.roles || [];

        if (roles.length === 0) {
          return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              No roles assigned
            </div>
          );
        }

        // Show first role + count if more
        const firstRole = roles[0];
        const remainingCount = roles.length - 1;

        return (
          <div className="flex items-center gap-2 flex-wrap">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant={
                      firstRole.scope === "tenant" ? "default" : "secondary"
                    }
                    className="cursor-help"
                  >
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    {firstRole.role_name}
                    {firstRole.branch && (
                      <>
                        <Building2 className="h-3 w-3 ml-1 mr-1" />
                        <span className="text-xs">
                          {firstRole.branch.branch_name}
                        </span>
                      </>
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {firstRole.scope === "tenant"
                      ? "Tenant-wide access"
                      : `Access to ${
                          firstRole.branch?.branch_name || "branch"
                        }`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {remainingCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="cursor-help">
                      +{remainingCount} more
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      {roles.slice(1).map((role, idx) => (
                        <div key={idx} className="text-xs">
                          • {role.role_name}
                          {role.branch && ` (${role.branch.branch_name})`}
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
      // Custom filter function for roles
      filterFn: (row, columnId, filterValue) => {
        const roles = row.original.roles || [];
        return roles.some(
          (role) =>
            role.role_name?.toLowerCase().includes(filterValue.toLowerCase()) ||
            role.branch?.branch_name
              ?.toLowerCase()
              .includes(filterValue.toLowerCase())
        );
      },
    },
    {
      accessorKey: "created_on",
      headerName: "Created On",
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
        const date = new Date(row.getValue("created_on"));
        return (
          <div className="text-sm text-muted-foreground">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      headerName: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        const isOwner = user.is_owner;
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
                onClick={() => {
                  navigator.clipboard.writeText(user.user_email);
                  toast.success("Email copied to clipboard");
                }}
              >
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${
                      user.user_country_code ? `+${user.user_country_code}` : ""
                    } ${user.user_phone}`
                  );
                  toast.success("Phone number copied to clipboard");
                }}
              >
                Copy Phone
              </DropdownMenuItem>
              {(canUpdate || canDelete) && <DropdownMenuSeparator />}

              <PermissionGuard permission="update">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/controls/users/edit/${user.tenant_user_uuid}`)
                  }
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </DropdownMenuItem>
              </PermissionGuard>
              <PermissionGuard permission="delete">
                <DropdownMenuItem
                  className="text-destructive"
                  disabled={isOwner}
                  onClick={() =>
                    handleDeleteUser(user.tenant_user_uuid, user.user_name)
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </DropdownMenuItem>
              </PermissionGuard>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // 🔹 Loading state (skeleton)
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
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🔹 Final render
  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage your team members and their role assignments
          </p>
        </div>
        <PermissionGuard permission="add">
          <Button onClick={() => router.push("/controls/users/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </PermissionGuard>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tenant-Wide Access
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.usersWithTenantWideRoles}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with global roles
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Branch-Specific
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.usersWithBranchRoles}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with branch roles
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Non-owner users</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
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
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              rows={filteredUsersList}
              onDataTableSearch={onDataTableSearch}
              searchplaceholder={"Search name, email, phone or role..."}
              // filterColumns={["roles"]}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Users;
