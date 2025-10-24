// hooks/useRouteGuard.ts
"use client";

import { useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "./useNavigation";

export const useRouteGuard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const {
    mainNavigation,
    footerNavigation,
    loading: menuLoading,
  } = useNavigation();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isPublicRoute = useMemo(
    () => ["/", "/login", "/register", "/forgot-password"].includes(pathname),
    [pathname]
  );

  useEffect(() => {
    if (authLoading || menuLoading) return;

    // 1️⃣ Public route — skip
    if (isPublicRoute) return;

    // 2️⃣ Not authenticated → redirect to login
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    // 3️⃣ Check route permission
    const allMenus = [...mainNavigation, ...footerNavigation];
    let hasAccess = false;

    for (const section of allMenus) {
      for (const item of section.items) {
        // Match direct route (e.g., "/dashboard" === pathname)
        if (item.url && pathname.startsWith(item.url)) {
          if (item.permissions?.read) hasAccess = true;
          break;
        }

        // Match subItem route (e.g., "/settings?tab=profile")
        if (item.subItems?.length) {
          for (const sub of item.subItems) {
            const subUrl = sub.url.split("?")[0]; // ignore query params
            if (pathname.startsWith(subUrl)) {
              if (sub.permissions?.read) hasAccess = true;
              break;
            }
          }
        }
      }
    }

    // 4️⃣ Redirect if no permission
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
