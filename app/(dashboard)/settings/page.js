"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useNavigation,
  getFirstAccessibleSubItem,
} from "@/hooks/useNavigation";
import Loading from "@/app/(dashboard)/loading";

export default function SettingsPage() {
  const router = useRouter();
  const { footerNavigation, loading } = useNavigation();

  useEffect(() => {
    if (loading) return;
    if (!footerNavigation?.length) return;

    const firstSubItem = getFirstAccessibleSubItem(
      footerNavigation,
      "Settings"
    );

    if (firstSubItem?.url) {
      router.replace(firstSubItem.url);
    }
  }, [footerNavigation, loading, router]);

  return <Loading />;
}
