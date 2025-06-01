"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/services/network";
import { decryption } from "@/lib/encryption";
import Loading from "@/app/loading";
import { toast } from "sonner";

const AuthContext = createContext();

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/api/auth",
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tentDetails, setTentDetails] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOrg, setloadingOrg] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const login = async (credentials) => {
    const toastId = toast.loading("Logging in...");
    const redirectPath = searchParams.get("redirect") || "/dashboard";

    try {
      await axiosInstance.post("/api/auth/login", credentials);
      await getSession();
      toast.success("Login successful", { id: toastId });
      router.push(redirectPath);
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const getSession = async () => {
    try {
      const response = await axiosInstance.get("/api/auth/session");
      const successdata = decryption(response.data?.data);
      if (successdata) {
        setUser(successdata);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      return true;
    } catch (err) {
      const currentPath = window.location.pathname; // Works on client side only
      const redirectPath = searchParams.get("redirect") || "/dashboard";
      const target =
        err.response?.data?.redirect || `/login?redirect=${redirectPath}`;

      setUser(null);
      setIsAuthenticated(false);

      if (!PUBLIC_ROUTES.includes(currentPath)) {
        router.replace(target);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  const getTentDetails = useCallback(async () => {
    if (!user?.tentUuid) {
      setloadingOrg(false);
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/api/account/tent-details/${user.tentUuid}`
      );
      const successdata = decryption(response.data?.data);
      setTentDetails(successdata);
    } catch (err) {
      console.error("Failed to fetch tent details:", err);
      setTentDetails(null);
    } finally {
      setloadingOrg(false);
    }
  }, [user?.tentUuid]);

  useEffect(() => {
    getTentDetails();
  }, [getTentDetails]);

  const logout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await axiosInstance.post("/api/auth/logout");
      toast.success("Logout successful", { id: toastId });
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        user,
        isAuthenticated,
        loading,
        tentDetails,
        logout,
        setUser,
      }}
    >
      {!loading && !loadingOrg && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
