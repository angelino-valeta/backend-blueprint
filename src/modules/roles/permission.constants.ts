// Permission constants for RBAC
export const Permissions = {
    // User management
    USER_CREATE: 'user:create',
    USER_READ: 'user:read',
    USER_UPDATE: 'user:update',
    USER_DELETE: 'user:delete',

    // Role management
    ROLE_CREATE: 'role:create',
    ROLE_READ: 'role:read',
    ROLE_UPDATE: 'role:update',
    ROLE_DELETE: 'role:delete',

    // Audit
    AUDIT_READ: 'audit:read',

    // Events
    EVENT_READ: 'event:read',

    // System
    SYSTEM_ADMIN: 'system:admin',
} as const;

export type Permission = typeof Permissions[keyof typeof Permissions];
