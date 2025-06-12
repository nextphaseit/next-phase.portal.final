import { UserRole } from '@/types/next-auth';

// Role hierarchy (higher roles have access to lower roles' permissions)
const roleHierarchy: Record<UserRole, UserRole[]> = {
  'super-admin': ['super-admin', 'admin', 'moderator', 'user'],
  'admin': ['admin', 'moderator', 'user'],
  'moderator': ['moderator', 'user'],
  'user': ['user'],
};

// Feature access control
export const featureAccess = {
  // User Management
  'user:view': ['super-admin', 'admin', 'moderator'],
  'user:create': ['super-admin', 'admin'],
  'user:edit': ['super-admin', 'admin'],
  'user:delete': ['super-admin'],

  // Support Tickets
  'ticket:view': ['super-admin', 'admin', 'moderator', 'user'],
  'ticket:create': ['super-admin', 'admin', 'moderator', 'user'],
  'ticket:edit': ['super-admin', 'admin', 'moderator'],
  'ticket:delete': ['super-admin', 'admin'],

  // Documents
  'document:view': ['super-admin', 'admin', 'moderator', 'user'],
  'document:upload': ['super-admin', 'admin', 'moderator'],
  'document:delete': ['super-admin', 'admin'],

  // Analytics
  'analytics:view': ['super-admin', 'admin'],
  'analytics:export': ['super-admin'],

  // Calendar
  'calendar:view': ['super-admin', 'admin', 'moderator', 'user'],
  'calendar:create': ['super-admin', 'admin', 'moderator'],
  'calendar:edit': ['super-admin', 'admin', 'moderator'],
  'calendar:delete': ['super-admin', 'admin'],
};

export function hasRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  return roleHierarchy[userRole].includes(requiredRole);
}

export function hasFeatureAccess(userRole: UserRole | undefined, feature: keyof typeof featureAccess): boolean {
  if (!userRole) return false;
  return featureAccess[feature].includes(userRole);
}

export function getRolePermissions(userRole: UserRole | undefined): string[] {
  if (!userRole) return [];
  return Object.entries(featureAccess)
    .filter(([_, roles]) => roles.includes(userRole))
    .map(([feature]) => feature);
}
