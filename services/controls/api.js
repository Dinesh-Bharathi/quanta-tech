/* eslint-disable import/no-anonymous-default-export */
import { API_ENDPOINTS } from "@/constants";
import axiosInstance from "@/services/network/index";

export default {
  // DynamicMenu
  tenantSubscribedMenus: async (tenantUuid) => {
    const endpoint = API_ENDPOINTS.GET_SUBSCRIBED_MENUS.replace(
      ":tenantUuid",
      tenantUuid
    );
    return await axiosInstance.get(endpoint);
  },

  // Roles
  tenantRoles: async (tenantUuid) => {
    const endpoint = API_ENDPOINTS.GET_TENT_ROLES.replace(
      ":tenantUuid",
      tenantUuid
    );
    return await axiosInstance.get(endpoint);
  },
  addTenantRole: async (tenantUuid, data) => {
    const endpoint = API_ENDPOINTS.ADD_TENANT_ROLE.replace(
      ":tenantUuid",
      tenantUuid
    );
    return await axiosInstance.post(endpoint, data);
  },
  getTenantRoleByUuid: async (roleUuid) => {
    const endpoint = API_ENDPOINTS.GET_TENANT_ROLE_BY_UUID.replace(
      ":roleUuid",
      roleUuid
    );
    return await axiosInstance.get(endpoint);
  },
  updateTenantRole: async (roleUuid, data) => {
    const endpoint = API_ENDPOINTS.UPDATE_TENANT_ROLE.replace(
      ":roleUuid",
      roleUuid
    );
    return await axiosInstance.put(endpoint, data);
  },
  deleteTenantRole: async (tenantUuid, roleUuid) => {
    const endpoint = API_ENDPOINTS.DELETE_TENANT_ROLE.replace(
      ":tenantUuid",
      tenantUuid
    ).replace(":roleUuid", roleUuid);
    return axiosInstance.delete(endpoint);
  },

  // Users
  getTenantUsers: async (tenantUuid, params) => {
    const endpoint = API_ENDPOINTS.GET_TENANT_USERS.replace(
      ":tenantUuid",
      tenantUuid
    );
    return await axiosInstance.get(endpoint, { params });
  },

  createTenantUser: async (tenantUuid, data) => {
    const endpoint = API_ENDPOINTS.CREATE_TENANT_USER.replace(
      ":tenantUuid",
      tenantUuid
    );
    return await axiosInstance.post(endpoint, data);
  },

  updateTenantUser: async (userUuid, data) => {
    const endpoint = API_ENDPOINTS.UPDATE_TENANT_USER.replace(
      ":userUuid",
      userUuid
    );
    return await axiosInstance.put(endpoint, data);
  },

  deleteTenantUser: async (userUuid) => {
    const endpoint = API_ENDPOINTS.DELETE_TENANT_USER.replace(
      ":userUuid",
      userUuid
    );
    return await axiosInstance.delete(endpoint);
  },

  // Branches
  getTenantBranches: async (tenantUuid) => {
    const endpoint = API_ENDPOINTS.GET_TENANT_BRANCHES.replace(
      ":tenantUuid",
      tenantUuid
    );
    return await axiosInstance.get(endpoint);
  },
  createTenantBranch: async (tenantUuid, data) => {
    const endpoint = API_ENDPOINTS.CREATE_TENANT_BRANCH.replace(
      ":tenantUuid",
      tenantUuid
    );
    return await axiosInstance.post(endpoint, data);
  },
  updateTenantBranch: async (tenantUuid, branchUuid, data) => {
    // const endpoint = `/branches/${tenantUuid}/${branchUuid}`;
    const endpoint = API_ENDPOINTS.UPDATE_TENANT_BRANCH.replace(
      ":tenantUuid",
      tenantUuid
    ).replace(":branchUuid", branchUuid);
    return await axiosInstance.put(endpoint, data);
  },
  getTenantBranchById: async (tenantUuid, branchUuid) => {
    const endpoint = API_ENDPOINTS.UPDATE_TENANT_BRANCH.replace(
      ":tenantUuid",
      tenantUuid
    ).replace(":branchUuid", branchUuid);
    return await axiosInstance.get(endpoint);
  },
  deleteTenantBranch: async (tenantUuid, branchUuid) => {
    const endpoint = API_ENDPOINTS.DELETE_TENANT_BRANCH.replace(
      ":tenantUuid",
      tenantUuid
    ).replace(":branchUuid", branchUuid);
    return await axiosInstance.delete(endpoint);
  },
};
