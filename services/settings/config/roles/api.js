import axiosInstance from "@/services/network";
import { toast } from "sonner";

export const rolesApi = {
  /**
   * Get roles by tent_uuid, with optional search & status filters
   */
  async getRoles(tent_uuid, filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.status !== undefined) params.append("status", filters.status);

      const res = await axiosInstance.get(
        `/api/settings/config/roles/${tent_uuid}?${params.toString()}`
      );

      return res.data;
    } catch (error) {
      toast.error("Failed to fetch roles", { id: toastId });
      throw error;
    }
  },

  /**
   * Create a new role for a tent
   */
  async createRole(tent_uuid, roleData) {
    const toastId = toast.loading("Creating role...");
    try {
      const res = await axiosInstance.post(
        `/api/settings/config/roles/${tent_uuid}`,
        roleData
      );

      toast.success("Role created successfully!", { id: toastId });
      return res.data;
    } catch (error) {
      toast.error("Failed to create role", { id: toastId });
      throw error;
    }
  },

  /**
   * Update a role by tent_config_uuid
   */
  async updateRole(tent_config_uuid, roleData) {
    const toastId = toast.loading("Updating role...");
    try {
      const res = await axiosInstance.put(
        `/api/settings/config/roles/${tent_config_uuid}`,
        roleData
      );

      toast.success("Role updated successfully!", { id: toastId });
      return res.data;
    } catch (error) {
      toast.error("Failed to update role", { id: toastId });
      throw error;
    }
  },

  /**
   * Delete a role by tent_config_uuid
   */
  async deleteRole(tent_config_uuid) {
    const toastId = toast.loading("Deleting role...");
    try {
      await axiosInstance.delete(
        `/api/settings/config/roles/${tent_config_uuid}`
      );

      toast.success("Role deleted successfully!", { id: toastId });
      return true;
    } catch (error) {
      toast.error("Failed to delete role", { id: toastId });
      throw error;
    }
  },

  /**
   * Delete a role by tent_config_uuid
   */
  async updateRoleModule(config_uuid, moduleData) {
    const toastId = toast.loading("Updating role modules...");
    try {
      const res = await axiosInstance.put(
        `/api/settings/config/role-modules/${config_uuid}`,
        moduleData
      );

      toast.success("Role updated successfully!", { id: toastId });
      return res.data;
    } catch (error) {
      toast.error("Failed to update role", { id: toastId });
      throw error;
    }
  },
};
