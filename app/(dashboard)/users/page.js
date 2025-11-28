"use client";

import { useState, useEffect } from "react";
import { UsersTable } from "@/components/users/users-table";
import { AddUserDialog } from "@/components/users/add-user-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, UserCheck, Shield, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/services/network";
import { useAuth } from "@/context/AuthContext";
import { decryption } from "@/lib/encryption";
import _ from "lodash";
import { toast } from "sonner";
// import { rolesApi } from "@/services/settings/config/roles/api";

const fetchUsers = async (tenant_uuid) => {
  try {
    const users = await axiosInstance.get(
      `/api/account/users/all/${tenant_uuid}`
    );
    const decryptRes = decryption(users.data.data);
    return decryptRes;
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Failed to load users. Please try again.");
    return [];
  }
};

const addUser = async (userData, tenant_uuid) => {
  const toastId = toast.loading("Creating user...");
  const body = {
    name: userData?.name,
    email: userData?.email,
    password: userData?.password,
    role: userData?.role,
    roleUuid: userData?.roleUuid,
    contactNumber: userData?.contactNumber,
  };

  try {
    const res = await axiosInstance.post(
      `/api/account/users/${tenant_uuid}`,
      body
    );
    if (res.status === 201) {
      toast.success("User created successfully!", { id: toastId });
      const newUser = decryption(res.data.data);
      return newUser;
    } else {
      toast.error(res.data?.error || "Failed to add user.", { id: toastId });
      return null;
    }
  } catch (error) {
    const message =
      error?.response?.data?.error ||
      "Something went wrong while adding the user.";
    toast.error(message, { id: toastId });
    console.error("Failed to add user:", error);
    return null;
  }
};

const updateUser = async (userData) => {
  const toastId = toast.loading("Updating user...");
  const body = {
    name: userData?.name,
    email: userData?.email,
    role: userData?.role,
    roleUuid: userData?.roleUuid,
    contactNumber: userData?.contactNumber,
  };

  try {
    const res = await axiosInstance.put(
      `/api/account/users/${userData?.tenant_user_uuid}`,
      body
    );
    toast.success("User updated successfully!", { id: toastId });
    const updated = decryption(res.data.data);
    return updated;
  } catch (error) {
    const message =
      error?.response?.data?.error ||
      "Something went wrong while updating the user.";
    toast.error(message, { id: toastId });
    console.error("Failed to update user:", error);
    return null;
  }
};

const deleteUser = async (userId) => {
  const toastId = toast.loading("Deleting user...");
  try {
    await axiosInstance.delete(`/api/account/users/${userId}`);
    toast.success("User deleted successfully!", { id: toastId });
    return { success: true };
  } catch (error) {
    const message =
      error?.response?.data?.error ||
      "Something went wrong while deleting the user.";
    toast.error(message, { id: toastId });
    console.error("Failed to delete user:", error);
    return null;
  }
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const { tentDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [roles, setRoles] = useState([]);

  const loadRoles = async () => {
    try {
      // const response = await rolesApi.getRoles(tentDetails?.tenant_uuid, {
      //   status: "active",
      // });
      // setRoles(response.data);
    } catch (error) {
      console.error("Failed to load roles:", error);
    }
  };

  useEffect(() => {
    if (tentDetails?.tenant_uuid) {
      loadRoles();
    }
  }, [tentDetails?.tenant_uuid]);

  useEffect(() => {
    if (tentDetails?.tenant_uuid) {
      loadUsers();
    }
  }, [tentDetails?.tenant_uuid]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers(tentDetails?.tenant_uuid);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (newUserData) => {
    try {
      const newUser = await addUser(newUserData, tentDetails?.tenant_uuid);
      if (!newUser) return { success: false };
      setUsers((prevUsers) => [...prevUsers, newUser?.user]);
      setIsAddDialogOpen(false);
      return { success: true };
    } catch (error) {
      toast.error("An unexpected error occurred while adding user.");
      console.error("Failed to add user:", error);
      return { success: false };
    }
  };

  const handleUpdateUser = async (updatedUserData) => {
    try {
      await updateUser(updatedUserData);
      await loadUsers();
      return { success: true };
    } catch (error) {
      console.error("Update error:", error);
      return { success: false };
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      await loadUsers();
      return { success: true };
    } catch (error) {
      console.error("Delete error:", error);
      return { success: false };
    }
  };

  const handleRoleChange = async (userId, newRole, roleUuid) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      await handleUpdateUser({ ...user, role: newRole, roleUuid });
    }
  };

  const getRoleCounts = () => {
    const counts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    return counts;
  };

  const roleCounts = getRoleCounts();

  // Get role colors dynamically
  const getRoleColor = (roleName) => {
    const colors = [
      "bg-red-100 text-red-800 border-red-200",
      "bg-orange-100 text-orange-800 border-orange-200",
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-pink-100 text-pink-800 border-pink-200",
    ];
    const index = roles.findIndex((role) => role.name === roleName);
    return (
      colors[index % colors.length] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

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

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">
            Users Management
          </h2>
          <p className="text-muted-foreground">
            Manage your team members and their permissions with ease
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        {/* Dynamic role cards */}
        {/* {roles.slice(0, 3).map((role, index) => { */}
        {roles.map((role, index) => {
          const icons = [Shield, UserCheck, Eye];
          const Icon = icons[index] || Shield;

          return (
            <Card key={role.tent_config_uuid}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {role.name}s
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {roleCounts[role.name] || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {role.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <UsersTable
            data={users}
            roles={roles}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onRoleChange={handleRoleChange}
            roleCounts={roleCounts}
            getRoleColor={getRoleColor}
          />
        </CardContent>
      </Card>

      <AddUserDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddUser={handleAddUser}
        roles={roles}
      />
    </div>
  );
}
