// Authentication utilities and role-based access control

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
  VIEWER: "viewer",
}

export const PERMISSIONS = {
  MANAGE_TEAM: "manage_team",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_INVENTORY: "manage_inventory",
  PROCESS_ORDERS: "process_orders",
  ACCESS_BILLING: "access_billing",
  EXPORT_DATA: "export_data",
}

export const rolePermissions = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.PROCESS_ORDERS,
    PERMISSIONS.EXPORT_DATA,
  ],
  [ROLES.STAFF]: [PERMISSIONS.VIEW_ANALYTICS, PERMISSIONS.MANAGE_INVENTORY, PERMISSIONS.PROCESS_ORDERS],
  [ROLES.VIEWER]: [PERMISSIONS.VIEW_ANALYTICS],
}

export function hasPermission(userRole, permission) {
  return rolePermissions[userRole]?.includes(permission) || false
}

export function checkAuth() {
  // Mock authentication check
  return {
    user: {
      id: 1,
      name: "John Doe",
      email: "john@acme.com",
      role: ROLES.ADMIN,
      organizationId: 1,
    },
    organization: {
      id: 1,
      name: "Acme Corp",
      plan: "enterprise",
      theme: "default",
    },
  }
}
