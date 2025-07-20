import { toast } from "sonner";

// Mock data for user roles
const mockRoles = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full system access with all permissions",
    permissions: ["create", "read", "update", "delete"],
    status: "true",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Admin",
    description: "Administrative access with limited system permissions",
    permissions: ["create", "read", "update", "delete"],
    status: "true",
    createdAt: "2024-01-16",
    updatedAt: "2024-01-20",
  },
  {
    id: 3,
    name: "Manager",
    description: "Management level access for team operations",
    permissions: ["create", "read", "update"],
    status: "true",
    createdAt: "2024-01-17",
    updatedAt: "2024-01-18",
  },
  {
    id: 4,
    name: "Editor",
    description: "Content editing and management permissions",
    permissions: ["create", "read", "update"],
    status: "true",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-19",
  },
  {
    id: 5,
    name: "Viewer",
    description: "Read-only access to system resources",
    permissions: ["read"],
    status: "false",
    createdAt: "2024-01-19",
    updatedAt: "2024-01-19",
  },
];

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const rolesApi = {
  // Get all roles with optional filtering
  async getRoles(filters = {}) {
    await delay(1000); // Simulate network delay

    let filteredRoles = [...mockRoles];

    if (filters.search) {
      filteredRoles = filteredRoles.filter(
        (role) =>
          role.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          role.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filteredRoles = filteredRoles.filter(
        (role) => role.status === filters.status
      );
    }

    return {
      data: filteredRoles,
      total: filteredRoles.length,
    };
  },

  // Create new role
  async createRole(roleData) {
    const toastId = toast.loading("Creating role...");
    try {
      await delay(800);
      const newRole = {
        id: Math.max(...mockRoles.map((r) => r.id)) + 1,
        ...roleData,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      mockRoles.push(newRole);
      toast.success("Role created successfully!", { id: toastId });
      return newRole;
    } catch (error) {
      toast.error("Failed to create role", { id: toastId });
      throw error;
    }
  },

  // Update role
  async updateRole(id, roleData) {
    const toastId = toast.loading("Updating role...");
    try {
      await delay(800);
      const index = mockRoles.findIndex((role) => role.id === id);
      if (index !== -1) {
        mockRoles[index] = {
          ...mockRoles[index],
          ...roleData,
          updatedAt: new Date().toISOString().split("T")[0],
        };
        toast.success("Role updated successfully!", { id: toastId });
        return mockRoles[index];
      }
      throw new Error("Role not found");
    } catch (error) {
      toast.error("Failed to update role", { id: toastId });
      throw error;
    }
  },

  // Delete role
  async deleteRole(id) {
    const toastId = toast.loading("Deleting role...");
    try {
      await delay(500);
      const index = mockRoles.findIndex((role) => role.id === id);
      if (index !== -1) {
        mockRoles.splice(index, 1);
        toast.success("Role deleted successfully!", { id: toastId });
        return true;
      }
      throw new Error("Role not found");
    } catch (error) {
      toast.error("Failed to delete role", { id: toastId });
      throw error;
    }
  },
};
