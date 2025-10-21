"use client";

import { API_ENDPOINTS } from "@/constants";
import axiosInstance from "@/services/network/index";

export const getTentDetails = async (tentUuid) => {
  const endpoint = API_ENDPOINTS.GET_TENT_DETAILS.replace(
    ":tentUuid",
    tentUuid
  );
  return await axiosInstance.get(endpoint);
};
