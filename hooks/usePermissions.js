// hooks/usePermissions.ts
"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/context/NavigationContext";

/**
 * Main permission hook - automatically detects current route
 */
export const usePermissions = () => {
  const pathname = usePathname();
  const { mainNavigation, footerNavigation, loading } = useNavigation();

  const permissions = useMemo(() => {
    if (loading) {
      return {
        read: false,
        add: false,
        update: false,
        delete: false,
      };
    }
    const allMenus = [...mainNavigation, ...footerNavigation];
    return findPermissionsForPath(allMenus, pathname);
  }, [mainNavigation, footerNavigation, pathname, loading]);

  return {
    canRead: permissions.read,
    canAdd: permissions.add,
    canUpdate: permissions.update,
    canDelete: permissions.delete,
    hasAnyPermission: Object.values(permissions).some(Boolean),
    permissions,
    loading,
  };
};

/**
 * Permission hook for specific module/path
 */
export const useModulePermissions = (modulePath) => {
  const { mainNavigation, footerNavigation, loading } = useNavigation();

  const permissions = useMemo(() => {
    const allMenus = [...mainNavigation, ...footerNavigation];
    return findPermissionsForPath(allMenus, modulePath);
  }, [mainNavigation, footerNavigation, modulePath]);

  return {
    canRead: permissions.read,
    canAdd: permissions.add,
    canUpdate: permissions.update,
    canDelete: permissions.delete,
    hasAnyPermission: Object.values(permissions).some(Boolean),
    permissions,
    loading,
  };
};

/**
 * Bulk permission check for multiple modules
 */
export const useMultiplePermissions = (modulePaths) => {
  const { mainNavigation, footerNavigation, loading } = useNavigation();

  return useMemo(() => {
    const allMenus = [...mainNavigation, ...footerNavigation];
    const result = {};

    modulePaths.forEach((path) => {
      const permissions = findPermissionsForPath(allMenus, path);
      result[path] = {
        canRead: permissions.read,
        canAdd: permissions.add,
        canUpdate: permissions.update,
        canDelete: permissions.delete,
        hasAnyPermission: Object.values(permissions).some(Boolean),
        permissions,
        loading,
      };
    });

    return result;
  }, [mainNavigation, footerNavigation, modulePaths, loading]);
};

/**
 * Helper function to find permissions for a given path
 */
function findPermissionsForPath(navigation, targetPath) {
  const defaultPermissions = {
    read: false,
    add: false,
    update: false,
    delete: false,
  };

  if (!targetPath || !Array.isArray(navigation)) return defaultPermissions;

  // Remove query params and trailing slashes for comparison
  const cleanPath = targetPath.split("?")[0].replace(/\/$/, "");

  for (const section of navigation) {
    for (const item of section.items || []) {
      // Check subitems first (more specific)
      if (item.subItems?.length) {
        for (const sub of item.subItems) {
          const subUrl = sub.url?.split("?")[0].replace(/\/$/, "");

          // Match exact path or parent path for nested routes
          if (cleanPath === subUrl || cleanPath.startsWith(subUrl + "/")) {
            return sub.permissions || defaultPermissions;
          }
        }
      }

      // Check main item
      if (item.url) {
        const itemUrl = item.url.split("?")[0].replace(/\/$/, "");

        if (cleanPath === itemUrl || cleanPath.startsWith(itemUrl + "/")) {
          return item.permissions || defaultPermissions;
        }
      }
    }
  }

  return defaultPermissions;
}

/**
 * HOC to conditionally render components based on permissions
 */
export function withPermission(Component, requiredPermission) {
  return function PermissionWrappedComponent(props) {
    const { permissions } = usePermissions();

    if (!permissions[requiredPermission]) {
      return null;
    }

    return React.createElement(Component, props);
  };
}

/**
 * Hook for checking specific permission type
 */
export const useHasPermission = (permissionType, modulePath) => {
  const currentPathPermissions = usePermissions();
  const modulePermissions = useModulePermissions(modulePath || "");

  const targetPermissions = modulePath
    ? modulePermissions
    : currentPathPermissions;

  return targetPermissions.permissions[permissionType];
};

// ==================== USAGE EXAMPLES ====================

/*
// Example 1: Using in a component (auto-detects current route)
function UsersPage() {
  const { canAdd, canUpdate, canDelete } = usePermissions();

  return (
    <div>
      {canAdd && <button>Create User</button>}
      {canUpdate && <button>Edit User</button>}
      {canDelete && <button>Delete User</button>}
    </div>
  );
}

// Example 2: Check permissions for specific module
function Dashboard() {
  const userPermissions = useModulePermissions("/controls/users");
  const rolePermissions = useModulePermissions("/controls/roles");

  return (
    <div>
      {userPermissions.canAdd && <Link href="/controls/users/new">Add User</Link>}
      {rolePermissions.canAdd && <Link href="/controls/roles/new">Add Role</Link>}
    </div>
  );
}

// Example 3: Check multiple modules at once
function AdminPanel() {
  const permissions = useMultiplePermissions([
    "/controls/users",
    "/controls/roles",
    "/controls/branches",
  ]);

  return (
    <div>
      {permissions["/controls/users"].canAdd && <button>Add User</button>}
      {permissions["/controls/roles"].canAdd && <button>Add Role</button>}
      {permissions["/controls/branches"].canAdd && <button>Add Branch</button>}
    </div>
  );
}

// Example 4: Using HOC
const CreateButton = withPermission(
  ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>Create</button>
  ),
  "add"
);

// Example 5: Simple permission check
function ActionButtons() {
  const canDelete = useHasPermission("delete");
  const canEditUsers = useHasPermission("update", "/controls/users");

  return (
    <div>
      {canDelete && <button>Delete</button>}
      {canEditUsers && <button>Edit User</button>}
    </div>
  );
}

// Example 6: Reusable permission-based components
function PermissionButton({
  permission,
  children,
  ...props
}: {
  permission: keyof Permissions;
  children: React.ReactNode;
  [key: string]: any;
}) {
  const { permissions } = usePermissions();

  if (!permissions[permission]) return null;

  return <button {...props}>{children}</button>;
}

// Usage:
<PermissionButton permission="add" onClick={handleCreate}>
  Create New
</PermissionButton>
<PermissionButton permission="update" onClick={handleEdit}>
  Edit
</PermissionButton>
<PermissionButton permission="delete" onClick={handleDelete}>
  Delete
</PermissionButton>
*/
