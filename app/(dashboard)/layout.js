"use client";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useThemeCustomization } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import Unauthorized from "../unauthorized/page";
import Loading from "./loading";
import { PermissionGuard } from "@/components/permissions/PermissionGuard";

export default function DashboardLayout({ children }) {
  const { tentDetails, user, isAccountSuspended } = useAuth();
  const { layoutConfig } = useThemeCustomization();

  if (isAccountSuspended) {
    return <div className="min-h-screen flex flex-col"></div>;
  }

  // Don't render sidebar if position is "none"
  if (layoutConfig.sidebarPosition === "none") {
    return (
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <main
          className={cn(
            "flex-1 p-4 md:p-8 pt-6",
            layoutConfig.spacing === "compact" && "p-2 md:p-4 pt-3",
            layoutConfig.spacing === "spacious" && "p-6 md:p-12 pt-8",
            layoutConfig.contentMaxWidth === "container" && "max-w-7xl mx-auto",
            layoutConfig.contentMaxWidth === "narrow" && "max-w-4xl mx-auto"
          )}
        >
          <PermissionGuard
            permission={"read"}
            loadingFallback={<Loading />}
            fallback={<Unauthorized />}
          >
            {children}
          </PermissionGuard>
        </main>
        {layoutConfig.footerVisible && tentDetails?.tent_name && (
          <footer className="border-t p-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {tentDetails?.tent_name}. All rights
            reserved.
          </footer>
        )}
      </div>
    );
  }

  // For offcanvas behavior, we need different structure
  if (layoutConfig.sidebarBehavior === "offcanvas") {
    return (
      <SidebarProvider
        defaultOpen={false}
        className={cn(
          layoutConfig.sidebarPosition === "right" && "flex-row-reverse"
        )}
      >
        <DashboardSidebar
          tentDetails={tentDetails}
          user={user}
          isOffcanvas={true}
        />
        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardHeader />
          <main
            className={cn(
              "flex-1 p-4 md:p-8 pt-6",
              layoutConfig.spacing === "compact" && "p-2 md:p-4 pt-3",
              layoutConfig.spacing === "spacious" && "p-6 md:p-12 pt-8",
              layoutConfig.contentMaxWidth === "container" &&
                "max-w-7xl mx-auto",
              layoutConfig.contentMaxWidth === "narrow" && "max-w-4xl mx-auto"
            )}
          >
            <PermissionGuard
              permission={"read"}
              loadingFallback={<Loading />}
              fallback={<Unauthorized />}
            >
              {children}
            </PermissionGuard>
          </main>
          {layoutConfig.footerVisible && tentDetails?.tent_name && (
            <footer className="border-t p-4 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} {tentDetails?.tent_name}. All rights
              reserved.
            </footer>
          )}
        </div>
      </SidebarProvider>
    );
  }

  // For static and collapsible sidebars
  return (
    <SidebarProvider
      defaultOpen={!layoutConfig.sidebarCollapsed}
      className={cn(
        layoutConfig.sidebarPosition === "right" && "flex-row-reverse"
      )}
    >
      <DashboardSidebar
        tentDetails={tentDetails}
        user={user}
        isStatic={layoutConfig.sidebarBehavior === "static"}
        isCollapseOffcanvas={
          layoutConfig.sidebarBehavior === "collapsibleCanvas"
        }
      />
      <SidebarInset>
        <DashboardHeader />
        <main
          className={cn(
            "flex-1 space-y-4 p-4 md:p-8 pt-6",
            layoutConfig.spacing === "compact" && "space-y-2 p-2 md:p-4 pt-3",
            layoutConfig.spacing === "spacious" && "space-y-6 p-6 md:p-12 pt-8",
            layoutConfig.contentMaxWidth === "container" && "max-w-7xl mx-auto",
            layoutConfig.contentMaxWidth === "narrow" && "max-w-4xl mx-auto"
          )}
        >
          <PermissionGuard
            permission={"read"}
            loadingFallback={<Loading />}
            fallback={<Unauthorized />}
          >
            {children}
          </PermissionGuard>
        </main>
        {layoutConfig.footerVisible && tentDetails?.tent_name && (
          <footer className="border-t p-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {tentDetails?.tent_name}. All rights
            reserved.
          </footer>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
