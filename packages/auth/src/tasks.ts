import type { CapabilityKey } from "./capabilities";

/**
 * Task definitions.
 * Maps tasks to their access capability and connected services.
 */

export interface Task {
  name: string;
  slug: string;
  description: string;
  /** The capability key that grants access to this task */
  capabilityKey: CapabilityKey;
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
    capabilityKey: "dept:accounting",
    services: ["documents", "accounting", "mcp"],
    googleGroupEmail: process.env.TASK_ACCOUNTING_GROUP_EMAIL,
  },
  {
    name: "Legal",
    slug: "legal",
    description: "Contract review, compliance, signatures, and legal matters",
    capabilityKey: "dept:legal",
    services: ["documents", "signatures", "mcp"],
    googleGroupEmail: process.env.TASK_LEGAL_GROUP_EMAIL,
  },
  {
    name: "Operations",
    slug: "operations",
    description: "Day-to-day business operations and logistics",
    capabilityKey: "dept:operations",
    services: ["documents", "mcp"],
    googleGroupEmail: process.env.TASK_OPERATIONS_GROUP_EMAIL,
  },
  {
    name: "HR",
    slug: "hr",
    description: "People management, hiring, and employee relations",
    capabilityKey: "dept:hr",
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
