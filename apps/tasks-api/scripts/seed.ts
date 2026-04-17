#!/usr/bin/env bun
/**
 * Seeds sample tasks into the shared services DynamoDB table.
 *
 * Idempotent: each task has a deterministic ID (`seed-task-N`). Re-running
 * overwrites in place via PutItem (DynamoDB upsert semantics).
 *
 * Requires:
 *   - DYNAMODB_TABLE env var (defaults to cometa-dev-services)
 *   - AWS credentials configured (same as used by Terraform / aws cli)
 */
import { putTask } from "@cometa/service-core";
import type { Task } from "@cometa/service-core";

const DEFAULT_TABLE = "cometa-dev-services";

interface SeedTask {
  id: string;
  department: "accounting" | "legal" | "operations" | "hr";
  type: string;
  status: Task["status"];
  body: string;
  assignedTo?: string;
  metadata?: Record<string, unknown>;
  createdDaysAgo: number;
}

const samples: SeedTask[] = [
  {
    id: "seed-task-1",
    department: "accounting",
    type: "invoice_review",
    status: "pending",
    body: "Review Q1 AWS invoice — verify line items against contract.",
    metadata: { documentId: "seed-doc-5", amount: 3847.22 },
    createdDaysAgo: 2,
  },
  {
    id: "seed-task-2",
    department: "accounting",
    type: "payment_approval",
    status: "awaiting_approval",
    body: "Approve payment for DesignCo consulting invoice (R18,500).",
    assignedTo: "daniel@reified.dev",
    metadata: { documentId: "seed-doc-6", amount: 18500 },
    createdDaysAgo: 3,
  },
  {
    id: "seed-task-3",
    department: "legal",
    type: "contract_review",
    status: "assigned",
    body: "Review Figma Enterprise license agreement (12-month term).",
    assignedTo: "legal@reified.dev",
    metadata: { documentId: "seed-doc-2" },
    createdDaysAgo: 5,
  },
  {
    id: "seed-task-4",
    department: "legal",
    type: "nda_review",
    status: "completed",
    body: "NDA with Acme Corp — reviewed and approved, sent for signature.",
    assignedTo: "legal@reified.dev",
    metadata: { documentId: "seed-doc-7" },
    createdDaysAgo: 7,
  },
  {
    id: "seed-task-5",
    department: "operations",
    type: "delivery_verification",
    status: "pending",
    body: "Verify MacBook Pro delivery from DHL — signature missing on delivery note.",
    metadata: { documentId: "seed-doc-4" },
    createdDaysAgo: 4,
  },
  {
    id: "seed-task-6",
    department: "operations",
    type: "expense_approval",
    status: "processing",
    body: "Process travel expense claim — Cape Town trip (missing boarding pass).",
    assignedTo: "daniel@reified.dev",
    metadata: { documentId: "seed-doc-9", amount: 2100 },
    createdDaysAgo: 13,
  },
];

async function main() {
  if (!process.env.DYNAMODB_TABLE) {
    process.env.DYNAMODB_TABLE = DEFAULT_TABLE;
    console.log(`(using default DYNAMODB_TABLE=${DEFAULT_TABLE})`);
  }

  console.log(`==> Seeding ${samples.length} tasks into DynamoDB (${process.env.DYNAMODB_TABLE})...`);

  const now = Date.now();

  for (const t of samples) {
    const createdAt = new Date(now - t.createdDaysAgo * 24 * 60 * 60 * 1000).toISOString();
    const updatedAt = new Date().toISOString();

    const task: Task = {
      id: t.id,
      department: t.department,
      traceId: `seed-trace-${t.id}`,
      type: t.type,
      status: t.status,
      assignedTo: t.assignedTo,
      body: t.body,
      messages: [],
      metadata: t.metadata,
      createdAt,
      updatedAt,
    };

    await putTask(task);
    console.log(`  ✓ ${t.id} (${t.department} · ${t.status})`);
  }

  console.log(`==> Done. ${samples.length} tasks seeded.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
