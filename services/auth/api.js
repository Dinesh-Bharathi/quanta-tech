/* eslint-disable import/no-anonymous-default-export */

import { API_ENDPOINTS } from "@/constants";
import axiosInstance from "../network";

export default {
  loginUser: async (credentials) => {
    return await axiosInstance.post(API_ENDPOINTS.LOGIN_ONE, credentials);
  },
  loginTenantUser: async (credentials) => {
    return await axiosInstance.post(API_ENDPOINTS.LOGIN_TWO, credentials);
  },
  getTenantSelectionList: async () => {
    return await axiosInstance.get(API_ENDPOINTS.TENANT_SELECTION);
  },
  getSession: async () => {
    return await axiosInstance.get(API_ENDPOINTS.SESSION);
  },
  logoutUser: async () => {
    return await axiosInstance.post(API_ENDPOINTS.LOGOUT_SESSION);
  },
  logoutTenantUser: async () => {
    return await axiosInstance.post(API_ENDPOINTS.LOGOUT_TENANT);
  },
  getUserNavMenus: async (userUuid, branchUuid) => {
    const endpoint = API_ENDPOINTS.USER_NAV_MENUS.replace(
      ":userUuid",
      userUuid
    ).replace(":branchUuid", branchUuid);
    return await axiosInstance.get(endpoint);
  },
  signupUser: async (payload) => {
    return await axiosInstance.post(API_ENDPOINTS.SIGNUP, payload);
  },
  sendVerificationEmail: async (payload) => {
    return await axiosInstance.post(
      API_ENDPOINTS.SEND_VERIFICATION_EMAIL,
      payload
    );
  },
  resendVerificationEmail: async (payload) => {
    return await axiosInstance.post(
      API_ENDPOINTS.RESEND_VERIFICATION_EMAIL,
      payload
    );
  },
  registerTenant: async (userUuid, payload) => {
    const endpoint = API_ENDPOINTS.ONBOARDING_REGISTER.replace(
      ":userUuid",
      userUuid
    );
    return await axiosInstance.post(endpoint, payload);
  },
  getTenantsForEmail: async (payload) => {
    return await axiosInstance.post(
      API_ENDPOINTS.FORGOT_PASSWORD_TENANTS,
      payload
    );
  },
  sendPasswordResetForTenant: async (payload) => {
    return await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, payload);
  },
  verifyResetPassToken: async (params) => {
    return await axiosInstance.get(API_ENDPOINTS.VERIFY_FORGOT_PASSWORD, {
      params,
    });
  },
  resetPassword: async (payload) => {
    return await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, payload);
  },
};
