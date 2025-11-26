// hooks/useFilteredNavigation.ts
"use client";

import { useMemo } from "react";
import {
  filterNavigationByPermissions,
  countAccessibleItems,
  getFirstAccessibleUrl,
  canAccessUrl,
  getAllAccessibleUrls,
  getPermissionSummary,
} from "@/lib/sidebarPermissions";
import { useNavigation } from "@/context/NavigationContext";

/**
 * Hook that provides filtered navigation based on user permissions
 * Automatically filters out menu items the user doesn't have access to
 */
export const useFilteredNavigation = () => {
  const { mainNavigation, footerNavigation, loading } = useNavigation();

  // Filter main navigation
  const filteredMainNavigation = useMemo(
    () => filterNavigationByPermissions(mainNavigation),
    [mainNavigation]
  );

  // Filter footer navigation
  const filteredFooterNavigation = useMemo(
    () => filterNavigationByPermissions(footerNavigation),
    [footerNavigation]
  );

  // Combine all navigation for utility functions
  const allNavigation = useMemo(
    () => [...mainNavigation, ...footerNavigation],
    [mainNavigation, footerNavigation]
  );

  // Count accessible items
  const accessibleMainCount = useMemo(
    () => countAccessibleItems(filteredMainNavigation),
    [filteredMainNavigation]
  );

  const accessibleFooterCount = useMemo(
    () => countAccessibleItems(filteredFooterNavigation),
    [filteredFooterNavigation]
  );

  const totalAccessibleCount = accessibleMainCount + accessibleFooterCount;

  // Get first accessible URL (useful for redirects)
  const firstAccessibleUrl = useMemo(
    () => getFirstAccessibleUrl(allNavigation),
    [allNavigation]
  );

  // Get all accessible URLs
  const accessibleUrls = useMemo(
    () => getAllAccessibleUrls(allNavigation),
    [allNavigation]
  );

  // Utility function to check URL access
  const checkUrlAccess = (url) => canAccessUrl(allNavigation, url);

  // Get permission summary (useful for debugging)
  const permissionSummary = useMemo(
    () => getPermissionSummary(allNavigation),
    [allNavigation]
  );

  return {
    // Filtered navigation
    mainNavigation: filteredMainNavigation,
    footerNavigation: filteredFooterNavigation,

    // Original navigation (unfiltered)
    originalMainNavigation: mainNavigation,
    originalFooterNavigation: footerNavigation,

    // Loading state
    loading,

    // Statistics
    accessibleMainCount,
    accessibleFooterCount,
    totalAccessibleCount,

    // Utilities
    firstAccessibleUrl,
    accessibleUrls,
    checkUrlAccess,
    permissionSummary,

    // Flags
    hasAnyAccess: totalAccessibleCount > 0,
    hasMainAccess: accessibleMainCount > 0,
    hasFooterAccess: accessibleFooterCount > 0,
  };
};

// ==================== SIMPLIFIED VERSION FOR SIDEBAR ====================

/**
 * Simplified hook specifically for sidebar component
 * Returns only what's needed for rendering
 */
export const useSidebarNavigation = () => {
  const { mainNavigation, footerNavigation, loading } = useNavigation();

  const filteredMainNavigation = useMemo(
    () => filterNavigationByPermissions(mainNavigation),
    [mainNavigation]
  );

  const filteredFooterNavigation = useMemo(
    () => filterNavigationByPermissions(footerNavigation),
    [footerNavigation]
  );

  return {
    mainNavigation: filteredMainNavigation,
    footerNavigation: filteredFooterNavigation,
    loading,
    isEmpty:
      filteredMainNavigation.length === 0 &&
      filteredFooterNavigation.length === 0,
  };
};

// ==================== USAGE EXAMPLES ====================

