"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthApi from "@/services/auth/api";
import { decryption } from "@/lib/encryption";

export function useNavigation() {
  const { user } = useAuth();
  const [mainNavigation, setMainNavigation] = useState([]);
  const [footerNavigation, setFooterNavigation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.user_uuid) {
      setLoading(false);
      return;
    }

    const fetchMenus = async () => {
      try {
        setLoading(true);
        const response = await AuthApi.getUserNavMenus(user?.user_uuid);
        const data = decryption(response.data?.data);

        if (data.success) {
          setMainNavigation(data.mainNavigation || []);
          setFooterNavigation(data.footerNavigation || []);
        }
      } catch (err) {
        console.error("Menu fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [user?.user_uuid]);

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
