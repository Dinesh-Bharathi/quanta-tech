/* eslint-disable import/no-anonymous-default-export */
import { API_ENDPOINTS } from "@/constants";
import axiosInstance from "@/services/network/index";

export default {
  tenantRoles: async (tentUuid) => {
    const endpoint = API_ENDPOINTS.GET_TENT_ROLES.replace(
      ":tentUuid",
      tentUuid
    );
    return await axiosInstance.get(endpoint);
  },
};
