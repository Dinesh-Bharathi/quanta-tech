"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthApi from "@/services/auth/api";
import { decryption } from "@/lib/encryption";

export function useNavigation() {
  const { user, currentBranch } = useAuth();
  const [mainNavigation, setMainNavigation] = useState([]);
  const [footerNavigation, setFooterNavigation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenus = useCallback(async () => {
    // Prevent fetch when either user or branch is missing
    if (!user?.user_uuid || !currentBranch?.branch_uuid) {
      setMainNavigation([]);
      setFooterNavigation([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await AuthApi.getUserNavMenus(
        user.user_uuid,
        currentBranch.branch_uuid
      );

      const data = decryption(response.data?.data);

      if (data?.success) {
        setMainNavigation(data.data?.mainNavigation || []);
        setFooterNavigation(data.data?.footerNavigation || []);
      } else {
        setMainNavigation([]);
        setFooterNavigation([]);
      }
    } catch (err) {
      console.error("Menu fetch error:", err);
      setError(err.message || "Failed to load menus");
    } finally {
      setLoading(false);
    }
  }, [user?.user_uuid, currentBranch?.branch_uuid]);

  // Trigger fetch whenever user or branch changes
  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return {
    mainNavigation,
    footerNavigation,
    loading,
    error,
  };
}

export function getFirstAccessibleSubItem(navigation = [], menuTitle = "") {
  if (!Array.isArray(navigation) || navigation.length === 0) return null;

  const menuItem = navigation
    .flatMap((section) => section.items)
    .find((item) => item.title.toLowerCase() === menuTitle.toLowerCase());

  if (!menuItem?.subItems?.length) return null;

  const accessibleSubItem = menuItem.subItems.find(
    (sub) => sub.permissions?.read
  );

  return accessibleSubItem || null;
}
