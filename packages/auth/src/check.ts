import type { PermissionKey } from "./permissions";
import { ALL_PERMISSION_KEYS } from "./permissions";
import { ROLES, type RoleKey } from "./roles";

/**
 * Check if a user has a specific permission.
 *
 * Works with:
 * - Role (from Clerk org membership)
 * - Extra permissions (from Clerk membership metadata overrides)
 *
 * Usage in a service:
 *   const role = getUserRole(); // from Clerk JWT
 *   const extras = getUserMetadata().extraPermissions; // from Clerk metadata
 *   if (hasPermission(role, "org:documents:approve", extras)) { ... }
 */
export function hasPermission(
  role: string,
  permission: PermissionKey,
  extraPermissions?: string[],
): boolean {
  const roleDef = ROLES[role as RoleKey];

  // Admin gets everything
  if (roleDef?.isAdmin) return true;

  // Check role permissions
  if (roleDef?.permissions.includes(permission)) return true;

  // Check extra per-user overrides
  if (extraPermissions?.includes(permission)) return true;

  return false;
}

/**
 * Get all effective permissions for a user given their role + extras.
 */
export function getEffectivePermissions(
  role: string,
  extraPermissions?: string[],
): PermissionKey[] {
  const roleDef = ROLES[role as RoleKey];

  // Admin gets everything
  if (roleDef?.isAdmin) return [...ALL_PERMISSION_KEYS];

  const perms = new Set<PermissionKey>(roleDef?.permissions ?? []);
  if (extraPermissions) {
    for (const p of extraPermissions) {
      if (ALL_PERMISSION_KEYS.includes(p as PermissionKey)) {
        perms.add(p as PermissionKey);
      }
    }
  }
  return [...perms];
}

/**
 * Check if a user has access to a specific task.
 */
export function hasTaskAccess(
  role: string,
  taskSlug: string,
  extraPermissions?: string[],
): boolean {
  return hasPermission(role, `org:dept:${taskSlug}` as PermissionKey, extraPermissions);
}
