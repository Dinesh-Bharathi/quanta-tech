"use client";

import { API_ENDPOINTS } from "@/constants";
import axiosInstance from "../network";

export const loginUser = async (credentials) => {
  return await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
};

export const getSession = async () => {
  return await axiosInstance.get(API_ENDPOINTS.SESSION);
};

export const logoutUser = async () => {
  return await axiosInstance.post(API_ENDPOINTS.LOGOUT);
};
