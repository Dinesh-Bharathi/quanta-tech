/* eslint-disable import/no-anonymous-default-export */

import { API_ENDPOINTS } from "@/constants";
import axiosInstance from "../network";

export default {
  loginUser: async (credentials) => {
    return await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
  },
  getSession: async () => {
    return await axiosInstance.get(API_ENDPOINTS.SESSION);
  },
  logoutUser: async () => {
    return await axiosInstance.post(API_ENDPOINTS.LOGOUT);
  },
  getUserNavMenus: async (userUuid, branchUuid) => {
    const endpoint = API_ENDPOINTS.USER_NAV_MENUS.replace(
      ":userUuid",
      userUuid
    ).replace(":branchUuid", branchUuid);
    return await axiosInstance.get(endpoint);
  },
};
