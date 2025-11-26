// components/permissions/PermissionGuard.tsx
"use client";

import { usePermissions, useModulePermissions } from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, MoreHorizontal, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigation } from "@/context/NavigationContext";

/**
 * Wrapper component to conditionally render children based on permissions
 */
export function PermissionGuard({
  permission,
  modulePath,
  fallback = null,
  loadingFallback = null,
  children,
}) {
  const { loading } = useNavigation();
  const currentPermissions = usePermissions();
  const modulePermissions = useModulePermissions(modulePath || "");

  const permissions = modulePath ? modulePermissions : currentPermissions;

  if (loading) {
    return <>{loadingFallback}</>;
  }

  const hasPermission = permissions.permissions[permission];

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Pre-built action buttons component with automatic permission handling
 */
export function ActionButtons({
  modulePath,
  onAdd,
  onEdit,
  onDelete,
  onView,
  addLabel = "Create",
  editLabel = "Edit",
  deleteLabel = "Delete",
  viewLabel = "View",
  showLabels = true,
  variant = "default",
  size = "default",
}) {
  const currentPermissions = usePermissions();
  const modulePermissions = useModulePermissions(modulePath || "");

  const { canRead, canAdd, canUpdate, canDelete } = modulePath
    ? modulePermissions
    : currentPermissions;

  return (
    <div className="flex items-center gap-2">
      {canRead && onView && (
        <Button variant={variant} size={size} onClick={onView}>
          <Eye className="h-4 w-4" />
          {showLabels && <span className="ml-2">{viewLabel}</span>}
        </Button>
      )}

      {canAdd && onAdd && (
        <Button variant={variant} size={size} onClick={onAdd}>
          <Plus className="h-4 w-4" />
          {showLabels && <span className="ml-2">{addLabel}</span>}
        </Button>
      )}

      {canUpdate && onEdit && (
        <Button variant={variant} size={size} onClick={onEdit}>
          <Pencil className="h-4 w-4" />
          {showLabels && <span className="ml-2">{editLabel}</span>}
        </Button>
      )}

      {canDelete && onDelete && (
        <Button
          variant={variant === "default" ? "destructive" : variant}
          size={size}
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          {showLabels && <span className="ml-2">{deleteLabel}</span>}
        </Button>
      )}
    </div>
  );
}

// components/permissions/TableActions.js

/**
 * Dropdown menu for table row actions with automatic permission handling
 */
export function TableActions({
  modulePath,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  customActions = [],
}) {
  const currentPermissions = usePermissions();
  const modulePermissions = useModulePermissions(modulePath || "");

  const { canRead, canAdd, canUpdate, canDelete } = modulePath
    ? modulePermissions
    : currentPermissions;

  const hasAnyAction =
    (canRead && onView) ||
    (canUpdate && onEdit) ||
    (canDelete && onDelete) ||
    (canAdd && onDuplicate) ||
    customActions.length > 0;

  if (!hasAnyAction) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canRead && onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        )}

        {canUpdate && onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}

        {canAdd && onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
        )}

        {customActions.map((action, index) => {
          const hasPermission = action.permission
            ? (modulePath ? modulePermissions : currentPermissions).permissions[
                action.permission
              ]
            : true;

          if (!hasPermission) return null;

          return (
            <DropdownMenuItem key={index} onClick={action.onClick}>
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          );
        })}

        {canDelete && onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ==================== USAGE EXAMPLES ====================

/*
// Example 1: Using PermissionGuard
function UsersPage() {
  return (
    <div>
      <h1>Users</h1>
      
      <PermissionGuard permission="add">
        <button>Create New User</button>
      </PermissionGuard>

      <PermissionGuard 
        permission="delete" 
        fallback={<p>You don't have permission to delete</p>}
      >
        <button>Delete User</button>
      </PermissionGuard>

      // Check permission for different module
      <PermissionGuard permission="add" modulePath="/controls/roles">
        <button>Create New Role</button>
      </PermissionGuard>
    </div>
  );
}

// Example 2: Using ActionButtons component
function UsersList() {
  const router = useRouter();

  return (
    <div>
      <ActionButtons
        onAdd={() => router.push("/controls/users/new")}
        onEdit={() => console.log("Edit")}
        onDelete={() => console.log("Delete")}
        showLabels={true}
      />
    </div>
  );
}

// Example 3: Using TableActions in data table
function UsersTable({ users }) {
  const router = useRouter();

  return (
    <table>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>
              <TableActions
                onView={() => router.push(`/controls/users/${user.id}`)}
                onEdit={() => router.push(`/controls/users/${user.id}/edit`)}
                onDelete={() => handleDelete(user.id)}
                onDuplicate={() => handleDuplicate(user.id)}
                customActions={[
                  {
                    label: "Reset Password",
                    onClick: () => handleResetPassword(user.id),
                    permission: "update",
                  },
                ]}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Example 4: Page-level implementation
function UsersManagementPage() {
  const router = useRouter();
  const { canAdd, canUpdate, canDelete } = usePermissions();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Users Management</h1>
        
        <ActionButtons
          onAdd={canAdd ? () => router.push("/controls/users/new") : undefined}
          addLabel="Add User"
          variant="default"
        />
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
              
              <TableActions
                onView={() => router.push(`/controls/users/${user.id}`)}
                onEdit={() => router.push(`/controls/users/${user.id}/edit`)}
                onDelete={() => handleDelete(user.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example 5: Custom permission-based button
function CustomButton() {
  const { canUpdate } = usePermissions();

  return (
    <PermissionGuard permission="update">
      <Button 
        onClick={handleSave}
        disabled={!canUpdate}
      >
        Save Changes
      </Button>
    </PermissionGuard>
  );
}
*/
