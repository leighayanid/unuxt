// Permission constants
export const PERMISSIONS = {
  // Organization permissions
  "organization:read": "View organization details",
  "organization:update": "Update organization settings",
  "organization:delete": "Delete organization",

  // Member permissions
  "member:read": "View members",
  "member:invite": "Invite new members",
  "member:remove": "Remove members",
  "member:updateRole": "Change member roles",

  // Invitation permissions
  "invitation:create": "Create invitations",
  "invitation:revoke": "Revoke invitations",
} as const;

export type Permission = keyof typeof PERMISSIONS;

// Default role permissions mapping
export const DEFAULT_ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: Object.keys(PERMISSIONS) as Permission[],
  admin: [
    "organization:read",
    "organization:update",
    "member:read",
    "member:invite",
    "member:remove",
    "invitation:create",
    "invitation:revoke",
  ],
  member: ["organization:read", "member:read"],
};

// OAuth providers
export const OAUTH_PROVIDERS = ["google", "github"] as const;
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

// Role hierarchy (higher index = more permissions)
export const ROLE_HIERARCHY = ["member", "admin", "owner"] as const;
export type OrganizationRole = (typeof ROLE_HIERARCHY)[number];

// Session settings
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
export const SESSION_COOKIE_NAME = "unuxt-session";

// Rate limiting
export const RATE_LIMITS = {
  auth: { window: 60, max: 10 }, // 10 requests per minute for auth
  api: { window: 60, max: 100 }, // 100 requests per minute for general API
  upload: { window: 60, max: 20 }, // 20 uploads per minute
} as const;

// File upload limits
export const UPLOAD_LIMITS = {
  avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
  general: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
} as const;
