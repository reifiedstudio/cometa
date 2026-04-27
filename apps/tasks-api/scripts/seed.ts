#!/usr/bin/env bun
/**
 * Seeds sample tasks and messages into the shared services DynamoDB table.
 * Idempotent — uses deterministic IDs.
 */
import { putTask, putMessage } from "@cometa/service-core";
import type { Task, ServiceMessage } from "@cometa/service-core";

const DEFAULT_TABLE = "cometa-dev-services";

interface SeedTask {
  id: string;
  department: string;
  type: string;
  status: Task["status"];
  body: string;
  assignedTo?: string;
  metadata?: Record<string, unknown>;
  createdDaysAgo: number;
}

interface SeedMessage {
  id: string;
  traceId: string;
  from: string;
  to: string;
  type: ServiceMessage["type"];
  body: string;
  referenceId?: string;
  data?: Record<string, unknown>;
  status: ServiceMessage["status"];
  hoursAgo: number;
}

const tasks: SeedTask[] = [
  // ── Accounting ──
  {
    id: "seed-task-1",
    department: "accounting",
    type: "invoice_review",
    status: "open",
    body: "Review Q1 AWS invoice — verify line items against contract.",
    metadata: { documentId: "seed-doc-5", amount: 3847.22, currency: "USD" },
    createdDaysAgo: 2,
  },
  {
    id: "seed-task-2",
    department: "accounting",
    type: "payment_approval",
    status: "review",
    body: "Approve payment for DesignCo consulting invoice (R18,500). Services rendered: UI/UX design for client portal, March 2026.",
    assignedTo: "daniel@reified.dev",
    metadata: { documentId: "seed-doc-6", amount: 18500, currency: "ZAR" },
    createdDaysAgo: 3,
  },
  {
    id: "seed-task-7",
    department: "accounting",
    type: "expense_reconciliation",
    status: "in_progress",
    body: "Reconcile March 2026 credit card statement — 47 transactions, R62,340 total.",
    assignedTo: "agent",
    metadata: { transactionCount: 47, totalAmount: 62340 },
    createdDaysAgo: 1,
  },
  {
    id: "seed-task-8",
    department: "accounting",
    type: "tax_filing",
    status: "done",
    body: "Prepare provisional tax return for Q1 2026.",
    assignedTo: "daniel@reified.dev",
    metadata: { period: "Q1 2026", filingDate: "2026-04-15" },
    createdDaysAgo: 10,
  },

  // ── Legal ──
  {
    id: "seed-task-3",
    department: "legal",
    type: "contract_review",
    status: "in_progress",
    body: "Review Figma Enterprise license agreement (12-month term). Check auto-renewal clause and data processing terms.",
    assignedTo: "legal@reified.dev",
    metadata: { documentId: "seed-doc-2", vendor: "Figma Inc", termMonths: 12 },
    createdDaysAgo: 5,
  },
  {
    id: "seed-task-4",
    department: "legal",
    type: "nda_review",
    status: "done",
    body: "NDA with Acme Corp — reviewed and approved, sent for signature.",
    assignedTo: "legal@reified.dev",
    metadata: { documentId: "seed-doc-7", counterparty: "Acme Corp" },
    createdDaysAgo: 7,
  },
  {
    id: "seed-task-9",
    department: "legal",
    type: "compliance_check",
    status: "review",
    body: "POPIA compliance audit for customer data handling — agent flagged 3 issues that need human review.",
    assignedTo: "legal@reified.dev",
    metadata: { issueCount: 3, regulation: "POPIA" },
    createdDaysAgo: 2,
  },

  // ── Operations ──
  {
    id: "seed-task-5",
    department: "operations",
    type: "delivery_verification",
    status: "open",
    body: "Verify MacBook Pro delivery from DHL — signature missing on delivery note.",
    metadata: { documentId: "seed-doc-4", carrier: "DHL", trackingNumber: "ZA2026041234" },
    createdDaysAgo: 4,
  },
  {
    id: "seed-task-6",
    department: "operations",
    type: "expense_approval",
    status: "in_progress",
    body: "Process travel expense claim — Cape Town client meeting (flights, hotel, transport). Missing boarding pass for return flight.",
    assignedTo: "daniel@reified.dev",
    metadata: { documentId: "seed-doc-9", amount: 2100, currency: "ZAR", tripDate: "2026-04-10" },
    createdDaysAgo: 13,
  },
  {
    id: "seed-task-10",
    department: "operations",
    type: "vendor_onboarding",
    status: "open",
    body: "Onboard new cleaning service provider — verify BEE certificate, insurance, and bank details.",
    metadata: { vendorName: "CleanCo Services", requiredDocs: ["BEE cert", "insurance", "bank confirmation"] },
    createdDaysAgo: 1,
  },

  // ── HR ──
  {
    id: "seed-task-11",
    department: "hr",
    type: "leave_request",
    status: "review",
    body: "Annual leave request: Sarah Chen, 5–9 May 2026 (5 days). Balance: 12 days remaining.",
    assignedTo: "daniel@reified.dev",
    metadata: { employee: "Sarah Chen", startDate: "2026-05-05", endDate: "2026-05-09", days: 5 },
    createdDaysAgo: 1,
  },
  {
    id: "seed-task-12",
    department: "hr",
    type: "onboarding",
    status: "in_progress",
    body: "New employee onboarding: James Park, Software Engineer, starts 1 May 2026. Set up accounts, equipment, and induction schedule.",
    assignedTo: "agent",
    metadata: { employee: "James Park", role: "Software Engineer", startDate: "2026-05-01" },
    createdDaysAgo: 3,
  },
];

