"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/controls/menu/${user?.user_uuid}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch menus");
        }

        const data = await response.json();

        if (data.success) {
          setMainNavigation(data.mainNavigation || []);
          setFooterNavigation(data.footerNavigation || []);
        }
      } catch (err) {
        console.error("Menu fetch error:", err);
        setError(err.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 5000);
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
