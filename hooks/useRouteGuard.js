// hooks/useRouteGuard.ts
"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const useRouteGuard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = [
      "/",
      "/login",
      "/register",
      "/forgot-password",
    ].includes(pathname);
    if (isPublicRoute) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    // const modules = user?.allowedModule || {};
    // const accessGranted =
    //   modules.mainNavigation?.[pathname] ||
    //   modules.footerNavigation?.[
    //     pathname + (searchParams?.toString() ? `?${searchParams}` : "")
    //   ];

    // if (!accessGranted) {
    //   router.replace("/unauthorized"); // or a custom 403 page
    // }
  }, [pathname, searchParams, isAuthenticated, loading]);
};