const messages: SeedMessage[] = [
  // ── DesignCo payment approval (seed-task-2) — rich thread ──
  {
    id: "seed-msg-1",
    traceId: "seed-trace-seed-task-2",
    from: "gateway",
    to: "accounting",
    type: "message",
    body: "Please review and approve payment for DesignCo consulting invoice. Amount: R18,500 for UI/UX design services rendered in March 2026.",
    referenceId: "seed-task-2",
    status: "done",
    hoursAgo: 72,
  },
  {
    id: "seed-msg-2",
    traceId: "seed-trace-seed-task-2",
    from: "agent",
    to: "accounting",
    type: "document",
    body: "Found matching invoice in intake.",
    referenceId: "seed-task-2",
    data: { documentId: "seed-doc-6", documentName: "DesignCo Invoice INV-2026-031", documentType: "invoice" },
    status: "done",
    hoursAgo: 71,
  },
  {
    id: "seed-msg-3",
    traceId: "seed-trace-seed-task-2",
    from: "agent",
    to: "accounting",
    type: "message",
    body: "Invoice verified against purchase order PO-2026-0142. Amounts match. Vendor bank details confirmed on file. Flagging for human approval — amount exceeds R10,000 auto-approval threshold.",
    referenceId: "seed-task-2",
    status: "done",
    hoursAgo: 71,
  },
  {
    id: "seed-msg-4",
    traceId: "seed-trace-seed-task-2",
    from: "agent",
    to: "accounting",
    type: "task",
    body: "Requested legal to confirm the consulting agreement is still active.",
    referenceId: "seed-task-2",
    data: { linkedTaskId: "seed-task-3", linkedDepartment: "legal", linkedTaskStatus: "assigned" },
    status: "done",
    hoursAgo: 70,
  },
  {
    id: "seed-msg-5",
    traceId: "seed-trace-seed-task-2",
    from: "agent",
    to: "accounting",
    type: "approval",
    body: "All checks passed. Ready for approval.",
    referenceId: "seed-task-2",
    data: { decision: undefined },
    status: "done",
    hoursAgo: 69,
  },

  // ── Figma contract review (seed-task-3) ──
  {
    id: "seed-msg-6",
    traceId: "seed-trace-seed-task-3",
    from: "gateway",
    to: "legal",
    type: "message",
    body: "Review the Figma Enterprise license agreement. Pay attention to auto-renewal, data processing, and liability clauses.",
    referenceId: "seed-task-3",
    status: "done",
    hoursAgo: 120,
  },
  {
    id: "seed-msg-7",
    traceId: "seed-trace-seed-task-3",
    from: "agent",
    to: "legal",
    type: "document",
    body: "Attached the Figma license agreement for review.",
    referenceId: "seed-task-3",
    data: { documentId: "seed-doc-2", documentName: "Figma Enterprise License Agreement", documentType: "contract" },
    status: "done",
    hoursAgo: 119,
  },
  {
    id: "seed-msg-8",
    traceId: "seed-trace-seed-task-3",
    from: "agent",
    to: "legal",
    type: "message",
    body: "Initial review complete. Found 2 concerns:\n\n1. Auto-renewal with 90-day notice period — recommend reducing to 30 days\n2. Data processing addendum references US jurisdiction — should specify SA/POPIA compliance\n\nAssigned to legal@reified.dev for final review.",
    referenceId: "seed-task-3",
    status: "done",
    hoursAgo: 118,
  },

  // ── POPIA compliance (seed-task-9) ──
  {
    id: "seed-msg-9",
    traceId: "seed-trace-seed-task-9",
    from: "gateway",
    to: "legal",
    type: "message",
    body: "Run a POPIA compliance check on our customer data handling processes.",
    referenceId: "seed-task-9",
    status: "done",
    hoursAgo: 48,
  },
  {
    id: "seed-msg-10",
    traceId: "seed-trace-seed-task-9",
    from: "agent",
    to: "legal",
    type: "message",
    body: "Audit complete. 3 issues found:\n\n1. Customer email addresses stored without explicit consent record\n2. Data retention policy not documented for inactive accounts\n3. Third-party data processor (Resend) not listed in privacy policy\n\nRecommend human review before remediation.",
    referenceId: "seed-task-9",
    status: "done",
    hoursAgo: 47,
  },
  {
    id: "seed-msg-11",
    traceId: "seed-trace-seed-task-9",
    from: "agent",
    to: "legal",
    type: "approval",
    body: "3 compliance issues require human decision. Please review and approve remediation plan.",
    referenceId: "seed-task-9",
    data: { decision: undefined },
    status: "done",
    hoursAgo: 46,
  },

  // ── Leave request (seed-task-11) ──
  {
    id: "seed-msg-12",
    traceId: "seed-trace-seed-task-11",
    from: "gateway",
    to: "hr",
    type: "message",
    body: "Sarah Chen has requested annual leave from 5–9 May 2026 (5 working days).",
    referenceId: "seed-task-11",
    status: "done",
    hoursAgo: 24,
  },
  {
    id: "seed-msg-13",
    traceId: "seed-trace-seed-task-11",
    from: "agent",
    to: "hr",
    type: "message",
    body: "Leave balance verified: Sarah has 12 days remaining. No conflicting leave in the team for that period. No critical deadlines affected. Recommending approval.",
    referenceId: "seed-task-11",
    status: "done",
    hoursAgo: 23,
  },
  {
    id: "seed-msg-14",
    traceId: "seed-trace-seed-task-11",
    from: "agent",
    to: "hr",
    type: "approval",
    body: "Leave request ready for manager approval.",
    referenceId: "seed-task-11",
    data: { decision: undefined },
    status: "done",
    hoursAgo: 23,
  },

  // ── Onboarding (seed-task-12) ──
  {
    id: "seed-msg-15",
    traceId: "seed-trace-seed-task-12",
    from: "gateway",
    to: "hr",
    type: "message",
    body: "New employee starting 1 May: James Park, Software Engineer. Please set up onboarding.",
    referenceId: "seed-task-12",
    status: "done",
    hoursAgo: 72,
  },
  {
    id: "seed-msg-16",
    traceId: "seed-trace-seed-task-12",
    from: "agent",
    to: "hr",
    type: "system",
    body: "Onboarding checklist created. Processing: email account, Slack invite, equipment order.",
    referenceId: "seed-task-12",
    status: "done",
    hoursAgo: 71,
  },
  {
    id: "seed-msg-17",
    traceId: "seed-trace-seed-task-12",
    from: "agent",
    to: "hr",
    type: "task",
    body: "Requested operations to order a MacBook Pro for the new hire.",
    referenceId: "seed-task-12",
    data: { linkedTaskId: "seed-task-5", linkedDepartment: "operations", linkedTaskStatus: "pending" },
    status: "done",
    hoursAgo: 70,
  },
  {
    id: "seed-msg-18",
    traceId: "seed-trace-seed-task-12",
    from: "agent",
    to: "hr",
    type: "message",
    body: "Email account created: james.park@cometa.co. Slack invite sent. Awaiting equipment delivery from operations.",
    referenceId: "seed-task-12",
    status: "done",
    hoursAgo: 69,
  },
];

