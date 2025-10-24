"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SidebarSkeleton({
  variant,
  collapsible,
  position,
  isStatic,
  isOffcanvas,
}) {
  return (
    <Sidebar
      variant={variant}
      collapsible={collapsible}
      side={position}
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
      {/* Header Skeleton */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="!p-1.5">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted" />
              <div className="flex flex-col gap-1 ml-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-16" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation Skeleton */}
      <SidebarContent className={cn(isStatic && "flex-1 overflow-y-auto")}>
        <div className="space-y-6 p-3">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-full mb-3" />
              <SidebarMenu className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <SidebarMenuItem key={j}>
                    <SidebarMenuButton>
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          ))}
        </div>
      </SidebarContent>

      {/* Footer Skeleton */}
      <SidebarFooter>
        <SidebarMenu>
          {[...Array(2)].map((_, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-20" />
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
