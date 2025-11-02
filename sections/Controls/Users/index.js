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
import { useAuth } from "@/context/AuthContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import ControlsApi from "@/services/controls/api";
import { decryption } from "@/lib/encryption";
import DataTable from "@/components/DataTable";
import { toast } from "sonner";

const Users = () => {
  const router = useRouter();
  const { tentDetails } = useAuth();
  const { showConfirmation } = useConfirmation();

  const [loading, setLoading] = useState(true);
  const [dataTableLoading, setDataTableLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [filteredUsersList, setFilteredUsersList] = useState([]);

  // 🔹 Search filter handler
  const onDataTableSearch = useCallback(
    (searchValue) => {
      if (!searchValue || searchValue.trim() === "") {
        setFilteredUsersList(usersList);
        return;
      }

      const lowerSearchValue = searchValue.toLowerCase();
      const filtered = usersList.filter((user) => {
        const searchableKeys = ["user_name", "user_email", "user_phone"];
        return searchableKeys.some((key) => {
          const fieldValue = user[key];
          if (!fieldValue) return false;
          return fieldValue.toString().toLowerCase().includes(lowerSearchValue);
        });
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
      const response = await ControlsApi.getTenantUsers(tentDetails?.tent_uuid);
      // const decrypted = decryption(response?.data?.data);
      // const data = decrypted?.data || [];
      setUsersList(response?.data?.data);
    } catch (err) {
      console.error("Fetch users:", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
      setDataTableLoading(false);
    }
  }, [tentDetails?.tent_uuid, usersList.length]);

  // 🔹 On mount
  useEffect(() => {
    if (tentDetails?.tent_uuid) getTenantUsers();
  }, [getTenantUsers, tentDetails?.tent_uuid]);

  // 🔹 Sync filtered data
  useEffect(() => {
    if (usersList.length > 0) setFilteredUsersList(usersList);
  }, [usersList]);

  // 🔹 Delete user
  const handleDeleteUser = async (user_uuid, user_name) => {
    await showConfirmation({
      title: "Delete User",
      message: `Are you sure you want to delete "${user_name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      isDangerous: true,
      onConfirm: async () => {
        try {
          await ControlsApi.deleteTenantUser(user_uuid);
          toast.success("User deleted successfully");
          getTenantUsers();
        } catch (err) {
          console.error("Delete user error:", err);
          toast.error("Failed to delete user");
        }
      },
    });
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
            {isOwner ? (
              <Badge variant="secondary" className="text-xs">
                Owner
              </Badge>
            ) : null}
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          {row.getValue("user_phone") || "—"}
        </div>
      ),
    },
    {
      accessorKey: "role_name",
      headerName: "Role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role_name");
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            {role || "—"}
          </div>
        );
      },
    },

    {
      accessorKey: "created_on",
      headerName: "Created On",
      header: "Created On",
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
        const isOwner = row.original.is_owner;
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
                onClick={() => navigator.clipboard.writeText(user.user_uuid)}
              >
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/controls/users/edit/${user.user_uuid}`)
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                disabled={isOwner}
                onClick={() => handleDeleteUser(user.user_uuid, user.user_name)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
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
            Manage your team members with ease
          </p>
        </div>
        <Button onClick={() => router.push("/controls/users/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersList.length}</div>
            <p className="text-xs text-muted-foreground">
              {usersList.length > 1 ? "+2 from last month" : "No change"}
            </p>
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
          rows={filteredUsersList}
          onDataTableSearch={onDataTableSearch}
          searchplaceholder={"Search users..."}
          filterColumns={["role_name"]}
        />
      )}
    </div>
  );
};

export default Users;
