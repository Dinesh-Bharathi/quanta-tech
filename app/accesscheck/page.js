"use client";

import { useFilteredNavigation } from "@/hooks/useFilteredNavigation";
import Loading from "../loading";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { PUBLIC_ROUTES } from "@/constants";

export default function AccessCheck() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { firstAccessibleUrl } = useFilteredNavigation();

  useEffect(() => {
    const redirectPath = searchParams.get("redirect");
    if (redirectPath && !PUBLIC_ROUTES.includes(redirectPath)) {
      router.replace(redirectPath);
    } else if (firstAccessibleUrl) {
      router.replace(firstAccessibleUrl);
    }
    console.log("firstAccessibleUrl", firstAccessibleUrl);
  }, [firstAccessibleUrl, router, searchParams]);

  return <Loading />;
}
