"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Building2,
  LifeBuoy,
  LogOut,
  Send,
  Shield,
  Settings,
  MoreHorizontal,
  Palette,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuButton,
  SidebarMenuSubButton,
  SidebarMenuAction,
  SidebarRail,
} from "@/components/ui/sidebar";

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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useThemeCustomization } from "../theme-provider";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

import { mainNavigation, footerNavigation } from "@/lib/navigation";

export function DashboardSidebar({
  tentDetails,
  user,
  isOffcanvas = false,
  isStatic = false,
  isCollapseOffcanvas = false,
}) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { layoutConfig } = useThemeCustomization();
  const [expandedItems, setExpandedItems] = useState(new Set());

  // const hasAccess = (url, section) => user?.allowedModule?.[section]?.[url];
  const hasAccess = (url, section) => true;

  const toggleExpanded = (title) => {
    const newExpanded = new Set(expandedItems);
    newExpanded.has(title) ? newExpanded.delete(title) : newExpanded.add(title);
    setExpandedItems(newExpanded);
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "??";
  };

  const getSidebarVariant = () => {
    if (isOffcanvas || isCollapseOffcanvas) return "floating";
    if (isStatic) return "sidebar";
    return "inset";
  };

  const getSidebarCollapsible = () => {
    if (isOffcanvas && !isCollapseOffcanvas) return "offcanvas";
    if (isStatic && isCollapseOffcanvas) return "none";
    return "icon";
  };

  return (
    <TooltipProvider>
      <Sidebar
        variant={getSidebarVariant()}
        collapsible={getSidebarCollapsible()}
        side={layoutConfig.sidebarPosition}
        className={cn(
          isOffcanvas && "z-50",
          isStatic && [
            "h-screen",
            "sticky",
            "top-0",
            "overflow-y-auto",
            "flex-shrink-0",
          ]
        )}
      >
        {/* Header */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">
                    {tentDetails?.tent_name}
                  </span>
                  <span className="text-xs">
                    {tentDetails?.subscription_plan || "Enterprise Plan"}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Main Navigation */}
        <SidebarContent className={cn(isStatic && "flex-1 overflow-y-auto")}>
          {mainNavigation.map((section) => {
            const filteredItems = section.items
              .map((item) => {
                if (item.subItems) {
                  const filteredSub = item.subItems.filter((sub) =>
                    hasAccess(sub.url, "mainNavigation")
                  );
                  if (
                    hasAccess(item.url, "mainNavigation") ||
                    filteredSub.length > 0
                  ) {
                    return { ...item, subItems: filteredSub };
                  }
                  return null;
                }
                return hasAccess(item.url, "mainNavigation") ? item : null;
              })
              .filter(Boolean);

            if (filteredItems.length === 0) return null;

            return (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {filteredItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        {item.subItems ? (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  onClick={() => toggleExpanded(item.title)}
                                  className="w-full justify-between"
                                >
                                  <div className="flex items-center">
                                    <item.icon className="mr-2 h-4 w-4" />
                                    <span>{item.title}</span>
                                  </div>
                                  <ChevronDown
                                    className={`h-4 w-4 transition-transform ${
                                      expandedItems.has(item.title)
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              <TooltipContent
                                side={
                                  layoutConfig.sidebarPosition === "right"
                                    ? "left"
                                    : "right"
                                }
                              >
                                <p>{item.title}</p>
                              </TooltipContent>
                            </Tooltip>
                            {expandedItems.has(item.title) && (
                              <SidebarMenuSub>
                                {item.subItems.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={pathname === subItem.url}
                                    >
                                      <Link href={subItem.url}>
                                        {subItem.title}
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            )}
                          </>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                asChild
                                isActive={pathname === item.url}
                              >
                                <Link href={item.url}>
                                  <item.icon className="mr-2 h-4 w-4" />
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent
                              side={
                                layoutConfig.sidebarPosition === "right"
                                  ? "left"
                                  : "right"
                              }
                            >
                              <p>{item.title}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </SidebarContent>

        {/* Footer Navigation + User Dropdown */}
        <SidebarFooter>
          <SidebarMenu>
            {footerNavigation.map((item) => {
              const permittedSubItems = item.subItems?.filter((subItem) =>
                hasAccess(subItem.url, "footerNavigation")
              );

              const isMainItemAllowed =
                hasAccess(item.url, "footerNavigation") ||
                permittedSubItems.length > 0;

              if (!isMainItemAllowed) return null;

              const targetUrl = hasAccess(item.url, "footerNavigation")
                ? item.url
                : permittedSubItems[0]?.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith(item.url)}
                        className="mb-1"
                      >
                        <Link href={targetUrl}>
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent
                      side={
                        layoutConfig.sidebarPosition === "right"
                          ? "left"
                          : "right"
                      }
                    >
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>

                  {permittedSubItems.length > 0 && (
                    <DropdownMenu side="right" align="start">
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        {permittedSubItems.map((subItem) => (
                          <DropdownMenuItem asChild key={subItem.title}>
                            <Link
                              href={subItem.url}
                              className="flex items-center gap-2"
                            >
                              <subItem.icon className="w-4 h-4" />
                              <span>{subItem.title}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </SidebarMenuItem>
              );
            })}

            {/* Profile Dropdown */}
            <SidebarMenuItem>
              <DropdownMenu>
                <Tooltip>
                  <DropdownMenuTrigger asChild>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={user?.profile || "/placeholder-user.jpg"}
                            alt="User"
                          />
                          <AvatarFallback className="rounded-lg">
                            {getInitials(user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user?.name || "Unknown User"}
                          </span>
                          <span className="truncate text-xs">
                            {user?.email || "abc@mail.com"}
                          </span>
                        </div>
                        <ChevronDown className="ml-auto size-4" />
                      </SidebarMenuButton>
                    </TooltipTrigger>
                  </DropdownMenuTrigger>
                  <TooltipContent
                    side={
                      layoutConfig.sidebarPosition === "right"
                        ? "left"
                        : "right"
                    }
                  >
                    <div className="text-sm">
                      <div className="font-semibold">
                        {user?.name || "Unknown User"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user?.email || "abc@mail.com"}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={
                    layoutConfig.sidebarPosition === "right" ? "left" : "right"
                  }
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuItem asChild>
                    <Link href="/settings?tab=profile">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src="/placeholder-user.jpg" alt="User" />
                          <AvatarFallback className="rounded-lg">
                            {getInitials(user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user?.name || "Unknown User"}
                          </span>
                          <span className="truncate text-xs">
                            {user?.email || "abc@mail.com"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Send className="mr-2 h-4 w-4" />
                    Feedback
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    Security
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}
