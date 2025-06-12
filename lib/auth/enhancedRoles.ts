// Enhanced role system with granular permissions
export type EnhancedUserRole = "super-admin" | "admin" | "support-admin" | "read-only" | "user"

// Role hierarchy (higher roles inherit lower role permissions)
const enhancedRoleHierarchy: Record<EnhancedUserRole, EnhancedUserRole[]> = {
  "super-admin": ["super-admin", "admin", "support-admin", "read-only", "user"],
  admin: ["admin", "support-admin", "read-only", "user"],
  "support-admin": ["support-admin", "read-only", "user"],
  "read-only": ["read-only", "user"],
  user: ["user"],
}

// Enhanced feature access control
export const enhancedFeatureAccess = {
  // User Management
  "user:view": ["super-admin", "admin"],
  "user:create": ["super-admin", "admin"],
  "user:edit": ["super-admin", "admin"],
  "user:delete": ["super-admin"],
  "user:restore": ["super-admin"],

  // Support Tickets
  "ticket:view": ["super-admin", "admin", "support-admin", "read-only", "user"],
  "ticket:create": ["super-admin", "admin", "support-admin", "user"],
  "ticket:edit": ["super-admin", "admin", "support-admin"],
  "ticket:delete": ["super-admin", "admin"],
  "ticket:restore": ["super-admin", "admin"],
  "ticket:assign": ["super-admin", "admin", "support-admin"],

  // Documents
  "document:view": ["super-admin", "admin", "support-admin", "read-only", "user"],
  "document:upload": ["super-admin", "admin", "support-admin"],
  "document:edit": ["super-admin", "admin"],
  "document:delete": ["super-admin", "admin"],
  "document:restore": ["super-admin", "admin"],

  // Analytics & Reports
  "analytics:view": ["super-admin", "admin"],
  "analytics:export": ["super-admin", "admin"],
  "reports:generate": ["super-admin", "admin"],

  // Calendar & Events
  "calendar:view": ["super-admin", "admin", "support-admin", "read-only", "user"],
  "calendar:create": ["super-admin", "admin", "support-admin"],
  "calendar:edit": ["super-admin", "admin", "support-admin"],
  "calendar:delete": ["super-admin", "admin"],

  // Audit & Activity Logs
  "audit:view": ["super-admin", "admin"],
  "audit:export": ["super-admin"],
  "activity:view": ["super-admin", "admin"],
  "activity:export": ["super-admin"],

  // System Administration
  "system:settings": ["super-admin"],
  "system:maintenance": ["super-admin"],
  "system:backup": ["super-admin", "admin"],
  "system:restore": ["super-admin"],

  // Admin Notices
  "notices:view": ["super-admin", "admin", "support-admin", "read-only"],
  "notices:create": ["super-admin", "admin"],
  "notices:edit": ["super-admin", "admin"],
  "notices:delete": ["super-admin"],
}

export function hasEnhancedRole(userRole: EnhancedUserRole | undefined, requiredRole: EnhancedUserRole): boolean {
  if (!userRole) return false
  return enhancedRoleHierarchy[userRole].includes(requiredRole)
}

export function hasEnhancedFeatureAccess(
  userRole: EnhancedUserRole | undefined,
  feature: keyof typeof enhancedFeatureAccess,
): boolean {
  if (!userRole) return false
  return enhancedFeatureAccess[feature].includes(userRole)
}

export function getEnhancedRolePermissions(userRole: EnhancedUserRole | undefined): string[] {
  if (!userRole) return []
  return Object.entries(enhancedFeatureAccess)
    .filter(([_, roles]) => roles.includes(userRole))
    .map(([feature]) => feature)
}

export function getRoleDisplayName(role: EnhancedUserRole): string {
  const roleNames: Record<EnhancedUserRole, string> = {
    "super-admin": "Super Administrator",
    admin: "Administrator",
    "support-admin": "Support Administrator",
    "read-only": "Read-Only User",
    user: "Standard User",
  }
  return roleNames[role]
}

export function getRoleDescription(role: EnhancedUserRole): string {
  const descriptions: Record<EnhancedUserRole, string> = {
    "super-admin": "Full system access including maintenance mode and system settings",
    admin: "Full administrative access to users, tickets, and documents",
    "support-admin": "Can manage tickets and view reports, limited user management",
    "read-only": "Can view all data but cannot make changes",
    user: "Basic user access to create and view own tickets",
  }
  return descriptions[role]
}
