// hooks/useRouteGuard.ts
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "./useNavigation";
import { PUBLIC_ROUTES } from "@/constants";

export const useRouteGuard = () => {
  const prevBranch = useRef(null);
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    currentBranch,
  } = useAuth();
  const {
    mainNavigation,
    footerNavigation,
    loading: menuLoading,
  } = useNavigation();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isPublicRoute = useMemo(
    () => [PUBLIC_ROUTES].includes(pathname),
    [pathname]
  );

  function getFirstAccessibleRoute(navigation = []) {
    for (const section of navigation) {
      for (const item of section.items) {
        if (item.permissions?.read && item.url) return item.url;

        if (item.subItems?.length) {
          const sub = item.subItems.find((s) => s.permissions?.read && s.url);
          if (sub) return sub.url;
        }
      }
    }

    return null;
  }

  function hasReadPermission(navigation = [], pathname = "") {
    if (!Array.isArray(navigation) || navigation.length === 0) return false;
    if (!pathname) return false;

    for (const section of navigation) {
      for (const item of section.items || []) {
        // Check sub items
        if (item.subItems?.length) {
          for (const sub of item.subItems) {
            const subUrl = sub.url?.split("?")[0]; // Remove query params

            // Allow dynamic nested routes (e.g. /users/123/edit)
            if (pathname.startsWith(subUrl)) {
              return sub.permissions?.read === true;
            }
          }
        }

        // Check main item
        if (item.url) {
          const itemUrl = item.url.split("?")[0];

          if (pathname === itemUrl) {
            return item.permissions?.read === true;
          }
        }
      }
    }

    // No match = no permission
    return false;
  }

  useEffect(() => {
    const allMenus = [...mainNavigation, ...footerNavigation];

    if (authLoading || menuLoading) return;

    const branchChanged =
      prevBranch.current && prevBranch.current !== currentBranch?.branch_uuid;

    prevBranch.current = currentBranch?.branch_uuid;

    if (isPublicRoute) return;

    // ----------- 🚀 Branch Switch Permission Redirect -----------
    if (branchChanged) {
      const allowed = hasReadPermission(allMenus, pathname);

      if (!allowed) {
        const fallback = getFirstAccessibleRoute(allMenus);
        if (fallback) {
          return router.replace(fallback);
        }
      }
    }

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    let hasAccess = false;

    for (const section of allMenus) {
      for (const item of section.items) {
        if (item.subItems?.length) {
          for (const sub of item.subItems) {
            const subUrl = sub.url.split("?")[0];
            if (pathname.startsWith(subUrl)) {
              if (sub.permissions?.read) hasAccess = true;
              break;
            }
          }
        }

        if (hasAccess) break;

        if (item.url && pathname === item.url) {
          if (item.permissions?.read) hasAccess = true;
          break;
        }
      }
      if (hasAccess) break;
    }

    if (!hasAccess) {
      router.replace("/unauthorized");
    }
  }, [
    isAuthenticated,
    authLoading,
    pathname,
    menuLoading,
    router,
    mainNavigation,
    footerNavigation,
    isPublicRoute,
  ]);
};
