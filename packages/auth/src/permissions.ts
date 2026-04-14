/**
 * All permissions in the system.
 * This is the single source of truth — every service imports from here.
 *
 * Convention: org:{service}:{action}
 * Department access: org:dept:{slug}
 */

export interface Permission {
  key: string;
  name: string;
  description: string;
  service: string;
}

export const PERMISSIONS = {
  // Task access
  "org:dept:accounting": {
    key: "org:dept:accounting",
    name: "Accounting",
    description: "Access to accounting task and its services",
    service: "tasks",
  },
  "org:dept:legal": {
    key: "org:dept:legal",
    name: "Legal",
    description: "Access to legal task and its services",
    service: "tasks",
  },
  "org:dept:operations": {
    key: "org:dept:operations",
    name: "Operations",
    description: "Access to operations task and its services",
    service: "tasks",
  },
  "org:dept:hr": {
    key: "org:dept:hr",
    name: "HR",
    description: "Access to HR task and its services",
    service: "tasks",
  },

  // Documents service
  "org:documents:read": {
    key: "org:documents:read",
    name: "Read documents",
    description: "View and download documents",
    service: "documents",
  },
  "org:documents:write": {
    key: "org:documents:write",
    name: "Write documents",
    description: "Upload and edit documents",
    service: "documents",
  },
  "org:documents:approve": {
    key: "org:documents:approve",
    name: "Approve documents",
    description: "Approve documents and invoices",
    service: "documents",
  },

  // Signatures service
  "org:signatures:request": {
    key: "org:signatures:request",
    name: "Request signatures",
    description: "Send documents for e-signature",
    service: "signatures",
  },
  "org:signatures:sign": {
    key: "org:signatures:sign",
    name: "Sign documents",
    description: "Sign documents sent for signature",
    service: "signatures",
  },

  // Accounting service
  "org:accounting:view": {
    key: "org:accounting:view",
    name: "View financials",
    description: "View financial reports, P&L, and balances",
    service: "accounting",
  },
  "org:accounting:manage": {
    key: "org:accounting:manage",
    name: "Manage financials",
    description: "Manage invoices, transactions, and reconciliation",
    service: "accounting",
  },

  // Drive
  "org:drive:handoff": {
    key: "org:drive:handoff",
    name: "Handoff files",
    description: "Hand off Google Drive files to departments",
    service: "drive",
  },
  "org:drive:request": {
    key: "org:drive:request",
    name: "Request file access",
    description: "Request access to Google Drive files",
    service: "drive",
  },

  // MCP gateway
  "org:mcp:access": {
    key: "org:mcp:access",
    name: "MCP access",
    description: "Access AI tools via MCP gateway",
    service: "gateway",
  },
} as const satisfies Record<string, Permission>;

export type PermissionKey = keyof typeof PERMISSIONS;

/** All permission keys as an array */
export const ALL_PERMISSION_KEYS = Object.keys(PERMISSIONS) as PermissionKey[];

/** Get permissions grouped by service */
export function getPermissionsByService(): Record<string, Permission[]> {
  const grouped: Record<string, Permission[]> = {};
  for (const perm of Object.values(PERMISSIONS)) {
    if (!grouped[perm.service]) grouped[perm.service] = [];
    grouped[perm.service].push(perm);
  }
  return grouped;
}

/** Get just the task permissions */
export function getTaskPermissions(): Permission[] {
  return Object.values(PERMISSIONS).filter((p) => p.key.startsWith("org:dept:"));
}
