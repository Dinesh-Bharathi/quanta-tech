"use client";

import axios from "axios";

// Create an axios instance with base URL from .env
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., "http://localhost:8080/api"
  withCredentials: true, // ensures cookies are sent automatically
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Optionally handle tokens or headers here
    // Example: if you use Bearer tokens in localStorage or cookies
    // const token = getCookie("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized access
    // if (error.response?.status === 401) {
    //   const redirectPath = window.location.pathname;
    //   window.location.href = `/login?redirect=${encodeURIComponent(redirectPath)}`;
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;
