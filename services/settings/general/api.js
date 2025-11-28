/* eslint-disable import/no-anonymous-default-export */

import { API_ENDPOINTS } from "@/constants";
import axiosInstance from "@/services/network/index";

export default {
  getTentDetails: async (tenantUuid) => {
    const endpoint = API_ENDPOINTS.GET_TENT_DETAILS.replace(
      ":tenantUuid",
      tenantUuid
    );
    return await axiosInstance.get(endpoint);
  },
};
