// ── Capabilities (primary API) ──
export {
  CAPABILITIES,
  ALL_CAPABILITY_KEYS,
  getCapabilitiesByDomain,
  type Capability,
  type CapabilityKey,
} from "./capabilities";

// ── Tool → Capability mapping ──
export {
  TOOL_CAPABILITIES,
  canCallTool,
  getToolCapability,
} from "./tool-map";

// ── Roles ──
export {
  ROLES,
  ALL_ROLE_KEYS,
  type Role,
  type RoleKey,
} from "./roles";

// ── Tasks (departments) ──
export {
  TASKS,
  getTask,
  getTaskByGroupEmail,
  type Task,
} from "./tasks";

// ── Checks ──
export {
  hasCapability,
  getEffectiveCapabilities,
  hasTaskAccess,
  // Backward compat
  hasPermission,
  getEffectivePermissions,
} from "./check";

// ── Backward compatibility re-exports ──
export {
  PERMISSIONS,
  ALL_PERMISSION_KEYS,
  getPermissionsByService,
  getTaskPermissions,
  type Permission,
  type PermissionKey,
} from "./permissions";

// ── Fail-fast env var validation ──
export { requireEnv, requireClerkAuth } from "./require-env";
