"use client";

import { createContext, useContext } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthApi from "@/services/auth/api";
import { decryption } from "@/lib/encryption";
import { useQuery } from "@tanstack/react-query";

const NavigationContext = createContext(null);
export const useNavigation = () => useContext(NavigationContext);

export function NavigationProvider({ children }) {
  const { user, currentBranch } = useAuth();

  const enabled = Boolean(user?.tenant_user_uuid && currentBranch?.branch_uuid);

  const { data, isLoading, error } = useQuery({
    queryKey: ["nav-menus", user?.tenant_user_uuid, currentBranch?.branch_uuid],
    queryFn: async () => {
      const response = await AuthApi.getUserNavMenus(
        user.tenant_user_uuid,
        currentBranch.branch_uuid
      );
      const decrypted = decryption(response.data?.data);
      if (!decrypted?.success) return { main: [], footer: [] };
      return {
        main: decrypted.data?.mainNavigation ?? [],
        footer: decrypted.data?.footerNavigation ?? [],
      };
    },
    enabled, // ✅ Runs only when user + branch exist
    staleTime: 1000 * 60 * 30, // 30 min cache
    gcTime: 1000 * 60 * 60, // 1 hour garbage collection
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <NavigationContext.Provider
      value={{
        mainNavigation: data?.main ?? [],
        footerNavigation: data?.footer ?? [],
        loading: isLoading,
        error: error?.message ?? null,
        allMenus: (data?.main ?? []).concat(data?.footer ?? []), // ✅ no new array every render
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
