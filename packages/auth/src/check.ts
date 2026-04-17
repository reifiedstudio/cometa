import type { CapabilityKey } from "./capabilities";
import { ALL_CAPABILITY_KEYS } from "./capabilities";
import { ROLES, type RoleKey } from "./roles";

/**
 * Check if a user has a specific capability.
 *
 * Works with:
 * - Role (from Clerk org membership)
 * - Extra capabilities (from Clerk membership metadata overrides)
 *
 * Usage:
 *   const role = getUserRole();
 *   const extras = getUserMetadata().extraCapabilities;
 *   if (hasCapability(role, "documents:approve", extras)) { ... }
 */
export function hasCapability(
  role: string,
  capability: CapabilityKey,
  extraCapabilities?: string[],
): boolean {
  const roleDef = ROLES[role as RoleKey];

  // Admin gets everything
  if (roleDef?.isAdmin) return true;

  // Check role capabilities
  if (roleDef?.capabilities.includes(capability)) return true;

  // Check extra per-user overrides
  if (extraCapabilities?.includes(capability)) return true;

  return false;
}

/**
 * Get all effective capabilities for a user given their role + extras.
 */
export function getEffectiveCapabilities(
  role: string,
  extraCapabilities?: string[],
): CapabilityKey[] {
  const roleDef = ROLES[role as RoleKey];

  // Admin gets everything
  if (roleDef?.isAdmin) return [...ALL_CAPABILITY_KEYS];

  const caps = new Set<CapabilityKey>(roleDef?.capabilities ?? []);
  if (extraCapabilities) {
    for (const c of extraCapabilities) {
      if (ALL_CAPABILITY_KEYS.includes(c as CapabilityKey)) {
        caps.add(c as CapabilityKey);
      }
    }
  }
  return [...caps];
}

/**
 * Check if a user has access to a specific department task queue.
 */
export function hasTaskAccess(
  role: string,
  taskSlug: string,
  extraCapabilities?: string[],
): boolean {
  return hasCapability(role, `dept:${taskSlug}` as CapabilityKey, extraCapabilities);
}

// ── Backward compatibility aliases ──

/** @deprecated Use hasCapability */
export const hasPermission = hasCapability;

/** @deprecated Use getEffectiveCapabilities */
export function getEffectivePermissions(
  role: string,
  extraPermissions?: string[],
): CapabilityKey[] {
  return getEffectiveCapabilities(role, extraPermissions);
}
