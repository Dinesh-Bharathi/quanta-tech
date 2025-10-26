"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import AuthApi from "@/services/auth/api";
import { decryption, encryption } from "@/lib/encryption";
import { PUBLIC_ROUTES } from "@/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tentDetails, setTentDetails] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ LOGIN
  const login = useCallback(
    async (credentials) => {
      const toastId = toast.loading("Logging in...");

      try {
        const body = encryption(credentials);
        const response = await AuthApi.loginUser({ data: body });
        if (response.status === 200) {
          await fetchSession(); // get user info post-login
          toast.success("Login successful", { id: toastId });

          const redirectPath = searchParams.get("redirect") || "/dashboard";
          router.push(redirectPath);
          return true;
        }
        toast.error("Login failed", { id: toastId });
        return false;
      } catch (err) {
        console.error("Login error:", err);
        toast.error(err.response?.data?.message || "Invalid credentials", {
          id: toastId,
        });
        return false;
      }
    },
    [router, searchParams]
  );

  // ✅ FETCH SESSION
  const fetchSession = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AuthApi.getSession();
      const data = decryption(response.data?.data);

      if (data) {
        setUser(data.data.user || null);
        setTentDetails(data.data.tent || null);
        setIsAuthenticated(true);
        const currentPath = window.location.pathname;
        if (PUBLIC_ROUTES.includes(currentPath)) {
          const redirectPath = searchParams.get("redirect") || "/dashboard";
          router.push(redirectPath);
        }
      } else {
        setUser(null);
        setTentDetails(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Session fetch error:", err);
      setUser(null);
      setTentDetails(null);
      setIsAuthenticated(false);

      const currentPath = window.location.pathname;
      if (!PUBLIC_ROUTES.includes(currentPath)) {
        const redirectPath = `/login?redirect=${currentPath}`;
        router.replace(redirectPath);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ✅ LOGOUT
  const logout = useCallback(async () => {
    const toastId = toast.loading("Logging out...");
    setLoading(true);

    try {
      await AuthApi.logoutUser();
      setUser(null);
      setTentDetails(null);
      setIsAuthenticated(false);
      toast.success("Logout successful", { id: toastId });
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed", { id: toastId });
    } finally {
      router.push("/login");
      setLoading(false);
    }
  }, [router]);

  // ✅ INIT SESSION ON MOUNT
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        tentDetails,
        setTentDetails,
        isAuthenticated,
        loading,
        login,
        logout,
        fetchSession,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
