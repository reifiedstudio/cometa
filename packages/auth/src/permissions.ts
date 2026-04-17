/**
 * @deprecated — Use capabilities.ts instead.
 * This file re-exports capability types under the old permission names
 * for backward compatibility during migration.
 */

import { CAPABILITIES } from "./capabilities";

export {
  CAPABILITIES as PERMISSIONS,
  ALL_CAPABILITY_KEYS as ALL_PERMISSION_KEYS,
  getCapabilitiesByDomain as getPermissionsByService,
  type Capability as Permission,
  type CapabilityKey as PermissionKey,
} from "./capabilities";

/** @deprecated Use capabilities.ts */
export function getTaskPermissions() {
  return Object.values(CAPABILITIES).filter((p) => p.key.startsWith("dept:"));
}
