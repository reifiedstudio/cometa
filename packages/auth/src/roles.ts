import type { CapabilityKey } from "./capabilities";

/**
 * Role definitions.
 * Each role bundles a set of capabilities.
 * Roles are synced to Clerk — this is the source of truth.
 */

export interface Role {
  key: string;
  name: string;
  description: string;
  capabilities: CapabilityKey[];
  /** If true, this role grants all capabilities */
  isAdmin?: boolean;
}

export const ROLES: Record<string, Role> = {
  "org:admin": {
    key: "org:admin",
    name: "Admin",
    description: "Full access to everything",
    capabilities: [], // Admin gets all capabilities implicitly
    isAdmin: true,
  },
  "org:accounting_member": {
    key: "org:accounting_member",
    name: "Accounting",
    description: "Financial operations, invoices, reports",
    capabilities: [
      "dept:accounting",
      "accounting:view",
      "accounting:manage",
      "documents:list",
      "documents:read",
      "documents:search",
      "drive:list",
      "drive:handoff",
      "drive:access",
      "notes:create",
      "mcp:access",
    ],
  },
  "org:legal_member": {
    key: "org:legal_member",
    name: "Legal",
    description: "Contracts, compliance, signatures",
    capabilities: [
      "dept:legal",
      "documents:list",
      "documents:read",
      "documents:search",
      "documents:approve",
      "signatures:request",
      "signatures:read",
      "signatures:cancel",
      "signatures:nudge",
      "signatures:manage",
      "signatures:audit",
      "drive:list",
      "drive:handoff",
      "drive:access",
      "notes:create",
      "utilities:create_document",
      "utilities:convert_pdf",
      "mcp:access",
    ],
  },
  "org:operations_member": {
    key: "org:operations_member",
    name: "Operations",
    description: "Business operations, documents",
    capabilities: [
      "dept:operations",
      "documents:list",
      "documents:read",
      "documents:search",
      "drive:list",
      "drive:access",
      "notes:create",
      "mcp:access",
    ],
  },
  "org:hr_member": {
    key: "org:hr_member",
    name: "HR",
    description: "People management, signatures",
    capabilities: [
      "dept:hr",
      "documents:list",
      "documents:read",
      "documents:search",
      "signatures:request",
      "signatures:read",
      "signatures:nudge",
      "drive:list",
      "drive:handoff",
      "drive:access",
      "notes:create",
      "mcp:access",
    ],
  },
  "org:member": {
    key: "org:member",
    name: "Member",
    description: "Basic access only",
    capabilities: [
      "documents:list",
      "documents:read",
      "drive:list",
      "drive:access",
      "mcp:access",
    ],
  },
};

export type RoleKey = keyof typeof ROLES;

export const ALL_ROLE_KEYS = Object.keys(ROLES) as RoleKey[];
