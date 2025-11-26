"use client";

import { useState, useMemo } from "react";
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
  useSidebar,
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
import { getIconComponent } from "@/lib/iconMapper";
import { SidebarSkeleton } from "../dashboard/sidebarSkeleton";
import { BranchSwitcher } from "../dashboard/branchSwitcher";
import { useSidebarNavigation } from "@/hooks/useFilteredNavigation";

const isRouteActive = (itemUrl, currentPath) => {
  if (!itemUrl) return false;

  if (itemUrl === "/dashboard") {
    return currentPath === itemUrl;
  }

  return currentPath.startsWith(itemUrl);
};

/**
 * Check if user has any permission for an item (read, add, update, or delete)
 */
const hasAnyPermission = (permissions) => {
  if (!permissions) return false;
  return (
    permissions.read ||
    permissions.add ||
    permissions.update ||
    permissions.delete
  );
};

/**
 * Filter navigation items based on permissions
 * Only show items where user has at least read permission
 */
const filterNavigationByPermissions = (navigation) => {
  if (!Array.isArray(navigation)) return [];

  return navigation
    .map((section) => {
      const filteredItems = section.items
        .map((item) => {
          // Filter subitems first
          const filteredSubItems = item.subItems
            ? item.subItems.filter(
                (subItem) => subItem.permissions?.read === true
              )
            : [];

          // If item has subitems, show parent if any subitem is accessible
          if (item.subItems && item.subItems.length > 0) {
            // Only keep parent if it has accessible subitems
            if (filteredSubItems.length > 0) {
              return {
                ...item,
                subItems: filteredSubItems,
              };
            }
            return null;
          }

          // For items without subitems, check their own permissions
          if (item.permissions?.read === true) {
            return item;
          }

          return null;
        })
        .filter(Boolean); // Remove null items

      // Only include section if it has items
      if (filteredItems.length > 0) {
        return {
          ...section,
          items: filteredItems,
        };
      }

      return null;
    })
    .filter(Boolean); // Remove null sections
};

