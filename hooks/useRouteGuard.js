// hooks/useRouteGuard.ts
"use client";

import { useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "./useNavigation";
import { PUBLIC_ROUTES } from "@/constants";

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
    () => [PUBLIC_ROUTES].includes(pathname),
    [pathname]
  );

  useEffect(() => {
    if (authLoading || menuLoading) return;

    if (isPublicRoute) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    const allMenus = [...mainNavigation, ...footerNavigation];
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
