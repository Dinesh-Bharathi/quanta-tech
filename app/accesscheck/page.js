"use client";

import { useFilteredNavigation } from "@/hooks/useFilteredNavigation";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccessCheck() {
  const router = useRouter();
  const { firstAccessibleUrl } = useFilteredNavigation();

  useEffect(() => {
    if (firstAccessibleUrl) {
      router.push(firstAccessibleUrl);
    }
    console.log("firstAccessibleUrl", firstAccessibleUrl);
  }, [firstAccessibleUrl]);

  return <Loading />;
}