export function DashboardSidebar({
  user,
  isOffcanvas = false,
  isStatic = false,
  isCollapseOffcanvas = false,
}) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { layoutConfig } = useThemeCustomization();
  const { mainNavigation, footerNavigation, loading, isEmpty } =
    useSidebarNavigation();
  const [expandedItems, setExpandedItems] = useState(new Set());
  const { setOpenMobile, isMobile, open } = useSidebar();

  // Filter navigation based on permissions
  const filteredMainNavigation = useMemo(
    () => filterNavigationByPermissions(mainNavigation),
    [mainNavigation]
  );

  const filteredFooterNavigation = useMemo(
    () => filterNavigationByPermissions(footerNavigation),
    [footerNavigation]
  );

  const toggleExpanded = (title) => {
    const newExpanded = new Set(expandedItems);
    newExpanded.has(title) ? newExpanded.delete(title) : newExpanded.add(title);
    setExpandedItems(newExpanded);
  };

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
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

  if (loading) {
    return (
      <SidebarSkeleton
        variant={getSidebarVariant()}
        collapsible={getSidebarCollapsible()}
        position={layoutConfig.sidebarPosition}
        isStatic={isStatic}
        isOffcanvas={isOffcanvas}
      />
    );
  }

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
          ],
          "overflow-x-hidden"
        )}
      >
        {/* Header */}
        <SidebarHeader>
          <BranchSwitcher sidebarOpen={open} />
        </SidebarHeader>

        {/* Main Navigation - Filtered by Permissions */}
        <SidebarContent className={cn(isStatic && "flex-1 overflow-y-auto")}>
          {filteredMainNavigation.length === 0 ? (
            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
              No accessible modules
            </div>
          ) : (
            filteredMainNavigation.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => {
                      const hasSubItems =
                        item.subItems && item.subItems.length > 0;
                      const IconComponent = getIconComponent(item.icon);

                      const isParentActive = hasSubItems
                        ? item.subItems.some((subItem) =>
                            isRouteActive(subItem.url, pathname)
                          )
                        : false;

                      return (
                        <SidebarMenuItem key={item.title}>
                          {hasSubItems ? (
                            <>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <SidebarMenuButton
                                    onClick={() => toggleExpanded(item.title)}
                                    className="w-full justify-between rounded-lg"
                                    isActive={isParentActive}
                                  >
                                    <div className="flex items-center">
                                      {IconComponent && (
                                        <IconComponent className="mr-2 h-4 w-4" />
                                      )}
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
                                  side={isMobile ? "bottom" : "right"}
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
                                        isActive={isRouteActive(
                                          subItem.url,
                                          pathname
                                        )}
                                        onClick={handleNavClick}
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
                                  className="rounded-lg"
                                  asChild
                                  isActive={isRouteActive(item.url, pathname)}
                                  onClick={handleNavClick}
                                >
                                  <Link href={item.url}>
                                    {IconComponent && (
                                      <IconComponent className="mr-2 h-4 w-4" />
                                    )}
                                    <span>{item.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              <TooltipContent
                                side={isMobile ? "bottom" : "right"}
                              >
                                <p>{item.title}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          )}
        </SidebarContent>

        {/* Footer Navigation + User Dropdown - Filtered by Permissions */}
        <SidebarFooter>
          <SidebarMenu>
            {filteredFooterNavigation.map((section) => (
              <div key={section.title}>
                {section.items.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const IconComponent = getIconComponent(item.icon);
                  const targetUrl =
                    item.url || (hasSubItems ? item.subItems[0].url : "#");

                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={pathname.startsWith(item.url)}
                            className="mb-1 rounded-lg"
                            onClick={handleNavClick}
                          >
                            <Link href={targetUrl}>
                              {IconComponent && (
                                <IconComponent className="mr-2 h-4 w-4" />
                              )}
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side={isMobile ? "top" : "right"}>
                          <p>{item.title}</p>
                        </TooltipContent>
                      </Tooltip>

                      {hasSubItems && (
                        <DropdownMenu
                          side={isMobile ? "bottom" : "right"}
                          align="start"
                        >
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction className="rounded-lg">
                              <MoreHorizontal />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side={isMobile ? "top" : "right"}
                            align="start"
                            className="rounded-lg"
                          >
                            {item.subItems.map((subItem) => {
                              const SubIconComponent = getIconComponent(
                                subItem.icon
                              );
                              return (
                                <DropdownMenuItem
                                  className="rounded-lg"
                                  asChild
                                  key={subItem.title}
                                  onClick={handleNavClick}
                                >
                                  <Link
                                    href={subItem.url}
                                    className="flex items-center gap-2"
                                  >
                                    {SubIconComponent && (
                                      <SubIconComponent className="w-4 h-4" />
                                    )}
                                    <span>{subItem.title}</span>
                                  </Link>
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </div>
            ))}

            {/* Profile Dropdown */}
            <SidebarMenuItem>
              <DropdownMenu>
                <Tooltip>
                  <DropdownMenuTrigger asChild>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-lg"
                      >
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={user?.profile || "/placeholder-user.jpg"}
                            alt="User"
                          />
                          <AvatarFallback className="rounded-lg">
                            {getInitials(user?.user_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user?.user_name || "Unknown User"}
                          </span>
                          <span className="truncate text-xs">
                            {user?.user_email || "abc@mail.com"}
                          </span>
                        </div>
                        <ChevronDown className="ml-auto size-4" />
                      </SidebarMenuButton>
                    </TooltipTrigger>
                  </DropdownMenuTrigger>
                  <TooltipContent side={isMobile ? "top" : "right"}>
                    <div className="text-sm">
                      <div className="font-semibold">
                        {user?.user_name || "Unknown User"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user?.user_email || "abc@mail.com"}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={isMobile ? "top" : "right"}
                  align="start"
                  sideOffset={4}
                >
                  <DropdownMenuItem asChild onClick={handleNavClick}>
                    <Link href="/settings?tab=profile">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={user?.profile || "/placeholder-user.jpg"}
                            alt="User"
                          />
                          <AvatarFallback className="rounded-lg">
                            {getInitials(user?.user_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user?.user_name || "Unknown User"}
                          </span>
                          <span className="truncate text-xs">
                            {user?.user_email || "abc@mail.com"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="rounded-lg"
                    onClick={handleNavClick}
                  >
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-lg"
                    onClick={handleNavClick}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Feedback
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-lg"
                    onClick={handleNavClick}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Security
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg" onClick={logout}>
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
