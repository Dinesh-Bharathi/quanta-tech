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
import { encryption } from "@/lib/encryption";
import { errorResponse, successResponse } from "@/lib/response";
import { PUBLIC_ROUTES } from "@/constants";
import Loading from "@/app/loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tentDetails, setTentDetails] = useState(null);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [branchesList, setBranchesList] = useState([]);
  const [permissions, setPermissions] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [isAccountSuspended, setIsAccountSuspended] = useState(true);
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

  // ✅ LOGIN (Step 1: Email/Password)
  const login = useCallback(async (credentials) => {
    try {
      const body = encryption(credentials);
      const response = await AuthApi.loginUser({ data: body });
      const data = successResponse(response, true);

      if (response.status === 200) {
        if (!data?.data) {
          toast.error(data?.message || "Invalid response from server");
          return false;
        }

        const { tenants, global_session_uuid } = data.data;

        // Case 1: Multiple tenants - return data for selection
        if (tenants && tenants.length > 1) {
          // return {
          //   tenants,
          //   global_session_uuid,
          // };
          const redirectPath = searchParams.get("redirect");
          if (redirectPath) {
            router.replace(`/tenant-select?redirect=${redirectPath}`);
          } else {
            router.push(`/tenant-select`);
          }
          return true;
        }

        // Case 2: Single tenant - auto login
        if (tenants && tenants.length === 1) {
          const success = await loginToTenant({
            tenant_user_uuid: tenants[0].tenant_user_uuid,
          });
          return success;
        }

        // Case 3: No tenants
        toast.error(data?.message || "No accounts found for this user");
        return false;
      }

      toast.error(
        data?.message || "Login failed. Please check your credentials."
      );
      return false;
    } catch (err) {
      const error = errorResponse(err, true);
      toast.error(error?.message || "Please try again");
      console.error("Login error", error);
      return false;
    }
  }, []);

  // ✅ LOGIN TO TENANT (Step 2: Tenant Selection)
  const loginToTenant = useCallback(async (body) => {
    const toastId = toast.loading("Logging in to account...");

    try {
      const encryptedBody = encryption(body);
      const response = await AuthApi.loginTenantUser({ data: encryptedBody });
      const data = successResponse(response, true);

      if (response.status === 200) {
        // Fetch session after successful tenant login

        const redirectPath = searchParams.get("redirect");
        if (redirectPath) {
          router.replace(`/accesscheck?redirect=${redirectPath}`);
        } else {
          router.replace("/accesscheck");
        }
        toast.success(data?.message || "Login successful", { id: toastId });
        fetchSession();
        return true;
      }

      toast.error(data?.message || "Failed to login to account", {
        id: toastId,
      });
      return false;
    } catch (err) {
      const error = errorResponse(err, true);
      toast.error(error?.message || "Please try again");
      console.error("Tenant login error:", error);
      return false;
    }
  }, []);

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
      const data = successResponse(response, true);

      if (data?.data) {
        const sessionData = data.data;

        // Set user data
        setUser(sessionData.user || null);
        setTentDetails(sessionData.tenant || null);
        setBranchesList(sessionData.branches || []);
        setPermissions(sessionData.permissions || null);
        setIsAuthenticated(true);
        setSubscriptionDetails(sessionData?.subscription || null);

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
          const redirectPath = searchParams.get("redirect") || "/accesscheck";
          router.replace(redirectPath);
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
      if (err?.response?.data?.message) {
        const currentPath = window.location.pathname;
        if (!PUBLIC_ROUTES.includes(currentPath)) {
          toast.error(err.response.data.message);
        }
      }
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
      setTimeout(() => {
        setLoading(false);
      }, 500);
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
  const logoutTenant = useCallback(async () => {
    const toastId = toast.loading("Logging out...");
    setLoading(true);

    try {
      await AuthApi.logoutTenantUser();

      // Clear all state
      setUser(null);
      setTentDetails(null);
      setCurrentBranch(null);
      setBranchesList([]);
      setPermissions(null);
      setIsAuthenticated(false);
      clearBranchPreference();
      setSubscriptionDetails(null);

      toast.success("Logout successful", { id: toastId });
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed", { id: toastId });
    } finally {
      router.push("/tenant-select");
      setLoading(false);
    }
  }, [router, clearBranchPreference]);

  const logoutUser = useCallback(async () => {
    const toastId = toast.loading("Logging out session...");
    setLoading(true);

    try {
      await AuthApi.logoutUser();

      toast.success("Session Logout successful", { id: toastId });
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Session Logout failed", { id: toastId });
    } finally {
      router.replace("/login");
      setLoading(false);
    }
  }, [router]);

  // ✅ INIT SESSION ON MOUNT
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (!subscriptionDetails) return setIsAccountSuspended(false);

    const calculateDaysRemaining = () => {
      const now = new Date();
      const endDate = new Date(subscriptionDetails.end_date);
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Determine status based on days remaining
      if (diffDays <= -3) {
        // Day 4 onwards after expiry - Account Suspended
        setIsAccountSuspended(true);
      } else {
        setIsAccountSuspended(false);
      }
    };

    calculateDaysRemaining();
    const interval = setInterval(calculateDaysRemaining, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [subscriptionDetails]);

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
        loginToTenant,
        logoutUser,
        logoutTenant,
        fetchSession,

        // Subscription
        subscriptionDetails,
        isAccountSuspended,
      }}
    >
      {loading ? <Loading /> : <>{children}</>}
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
