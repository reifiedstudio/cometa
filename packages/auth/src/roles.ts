import type { PermissionKey } from "./permissions";

/**
 * Role definitions.
 * Each role bundles a set of permissions.
 * Roles are synced to Clerk — this is the source of truth.
 */

export interface Role {
  key: string;
  name: string;
  description: string;
  permissions: PermissionKey[];
  /** If true, this role grants access to all departments */
  isAdmin?: boolean;
}

export const ROLES: Record<string, Role> = {
  "org:admin": {
    key: "org:admin",
    name: "Admin",
    description: "Full access to everything",
    permissions: [], // Admin gets all permissions implicitly
    isAdmin: true,
  },
  "org:accounting_member": {
    key: "org:accounting_member",
    name: "Accounting",
    description: "Financial operations, invoices, reports",
    permissions: [
      "org:dept:accounting",
      "org:accounting:view",
      "org:accounting:manage",
      "org:documents:read",
      "org:documents:write",
      "org:drive:handoff",
      "org:drive:request",
      "org:mcp:access",
    ],
  },
  "org:legal_member": {
    key: "org:legal_member",
    name: "Legal",
    description: "Contracts, compliance, signatures",
    permissions: [
      "org:dept:legal",
      "org:documents:read",
      "org:documents:write",
      "org:documents:approve",
      "org:signatures:request",
      "org:signatures:sign",
      "org:drive:handoff",
      "org:drive:request",
      "org:mcp:access",
    ],
  },
  "org:operations_member": {
    key: "org:operations_member",
    name: "Operations",
    description: "Business operations, documents",
    permissions: [
      "org:dept:operations",
      "org:documents:read",
      "org:drive:handoff",
      "org:drive:request",
      "org:mcp:access",
    ],
  },
  "org:hr_member": {
    key: "org:hr_member",
    name: "HR",
    description: "People management, signatures",
    permissions: [
      "org:dept:hr",
      "org:documents:read",
      "org:documents:write",
      "org:signatures:request",
      "org:signatures:sign",
      "org:drive:handoff",
      "org:drive:request",
      "org:mcp:access",
    ],
  },
  "org:member": {
    key: "org:member",
    name: "Member",
    description: "Basic access only",
    permissions: [],
  },
};

export type RoleKey = keyof typeof ROLES;

export const ALL_ROLE_KEYS = Object.keys(ROLES) as RoleKey[];
