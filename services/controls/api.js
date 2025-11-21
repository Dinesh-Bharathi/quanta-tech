/* eslint-disable import/no-anonymous-default-export */
import { API_ENDPOINTS } from "@/constants";
import axiosInstance from "@/services/network/index";

export default {
  // DynamicMenu
  tenantSubscribedMenus: async (tentUuid) => {
    const endpoint = API_ENDPOINTS.GET_SUBSCRIBED_MENUS.replace(
      ":tentUuid",
      tentUuid
    );
    return await axiosInstance.get(endpoint);
  },

  // Roles
  tenantRoles: async (tentUuid) => {
    const endpoint = API_ENDPOINTS.GET_TENT_ROLES.replace(
      ":tentUuid",
      tentUuid
    );
    return await axiosInstance.get(endpoint);
  },
  addTenantRole: async (tentUuid, data) => {
    const endpoint = API_ENDPOINTS.ADD_TENANT_ROLE.replace(
      ":tentUuid",
      tentUuid
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
  deleteTenantRole: async (tentUuid, roleUuid) => {
    const endpoint = API_ENDPOINTS.DELETE_TENANT_ROLE.replace(
      ":tentUuid",
      tentUuid
    ).replace(":roleUuid", roleUuid);
    return axiosInstance.delete(endpoint);
  },

  // Users
  getTenantUsers: async (tentUuid, params) => {
    const endpoint = API_ENDPOINTS.GET_TENANT_USERS.replace(
      ":tentUuid",
      tentUuid
    );
    return await axiosInstance.get(endpoint, { params });
  },

  createTenantUser: async (tentUuid, data) => {
    const endpoint = API_ENDPOINTS.CREATE_TENANT_USER.replace(
      ":tentUuid",
      tentUuid
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
  getTenantBranches: async (tentUuid) => {
    const endpoint = API_ENDPOINTS.GET_TENANT_BRANCHES.replace(
      ":tentUuid",
      tentUuid
    );
    return await axiosInstance.get(endpoint);
  },
  createTenantBranch: async (tentUuid, data) => {
    const endpoint = API_ENDPOINTS.CREATE_TENANT_BRANCH.replace(
      ":tentUuid",
      tentUuid
    );
    return await axiosInstance.post(endpoint, data);
  },
  updateTenantBranch: async (tentUuid, branchUuid, data) => {
    // const endpoint = `/branches/${tentUuid}/${branchUuid}`;
    const endpoint = API_ENDPOINTS.UPDATE_TENANT_BRANCH.replace(
      ":tentUuid",
      tentUuid
    ).replace(":branchUuid", branchUuid);
    return await axiosInstance.put(endpoint, data);
  },
  getTenantBranchById: async (tentUuid, branchUuid) => {
    const endpoint = API_ENDPOINTS.UPDATE_TENANT_BRANCH.replace(
      ":tentUuid",
      tentUuid
    ).replace(":branchUuid", branchUuid);
    return await axiosInstance.get(endpoint);
  },
  deleteTenantBranch: async (tentUuid, branchUuid) => {
    const endpoint = API_ENDPOINTS.DELETE_TENANT_BRANCH.replace(
      ":tentUuid",
      tentUuid
    ).replace(":branchUuid", branchUuid);
    return await axiosInstance.delete(endpoint);
  },
};
