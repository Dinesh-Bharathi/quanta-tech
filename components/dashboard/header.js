"use client";

import { Search, Palette, Command } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationDropdown } from "@/components/dashboard/notification-dropdown";
import {
  // getFeaturedThemes,
  applyThemeToDocument,
  loadThemePreference,
} from "@/lib/theme-utils";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useThemeCustomization } from "../theme-provider";
import { themePresets } from "@/lib/theme-presets";

export function DashboardHeader() {
  const { theme } = useTheme();

  const { layoutConfig, selectedTheme, changeTheme } = useThemeCustomization();
  const router = useRouter();

  const getHeaderHeight = () => {
    switch (layoutConfig.headerHeight) {
      case "compact":
        return "h-12";
      case "large":
        return "h-20";
      default:
        return "h-16";
    }
  };

  const getHeaderPadding = () => {
    switch (layoutConfig.headerHeight) {
      case "compact":
        return "px-3";
      case "large":
        return "px-6";
      default:
        return "px-4";
    }
  };

  const getSearchWidth = () => {
    switch (layoutConfig.headerHeight) {
      case "compact":
        return "w-[150px] lg:w-[250px]";
      case "large":
        return "w-[250px] lg:w-[400px]";
      default:
        return "w-[200px] lg:w-[300px]";
    }
  };

  return (
    <TooltipProvider>
      <header
        className={cn(
          "flex shrink-0 items-center gap-2 border-b",
          getHeaderHeight(),
          getHeaderPadding(),
          layoutConfig.stickyHeader &&
            "sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          layoutConfig.headerHeight === "large" && "gap-4"
        )}
      >
        {/* Sidebar Trigger - Only show if sidebar exists */}
        {layoutConfig.sidebarPosition !== "right" &&
          layoutConfig.sidebarBehavior !== "static" && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger className="-ml-1" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Sidebar (Ctrl+B)</p>
                </TooltipContent>
              </Tooltip>
              <div className="hidden items-center gap-2 sm:flex">
                <Command className="h-4 w-4" />
                <span className="hidden sm:inline text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border">
                  Ctrl+B
                </span>
              </div>
              <Separator orientation="vertical" className="mr-2 h-4" />
            </>
          )}

        {/* Breadcrumb */}
        {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}

        {/* Header Actions */}
        <div
          className={cn(
            "ml-auto flex items-center",
            layoutConfig.headerHeight === "compact" ? "space-x-2" : "space-x-4"
          )}
        >
          {/* Search - Hide on compact mode for mobile */}
          {/* <div
            className={cn(
              "relative",
              layoutConfig.headerHeight === "compact"
                ? "hidden lg:block"
                : "hidden md:block"
            )}
          >
            <Search
              className={cn(
                "absolute left-2 text-muted-foreground",
                layoutConfig.headerHeight === "compact"
                  ? "top-2 h-3 w-3"
                  : "top-2.5 h-4 w-4"
              )}
            />
            <Input
              placeholder="Search..."
              className={cn(
                "pl-8",
                getSearchWidth(),
                layoutConfig.headerHeight === "compact" && "h-8 text-sm"
              )}
            />
          </div> */}

          {/* Notifications */}
          <NotificationDropdown />

          {/* <div
            className={cn(
              "relative",
              layoutConfig.headerHeight === "compact"
                ? "hidden lg:block"
                : "hidden md:block"
            )}
          > */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Quick Theme Switch</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(themePresets).map(([themeId, preset]) => (
                <DropdownMenuItem
                  key={themeId}
                  onClick={() => changeTheme(themeId)}
                  className="flex items-center justify-between"
                >
                  <span>{preset.name}</span>
                  {selectedTheme === themeId && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/settings?tab=theme")}
              >
                <Palette className="mr-2 h-4 w-4" />
                All Themes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* </div> */}

          {/* Theme Toggle */}
          <ThemeToggle />

          {layoutConfig.sidebarPosition !== "left" &&
            layoutConfig.sidebarBehavior !== "static" && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <div className="hidden items-center gap-2 sm:flex">
                  <Command className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border">
                    Ctrl+B
                  </span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger className="-ml-1 rotate-180" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle Sidebar (Ctrl+B)</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
        </div>
      </header>
    </TooltipProvider>
  );
}

{
  /* Quick Theme Switcher */
}
{
  /* <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <Palette className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56">
    <DropdownMenuLabel>Quick Theme Switch</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {featuredThemes.map((preset) => (
      <DropdownMenuItem
        key={preset.id}
        onClick={() => handleThemeChange(preset.id)}
        className="flex items-center justify-between"
      >
        <span>{preset.name}</span>
        {currentThemeId === preset.id && (
          <div className="w-2 h-2 rounded-full bg-primary" />
        )}
      </DropdownMenuItem>
    ))}
    <DropdownMenuSeparator />
    <DropdownMenuItem
      onClick={() => router.push("/dashboard/settings?tab=theme")}
    >
      <Palette className="mr-2 h-4 w-4" />
      All Themes
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu> */
}
