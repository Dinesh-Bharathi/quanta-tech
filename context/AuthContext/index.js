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
  const [currentBranch, setCurrentBranch] = useState(null);
  const [branchesList, setBranchesList] = useState([]);
  const [permissions, setPermissions] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Helper: Get HQ branch from branches list
  const getHQBranch = useCallback((branches) => {
    return branches?.find((branch) => branch.is_hq) || branches?.[0] || null;
  }, []);

  // ✅ Helper: Get stored branch preference
  const getStoredBranchUuid = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selected_branch_uuid");
    }
    return null;
  }, []);

  // ✅ Helper: Store branch preference
  const storeBranchPreference = useCallback((branchUuid) => {
    if (typeof window !== "undefined" && branchUuid) {
      localStorage.setItem("selected_branch_uuid", branchUuid);
    }
  }, []);

  // ✅ Helper: Clear branch preference
  const clearBranchPreference = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("selected_branch_uuid");
    }
  }, []);

  // ✅ Helper: Check if user has tenant-wide access
  const hasTenantWideAccess = useCallback((userRoles) => {
    return userRoles?.some((role) => role.scope === "tenant") || false;
  }, []);

  // ✅ Helper: Get accessible branch UUIDs from roles
  const getAccessibleBranchUuids = useCallback((userRoles) => {
    const branchUuids = new Set();
    userRoles?.forEach((role) => {
      if (role.scope === "branch" && role.branch?.branch_uuid) {
        branchUuids.add(role.branch.branch_uuid);
      }
    });
    return Array.from(branchUuids);
  }, []);

  // ✅ SWITCH BRANCH
  const switchBranch = useCallback(
    (branchUuid) => {
      if (!branchesList || branchesList.length === 0) {
        toast.error("No branches available");
        return false;
      }

      // Find the branch in the list
      const branch = branchesList.find((b) => b.branch_uuid === branchUuid);

      if (!branch) {
        toast.error("Branch not found or not accessible");
        return false;
      }

      // Check if user has access to this branch
      const hasAccess =
        permissions?.has_tenant_wide_access ||
        getAccessibleBranchUuids(user?.roles).includes(branchUuid);

      if (!hasAccess) {
        toast.error("You don't have access to this branch");
        return false;
      }

      // Update current branch
      setCurrentBranch(branch);
      storeBranchPreference(branchUuid);
      toast.success(`Switched to ${branch.branch_name}`);
      return true;
    },
    [
      branchesList,
      permissions,
      user,
      getAccessibleBranchUuids,
      storeBranchPreference,
    ]
  );

  // ✅ GET USER ROLE FOR CURRENT BRANCH
  const getCurrentBranchRole = useCallback(() => {
    if (!user?.roles || !currentBranch) return null;

    // Check for tenant-wide role first
    const tenantWideRole = user.roles.find((role) => role.scope === "tenant");
    if (tenantWideRole) return tenantWideRole;

    // Check for branch-specific role
    const branchRole = user.roles.find(
      (role) =>
        role.scope === "branch" &&
        role.branch?.branch_uuid === currentBranch.branch_uuid
    );
    return branchRole || null;
  }, [user, currentBranch]);

  // ✅ CHECK IF USER CAN ACCESS BRANCH
  const canAccessBranch = useCallback(
    (branchUuid) => {
      if (!user?.roles) return false;
      if (permissions?.has_tenant_wide_access) return true;
      return getAccessibleBranchUuids(user.roles).includes(branchUuid);
    },
    [user, permissions, getAccessibleBranchUuids]
  );

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
        const errorMessage =
          err.response?.data?.message || "Invalid credentials";
        toast.error(errorMessage.replace(/tenant/gi, "Account"), {
          id: toastId,
        });
        return false;
      }
    },
    [router, searchParams]
  );

  // ✅ FETCH SESSION
  const fetchSession = useCallback(async () => {
    if (
      user === null ||
      tentDetails === null ||
      currentBranch === null ||
      permissions === null
    ) {
      setLoading(true);
    }
    try {
      const response = await AuthApi.getSession();
      const data = decryption(response.data?.data);

      if (data?.data) {
        const sessionData = data.data;

        // Set user data
        setUser(sessionData.user || null);
        setTentDetails(sessionData.tenant || null);
        setBranchesList(sessionData.branches || []);
        setPermissions(sessionData.permissions || null);
        setIsAuthenticated(true);

        // Determine current branch
        let selectedBranch = null;
        const branches = sessionData.branches || [];

        if (branches.length > 0) {
          // Try to restore previously selected branch
          const storedBranchUuid = getStoredBranchUuid();

          if (storedBranchUuid) {
            selectedBranch = branches.find(
              (b) => b.branch_uuid === storedBranchUuid
            );
          }

          // If no stored preference or branch not found, use HQ or first branch
          if (!selectedBranch) {
            selectedBranch = getHQBranch(branches);
            if (selectedBranch) {
              storeBranchPreference(selectedBranch.branch_uuid);
            }
          }
        }

        setCurrentBranch(selectedBranch);

        // Redirect if on public route
        const currentPath = window.location.pathname;
        if (PUBLIC_ROUTES.includes(currentPath)) {
          const redirectPath = searchParams.get("redirect") || "/dashboard";
          router.push(redirectPath);
        }
      } else {
        // Clear all state if no valid session
        setUser(null);
        setTentDetails(null);
        setBranchesList([]);
        setCurrentBranch(null);
        setPermissions(null);
        setIsAuthenticated(false);
        clearBranchPreference();
      }
    } catch (err) {
      console.error("Session fetch error:", err);

      // Clear all state on error
      setUser(null);
      setTentDetails(null);
      setBranchesList([]);
      setCurrentBranch(null);
      setPermissions(null);
      setIsAuthenticated(false);
      clearBranchPreference();

      // Redirect to login if on protected route
      const currentPath = window.location.pathname;
      if (!PUBLIC_ROUTES.includes(currentPath)) {
        const redirectPath = `/login?redirect=${currentPath}`;
        router.replace(redirectPath);
      }
    } finally {
      setLoading(false);
    }
  }, [
    router,
    searchParams,
    getStoredBranchUuid,
    getHQBranch,
    storeBranchPreference,
    clearBranchPreference,
  ]);

  // ✅ LOGOUT
  const logout = useCallback(async () => {
    const toastId = toast.loading("Logging out...");
    setLoading(true);

    try {
      await AuthApi.logoutUser();

      // Clear all state
      setUser(null);
      setTentDetails(null);
      setCurrentBranch(null);
      setBranchesList([]);
      setPermissions(null);
      setIsAuthenticated(false);
      clearBranchPreference();

      toast.success("Logout successful", { id: toastId });
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed", { id: toastId });
    } finally {
      router.push("/login");
      setLoading(false);
    }
  }, [router, clearBranchPreference]);

  // ✅ INIT SESSION ON MOUNT
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <AuthContext.Provider
      value={{
        // User & Auth State
        user,
        setUser,
        isAuthenticated,
        loading,

        // Tenant/Account State
        tentDetails,
        setTentDetails,

        // Branch State
        currentBranch,
        setCurrentBranch,
        branchesList,
        setBranchesList,

        // Permissions
        permissions,
        setPermissions,

        // Branch Functions
        switchBranch,
        getCurrentBranchRole,
        canAccessBranch,
        hasTenantWideAccess: permissions?.has_tenant_wide_access || false,

        // Auth Functions
        login,
        logout,
        fetchSession,

        // Legacy compatibility (for existing code)
        currentBranch, // Alias for backward compatibility
        setCurrentBranch, // Alias for backward compatibility
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
