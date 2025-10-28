/* eslint-disable import/no-anonymous-default-export */
import { API_ENDPOINTS } from "@/constants";
import axiosInstance from "@/services/network/index";

export default {
  tenantSubscribedMenus: async (tentUuid) => {
    const endpoint = API_ENDPOINTS.GET_SUBSCRIBED_MENUS.replace(
      ":tentUuid",
      tentUuid
    );
    return await axiosInstance.get(endpoint);
  },
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
};