async function main() {
  if (!process.env.DYNAMODB_TABLE) {
    process.env.DYNAMODB_TABLE = DEFAULT_TABLE;
    console.log(`(using default DYNAMODB_TABLE=${DEFAULT_TABLE})`);
  }

  console.log(`==> Seeding ${tasks.length} tasks into DynamoDB (${process.env.DYNAMODB_TABLE})...`);

  const now = Date.now();

  for (const t of tasks) {
    const createdAt = new Date(now - t.createdDaysAgo * 24 * 60 * 60 * 1000).toISOString();

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
      updatedAt: createdAt,
    };

    await putTask(task);
    console.log(`  ✓ ${t.id} (${t.department} · ${t.status})`);
  }

  console.log(`\n==> Seeding ${messages.length} messages...`);

  for (const m of messages) {
    const timestamp = new Date(now - m.hoursAgo * 60 * 60 * 1000).toISOString();

    const msg: ServiceMessage = {
      id: m.id,
      traceId: m.traceId,
      from: m.from,
      to: m.to,
      type: m.type,
      body: m.body,
      referenceId: m.referenceId,
      data: m.data,
      status: m.status,
      timestamp,
    };

    await putMessage(msg);
    console.log(`  ✓ ${m.id} (${m.from} → ${m.to})`);
  }

  console.log(`\n==> Done. ${tasks.length} tasks + ${messages.length} messages seeded.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
