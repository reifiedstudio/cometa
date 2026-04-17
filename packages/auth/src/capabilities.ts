/**
 * Capabilities — granular actions a user can perform.
 * Each maps to one or more MCP tools / API endpoints.
 *
 * Convention: {domain}:{action}
 */

export interface Capability {
  key: string;
  name: string;
  description: string;
  domain: string;
}

export const CAPABILITIES = {
  // ── Documents (Intake) ──
  "documents:list": {
    key: "documents:list",
    name: "List documents",
    description: "View the list of intake documents",
    domain: "documents",
  },
  "documents:read": {
    key: "documents:read",
    name: "Read documents",
    description: "View full document details and extracted data",
    domain: "documents",
  },
  "documents:search": {
    key: "documents:search",
    name: "Search documents",
    description: "Full-text search across intake documents",
    domain: "documents",
  },
  "documents:approve": {
    key: "documents:approve",
    name: "Approve documents",
    description: "Approve or reject intake documents",
    domain: "documents",
  },
  "documents:delete": {
    key: "documents:delete",
    name: "Delete documents",
    description: "Soft-delete intake documents",
    domain: "documents",
  },

  // ── Signatures ──
  "signatures:request": {
    key: "signatures:request",
    name: "Request signatures",
    description: "Send documents for e-signature",
    domain: "signatures",
  },
  "signatures:read": {
    key: "signatures:read",
    name: "View signatures",
    description: "Check signature status and list requests",
    domain: "signatures",
  },
  "signatures:cancel": {
    key: "signatures:cancel",
    name: "Cancel signatures",
    description: "Cancel pending signature requests",
    domain: "signatures",
  },
  "signatures:nudge": {
    key: "signatures:nudge",
    name: "Nudge signers",
    description: "Send reminders to pending signers",
    domain: "signatures",
  },
  "signatures:manage": {
    key: "signatures:manage",
    name: "Manage signers",
    description: "Add or remove signers from requests",
    domain: "signatures",
  },
  "signatures:audit": {
    key: "signatures:audit",
    name: "View audit trail",
    description: "Access the full audit trail for signature requests",
    domain: "signatures",
  },

  // ── Tasks ──
  "tasks:send": {
    key: "tasks:send",
    name: "Send messages",
    description: "Send messages to department queues",
    domain: "tasks",
  },
  "tasks:read": {
    key: "tasks:read",
    name: "View tasks",
    description: "List and view department tasks",
    domain: "tasks",
  },
  "tasks:action": {
    key: "tasks:action",
    name: "Act on tasks",
    description: "Approve, reject, or reassign tasks",
    domain: "tasks",
  },
  "tasks:trace": {
    key: "tasks:trace",
    name: "View traces",
    description: "View message and task traces",
    domain: "tasks",
  },
  "tasks:agent": {
    key: "tasks:agent",
    name: "Start agent sessions",
    description: "Start managed AI agent sessions for tasks",
    domain: "tasks",
  },

  // ── Drive ──
  "drive:create": {
    key: "drive:create",
    name: "Create files",
    description: "Create Google Drive files and folders",
    domain: "drive",
  },
  "drive:list": {
    key: "drive:list",
    name: "List files",
    description: "List files shared with a department",
    domain: "drive",
  },
  "drive:handoff": {
    key: "drive:handoff",
    name: "Handoff files",
    description: "Hand off Drive files to departments",
    domain: "drive",
  },
  "drive:access": {
    key: "drive:access",
    name: "Manage file access",
    description: "Request and check file access",
    domain: "drive",
  },

  // ── Notes ──
  "notes:create": {
    key: "notes:create",
    name: "Create notes",
    description: "Create shareable notes and reports",
    domain: "notes",
  },

  // ── Utilities ──
  "utilities:create_document": {
    key: "utilities:create_document",
    name: "Create branded documents",
    description: "Generate branded PDFs with letterhead and signatures",
    domain: "utilities",
  },
  "utilities:convert_pdf": {
    key: "utilities:convert_pdf",
    name: "Convert to PDF",
    description: "Convert HTML content to PDF",
    domain: "utilities",
  },

  // ── Accounting ──
  "accounting:view": {
    key: "accounting:view",
    name: "View financials",
    description: "View financial reports, P&L, and balances",
    domain: "accounting",
  },
  "accounting:manage": {
    key: "accounting:manage",
    name: "Manage financials",
    description: "Manage invoices, transactions, and reconciliation",
    domain: "accounting",
  },

  // ── Department access (which task queues you can see) ──
  "dept:accounting": {
    key: "dept:accounting",
    name: "Accounting department",
    description: "Access to accounting task queue",
    domain: "departments",
  },
  "dept:legal": {
    key: "dept:legal",
    name: "Legal department",
    description: "Access to legal task queue",
    domain: "departments",
  },
  "dept:operations": {
    key: "dept:operations",
    name: "Operations department",
    description: "Access to operations task queue",
    domain: "departments",
  },
  "dept:hr": {
    key: "dept:hr",
    name: "HR department",
    description: "Access to HR task queue",
    domain: "departments",
  },

  // ── Gateway / MCP ──
  "mcp:access": {
    key: "mcp:access",
    name: "MCP access",
    description: "Access AI tools via MCP gateway",
    domain: "gateway",
  },
} as const satisfies Record<string, Capability>;

export type CapabilityKey = keyof typeof CAPABILITIES;

export const ALL_CAPABILITY_KEYS = Object.keys(CAPABILITIES) as CapabilityKey[];

/** Get capabilities grouped by domain */
export function getCapabilitiesByDomain(): Record<string, Capability[]> {
  const grouped: Record<string, Capability[]> = {};
  for (const cap of Object.values(CAPABILITIES)) {
    if (!grouped[cap.domain]) grouped[cap.domain] = [];
    grouped[cap.domain].push(cap);
  }
  return grouped;
}
