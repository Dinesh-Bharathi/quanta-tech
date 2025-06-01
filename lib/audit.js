// Audit logging system for tracking user actions

export const AUDIT_ACTIONS = {
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
  PRODUCT_CREATED: "product_created",
  PRODUCT_UPDATED: "product_updated",
  PRODUCT_DELETED: "product_deleted",
  INVENTORY_UPDATED: "inventory_updated",
  ORDER_PROCESSED: "order_processed",
  SETTINGS_CHANGED: "settings_changed",
  TEAM_MEMBER_ADDED: "team_member_added",
  TEAM_MEMBER_REMOVED: "team_member_removed",
}

export class AuditLogger {
  static async log(action, userId, organizationId, details = {}) {
    const auditEntry = {
      id: crypto.randomUUID(),
      action,
      userId,
      organizationId,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: details.ipAddress || "unknown",
      userAgent: details.userAgent || "unknown",
    }

    // In a real app, this would save to database
    console.log("Audit Log:", auditEntry)

    // Could also send to external audit service
    // await sendToAuditService(auditEntry)

    return auditEntry
  }

  static async getAuditLogs(organizationId, filters = {}) {
    // Mock audit logs - in real app, fetch from database
    return [
      {
        id: "1",
        action: AUDIT_ACTIONS.PRODUCT_CREATED,
        userId: 1,
        userName: "John Doe",
        details: { productName: "iPhone 15 Pro" },
        timestamp: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        action: AUDIT_ACTIONS.INVENTORY_UPDATED,
        userId: 2,
        userName: "Sarah Wilson",
        details: { productName: "MacBook Air", oldStock: 10, newStock: 12 },
        timestamp: "2024-01-15T09:15:00Z",
      },
    ]
  }
}
