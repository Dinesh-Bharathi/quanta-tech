"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { themePresets } from "@/lib/theme-presets";
import {
  applyThemeToDocument,
  loadThemePreference,
  saveThemePreference,
} from "@/lib/theme-utils";
import { toast } from "sonner";
import { Palette } from "lucide-react";

const ThemeCustomizationContext = createContext({});

const defaultLayoutConfig = {
  stickyHeader: false,
  sidebarPosition: "left", // "left" | "right" | "none"
  sidebarBehavior: "collapsible", // "collapsible" | "offcanvas" | "static"
  sidebarCollapsed: false,
  headerHeight: "default", // "compact" | "default" | "large"
  footerVisible: true,
  contentMaxWidth: "full", // "full" | "container" | "narrow"
  spacing: "default", // "compact" | "default" | "spacious"
};

export function ThemeCustomizationProvider({ children }) {
  const [selectedTheme, setSelectedTheme] = useState("candyLand");
  const { theme: mode, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [layoutConfig, setLayoutConfig] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("layout-config");
      return saved ? JSON.parse(saved) : defaultLayoutConfig;
    }
    return defaultLayoutConfig;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("layout-config", JSON.stringify(layoutConfig));
    }
  }, [layoutConfig]);

  useEffect(() => {
    setMounted(true);
    const savedTheme = loadThemePreference();
    setSelectedTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (mounted && selectedTheme && resolvedTheme) {
      const themeConfig = themePresets[selectedTheme];
      if (themeConfig) {
        applyThemeToDocument(themeConfig, resolvedTheme);
      }
    }
  }, [selectedTheme, resolvedTheme, mounted]);

  const changeTheme = (themeId) => {
    setSelectedTheme(themeId);
    saveThemePreference(themeId);

    const themeConfig = themePresets[themeId];
    if (themeConfig && mounted && resolvedTheme) {
      applyThemeToDocument(themeConfig, resolvedTheme);
      if (themeId === "default") {
        toast.success("Theme reset to Default", {
          icon: <Palette className="w-5 h-5 " />,
          description: "Your theme has been reset to the default settings.",
        });
      } else {
        toast.success(`Theme changed to ${themeConfig?.name}`, {
          icon: <Palette className="w-5 h-5 " />,
          description: "Your theme has been updated.",
        });
      }
    }
  };

  const resetToDefault = () => {
    changeTheme("default");
    setTheme("system");
    setLayoutConfig(defaultLayoutConfig);
  };

  const value = {
    selectedTheme,
    changeTheme,
    availableThemes: Object.keys(themePresets),
    currentThemeConfig: themePresets[selectedTheme],
    layoutConfig,
    setLayoutConfig,
    resetToDefault,
  };

  if (!mounted) {
    return (
      <div
        className="min-h-screen bg-background text-foreground"
        style={{
          backgroundColor: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
        }}
      >
        {/* Simple loading state that matches theme immediately */}
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <ThemeCustomizationContext.Provider value={value}>
      {children}
    </ThemeCustomizationContext.Provider>
  );
}

export const useThemeCustomization = () => {
  const context = useContext(ThemeCustomizationContext);
  if (!context) {
    throw new Error(
      "useThemeCustomization must be used within ThemeCustomizationProvider"
    );
  }
  return context;
};
