"use client";

import axios from "axios";

// Create an axios instance
const axiosInstance = axios.create();

// Add a request interceptor to set the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from cookies
    config.withCredentials = true;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle encrypted responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if (error.response && error.response.status === 401) {
    //   // Handle unauthorized access, e.g., redirect to login
    //   const redirectPath = window.location.pathname;
    //   window.location.href = `/login?redirect=${encodeURIComponent(
    //     redirectPath
    //   )}`;
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
