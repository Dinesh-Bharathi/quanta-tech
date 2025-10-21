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

import { loginUser, getSession, logoutUser } from "@/services/auth/api";
import { decryption } from "@/lib/encryption"; // optional if your API encrypts

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

  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ LOGIN
  const login = useCallback(
    async (credentials) => {
      const toastId = toast.loading("Logging in...");
      setLoading(true);

      try {
        const response = await loginUser(credentials);
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
      } finally {
        setLoading(false);
      }
    },
    [router, searchParams]
  );

  // ✅ FETCH SESSION
  const fetchSession = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getSession();
      const data = response.data?.data;
      // const data = decryption(response.data?.data); // if needed

      if (data) {
        setUser(data.user || null);
        setTentDetails(data.tent || null);
        setIsAuthenticated(true);
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
      await logoutUser();
      setUser(null);
      setUser(setTentDetails);
      setIsAuthenticated(false);
      toast.success("Logout successful", { id: toastId });
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed", { id: toastId });
    } finally {
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
