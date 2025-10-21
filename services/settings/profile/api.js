"use client";

import { API_ENDPOINTS } from "@/constants";
import axiosInstance from "@/services/network/index";

export const getProfile = async (userUuid) => {
  const endpoint = API_ENDPOINTS.GET_PROFILE.replace(":userUuid", userUuid);
  return await axiosInstance.get(endpoint);
};

export const updateProfile = async (data, userUuid) => {
  const endpoint = API_ENDPOINTS.UPDATE_PROFILE.replace(":userUuid", userUuid);
  return await axiosInstance.put(endpoint, data);
};

export const changePassword = async (data) => {
  const endpoint = API_ENDPOINTS.UPDATE_PASSWORD;
  return await axiosInstance.post(endpoint, data);
};
