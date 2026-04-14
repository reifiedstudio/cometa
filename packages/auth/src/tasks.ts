import type { PermissionKey } from "./permissions";

/**
 * Task definitions.
 * Maps tasks to their access permission and connected services.
 */

export interface Task {
  name: string;
  slug: string;
  description: string;
  /** The permission key that grants access to this task */
  permissionKey: PermissionKey;
  /** Services this task has access to */
  services: string[];
  /** Google Workspace group email for Drive sharing */
  googleGroupEmail?: string;
}

export const TASKS: Task[] = [
  {
    name: "Accounting",
    slug: "accounting",
    description: "Financial operations, invoicing, P&L, and bank reconciliation",
    permissionKey: "org:dept:accounting",
    services: ["documents", "accounting", "mcp"],
    googleGroupEmail: process.env.TASK_ACCOUNTING_GROUP_EMAIL,
  },
  {
    name: "Legal",
    slug: "legal",
    description: "Contract review, compliance, signatures, and legal matters",
    permissionKey: "org:dept:legal",
    services: ["documents", "signatures", "mcp"],
    googleGroupEmail: process.env.TASK_LEGAL_GROUP_EMAIL,
  },
  {
    name: "Operations",
    slug: "operations",
    description: "Day-to-day business operations and logistics",
    permissionKey: "org:dept:operations",
    services: ["documents", "mcp"],
    googleGroupEmail: process.env.TASK_OPERATIONS_GROUP_EMAIL,
  },
  {
    name: "HR",
    slug: "hr",
    description: "People management, hiring, and employee relations",
    permissionKey: "org:dept:hr",
    services: ["documents", "signatures", "mcp"],
    googleGroupEmail: process.env.TASK_HR_GROUP_EMAIL,
  },
];

/** Get a task by slug */
export function getTask(slug: string): Task | undefined {
  return TASKS.find((d) => d.slug === slug);
}

/** Get a task by its Google Group email */
export function getTaskByGroupEmail(email: string): Task | undefined {
  return TASKS.find((d) => d.googleGroupEmail === email);
}
