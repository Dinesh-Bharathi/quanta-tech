"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowUpDown, Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import ControlsApi from "@/services/controls/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { useConfirmation } from "@/context/ConfirmationContext";
import { toast } from "sonner";

export const Branches = () => {
  const router = useRouter();
  const { tentDetails } = useAuth();
  const { showConfirmation } = useConfirmation();

  const [loading, setLoading] = useState(true);
  const [dataTableLoading, setDataTableLoading] = useState(true);
  const [branchesList, setBranchesList] = useState([]);
  const [filterBranchesList, setFilterBranchesList] = useState([]);

  useEffect(() => {
    if (branchesList.length > 0) {
      setFilterBranchesList(branchesList);
    }
  }, [branchesList]);

  const onDataTableSearch = useCallback(
    (searchValue) => {
      if (!searchValue || searchValue.trim() === "") {
        // If search is empty, show all roles
        setFilterBranchesList(branchesList);
        return;
      }

      const lowerSearchValue = searchValue.toLowerCase();

      const filtered = branchesList.filter((branch) => {
        // Define which keys to search in
        const searchableKeys = [
          "branch_name",
          "phone",
          "address1",
          "postal_code",
        ];

        // Check if search value matches any of the searchable keys
        return searchableKeys.some((key) => {
          const fieldValue = branch[key];
          if (fieldValue === null || fieldValue === undefined) {
            return false;
          }
          return fieldValue.toString().toLowerCase().includes(lowerSearchValue);
        });
      });

      setFilterBranchesList(filtered);
    },
    [branchesList]
  );

  const getBranchesList = useCallback(async () => {
    if (!branchesList.length > 0) {
      setLoading(true);
    }
    setDataTableLoading(true);
    try {
      const response = await ControlsApi.getTenantBranches(
        tentDetails?.tent_uuid
      );
      setBranchesList(response.data.data);
      setFilterBranchesList(response.data.data);
    } catch (error) {
      console.error("Fetch branches:", error);
    } finally {
      setLoading(false);
      setDataTableLoading(false);
    }
  }, [branchesList.length, tentDetails?.tent_uuid]);

  useEffect(() => {
    if (tentDetails?.tent_uuid) {
      getBranchesList();
    }
  }, [getBranchesList, tentDetails?.tent_uuid]);

  const handleDeleteBranch = async (branch_uuid, branch_name) => {
    await showConfirmation({
      title: "Delete Branch",
      message: `Are you sure you want to delete "${branch_name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      isDangerous: true,
      onConfirm: async () => {
        try {
          await ControlsApi.deleteTenantBranch(
            tentDetails?.tent_uuid,
            branch_uuid
          );
          toast.success("Branch deleted successfully");
          getBranchesList();
        } catch (err) {
          console.error("Delete branch error:", err);
          toast.error("Failed to delete branch");
        }
      },
    });
  };

  const columns = [
    {
      accessorKey: "branch_name",
      headerName: "Branch Name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Branch Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const branch = row.original;
        return (
          <div className="flex items-center gap-2 font-medium">
            {branch.branch_name}
            {branch.is_hq && (
              <Badge variant="success" className="text-xs px-2 py-0.5">
                HQ
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      headerName: "Phone",
      header: "Phone",
      cell: ({ row }) => {
        const value = row.getValue("phone");
        return (
          <span className="text-sm text-muted-foreground">{value || "—"}</span>
        );
      },
    },
    {
      accessorKey: "address1",
      headerName: "Address",
      header: "Address",
      cell: ({ row }) => {
        const value = row.getValue("address1");
        return (
          <span className="text-sm text-muted-foreground">{value || "—"}</span>
        );
      },
    },
    {
      accessorKey: "postal_code",
      headerName: "Postal Code",
      header: "Postal Code",
      cell: ({ row }) => {
        const value = row.getValue("postal_code");
        return (
          <span className="text-sm text-muted-foreground">{value || "—"}</span>
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
          <span className="text-sm text-muted-foreground px-4">
            {date.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: "actions",
      headerName: "Actions",
      cell: ({ row }) => {
        const branch = row.original;

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
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  router.push(`/controls/branches/edit/${branch.branch_uuid}`)
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Branch
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive"
                disabled={branch.is_hq}
                onClick={() =>
                  handleDeleteBranch(branch.branch_uuid, branch.branch_name)
                }
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Branch
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">
            Organisation Branches
          </h2>
          <p className="text-muted-foreground">
            Create and manage all branches within your organisation.
          </p>
        </div>
        <Button onClick={() => router.push("/controls/branches/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Branch
        </Button>
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
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              rows={filterBranchesList}
              onDataTableSearch={onDataTableSearch}
              searchplaceholder={"Search branch..."}
              // filterColumns={["is_active"]}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