/*
// Example 1: Using in Sidebar Component (Simplified)
import { useSidebarNavigation } from "@/hooks/useFilteredNavigation";

export function DashboardSidebar() {
  const { mainNavigation, footerNavigation, loading, isEmpty } = useSidebarNavigation();

  if (loading) return <SidebarSkeleton />;
  
  if (isEmpty) {
    return <div>No accessible modules</div>;
  }

  return (
    <Sidebar>
      <SidebarContent>
        {mainNavigation.map(section => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map(item => (
                <MenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

// Example 2: Using Full Hook with Utilities
import { useFilteredNavigation } from "@/hooks/useFilteredNavigation";

export function Dashboard() {
  const {
    mainNavigation,
    totalAccessibleCount,
    firstAccessibleUrl,
    checkUrlAccess,
    hasAnyAccess,
    permissionSummary
  } = useFilteredNavigation();

  // Log permission details for debugging
  console.log("Permission Summary:", permissionSummary);

  if (!hasAnyAccess) {
    return <NoAccessPage />;
  }

  return (
    <div>
      <p>You have access to {totalAccessibleCount} modules</p>
      <DashboardSidebar />
    </div>
  );
}

// Example 3: Redirect to First Accessible Page
import { useFilteredNavigation } from "@/hooks/useFilteredNavigation";

export function LoginCallback() {
  const { firstAccessibleUrl, loading } = useFilteredNavigation();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (firstAccessibleUrl) {
        router.push(firstAccessibleUrl);
      } else {
        router.push("/no-access");
      }
    }
  }, [loading, firstAccessibleUrl, router]);

  return <div>Redirecting...</div>;
}

// Example 4: Check URL Access in Route Guard
import { useFilteredNavigation } from "@/hooks/useFilteredNavigation";

export function ProtectedRoute({ children }) {
  const pathname = usePathname();
  const { checkUrlAccess, loading } = useFilteredNavigation();

  if (loading) return <PageLoader />;

  const hasAccess = checkUrlAccess(pathname);

  if (!hasAccess) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
}

// Example 5: Navigation Statistics Dashboard
import { useFilteredNavigation } from "@/hooks/useFilteredNavigation";

export function AdminDashboard() {
  const {
    accessibleMainCount,
    accessibleFooterCount,
    totalAccessibleCount,
    accessibleUrls,
    permissionSummary
  } = useFilteredNavigation();

  return (
    <div>
      <h1>Access Summary</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardTitle>Main Modules</CardTitle>
          <CardContent>{accessibleMainCount}</CardContent>
        </Card>
        <Card>
          <CardTitle>Settings</CardTitle>
          <CardContent>{accessibleFooterCount}</CardContent>
        </Card>
        <Card>
          <CardTitle>Total Access</CardTitle>
          <CardContent>{totalAccessibleCount}</CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2>Accessible URLs</h2>
        <ul>
          {accessibleUrls.map(url => (
            <li key={url}>
              <Link href={url}>{url}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2>Permission Details</h2>
        <pre>{JSON.stringify(permissionSummary, null, 2)}</pre>
      </div>
    </div>
  );
}

// Example 6: Conditional Rendering Based on Module Access
import { useFilteredNavigation } from "@/hooks/useFilteredNavigation";

export function QuickActions() {
  const { checkUrlAccess } = useFilteredNavigation();

  const canAccessUsers = checkUrlAccess("/controls/users");
  const canAccessRoles = checkUrlAccess("/controls/roles");
  const canAccessBranches = checkUrlAccess("/controls/branches");

  return (
    <div className="flex gap-2">
      {canAccessUsers && (
        <Button onClick={() => router.push("/controls/users")}>
          Manage Users
        </Button>
      )}
      {canAccessRoles && (
        <Button onClick={() => router.push("/controls/roles")}>
          Manage Roles
        </Button>
      )}
      {canAccessBranches && (
        <Button onClick={() => router.push("/controls/branches")}>
          Manage Branches
        </Button>
      )}
    </div>
  );
}
*/
