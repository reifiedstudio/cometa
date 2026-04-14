import { randomUUID } from "node:crypto";
/**
 * Seed script — populates DynamoDB with sample tasks and messages
 * for testing the UI.
 *
 * Usage: bun run seed
 *   env: DYNAMODB_TABLE (required), AWS_REGION
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const raw = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(raw, {
  marshallOptions: { removeUndefinedValues: true },
});

const TABLE = process.env.DYNAMODB_TABLE;
if (!TABLE) {
  console.error("Set DYNAMODB_TABLE env var");
  process.exit(1);
}

const now = new Date();
const ts = (minutesAgo: number) => new Date(now.getTime() - minutesAgo * 60_000).toISOString();

interface SeedTask {
  id: string;
  task: string;
  traceId: string;
  type: string;
  status: string;
  assignedTo?: string;
  body: string;
  messages: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface SeedMessage {
  id: string;
  traceId: string;
  from: string;
  to: string;
  type: string;
  body: string;
  referenceId?: string;
  status: string;
  userId?: string;
  userEmail?: string;
  timestamp: string;
}

const trace1 = randomUUID();
const trace2 = randomUUID();
const trace3 = randomUUID();
const trace4 = randomUUID();

const msg1 = randomUUID();
const msg2 = randomUUID();
const msg3 = randomUUID();
const msg4 = randomUUID();
const msg5 = randomUUID();
const msg6 = randomUUID();

const task1 = randomUUID();
const task2 = randomUUID();
const task3 = randomUUID();
const task4 = randomUUID();

const tasks: SeedTask[] = [
  {
    id: task1,
    task: "accounting",
    traceId: trace1,
    type: "invoice-approval",
    status: "awaiting_approval",
    assignedTo: "agent",
    body: "Invoice #INV-2024-0892 from Acme Corp for R45,000. New vendor — requires manual approval per policy (amount exceeds R10,000 threshold). PO reference: PO-2024-0341. Payment terms: Net 30.",
    messages: [msg1],
    metadata: { vendor: "Acme Corp", amount: 45000, currency: "ZAR", poNumber: "PO-2024-0341" },
    createdAt: ts(120),
    updatedAt: ts(118),
  },
  {
    id: task2,
    task: "accounting",
    traceId: trace2,
    type: "expense-reimbursement",
    status: "completed",
    assignedTo: "agent",
    body: "Expense reimbursement for Sarah Chen — R2,340 for client dinner at The Table. Receipt attached and verified. Auto-approved (under R5,000 threshold with valid receipt).",
    messages: [msg2, msg3],
    metadata: { employee: "Sarah Chen", amount: 2340, category: "client-entertainment" },
    createdAt: ts(240),
    updatedAt: ts(235),
  },
  {
    id: task3,
    task: "legal",
    traceId: trace3,
    type: "contract-review",
    status: "processing",
    assignedTo: "agent",
    body: "Reviewing SaaS subscription agreement with CloudMetrics Inc. Contract value R180,000/year (3-year term). Flagged non-standard liability clause in section 7.2 — unlimited liability for data breaches. Recommending negotiation.",
    messages: [msg4, msg5],
    metadata: { vendor: "CloudMetrics Inc", annualValue: 180000, term: "3 years" },
    createdAt: ts(60),
    updatedAt: ts(45),
  },
  {
    id: task4,
    task: "legal",
    traceId: trace4,
    type: "compliance-check",
    status: "awaiting_approval",
    assignedTo: "agent",
    body: "POPIA compliance audit flagged: customer data retention policy exceeds 5-year maximum for 3 data categories. Recommend immediate review of retention schedules for marketing, analytics, and support ticket data.",
    messages: [msg6],
    metadata: { regulation: "POPIA", severity: "high", categoriesAffected: 3 },
    createdAt: ts(30),
    updatedAt: ts(25),
  },
];

const messages: SeedMessage[] = [
  {
    id: msg1,
    traceId: trace1,
    from: "gateway",
    to: "accounting",
    type: "task",
    body: "New invoice received from Acme Corp. Amount: R45,000. PO: PO-2024-0341. Please process for approval.",
    referenceId: task1,
    status: "completed",
    userId: "user_abc123",
    userEmail: "daniel@cometa.co",
    timestamp: ts(120),
  },
  {
    id: msg2,
    traceId: trace2,
    from: "gateway",
    to: "accounting",
    type: "task",
    body: "Expense reimbursement request from Sarah Chen for R2,340 — client dinner. Receipt attached.",
    referenceId: task2,
    status: "completed",
    userId: "user_abc123",
    userEmail: "daniel@cometa.co",
    timestamp: ts(240),
  },
  {
    id: msg3,
    traceId: trace2,
    from: "accounting",
    to: "gateway",
    type: "system",
    body: "Expense reimbursement auto-approved. Amount R2,340 is under the R5,000 threshold and receipt is attached. Payment will be processed in the next payroll cycle.",
    referenceId: task2,
    status: "completed",
    timestamp: ts(238),
  },
  {
    id: msg4,
    traceId: trace3,
    from: "accounting",
    to: "legal",
    type: "task",
    body: "Please review the SaaS subscription agreement with CloudMetrics Inc before we proceed with payment. Contract value R180,000/year, 3-year term.",
    referenceId: task3,
    status: "completed",
    timestamp: ts(60),
  },
  {
    id: msg5,
    traceId: trace3,
    from: "legal",
    to: "accounting",
    type: "system",
    body: "Initial review in progress. Found a non-standard unlimited liability clause for data breaches in section 7.2. Will provide full assessment shortly.",
    referenceId: task3,
    status: "completed",
    timestamp: ts(50),
  },
  {
    id: msg6,
    traceId: trace4,
    from: "gateway",
    to: "legal",
    type: "task",
    body: "Run a POPIA compliance check on our current data retention policies across all tasks.",
    referenceId: task4,
    status: "completed",
    userId: "user_abc123",
    userEmail: "daniel@cometa.co",
    timestamp: ts(30),
  },
];

async function seed() {
  console.log(`Seeding DynamoDB table: ${TABLE}\n`);

  // Seed messages
  for (const msg of messages) {
    await ddb.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          PK: `MSG#${msg.id}`,
          SK: `MSG#${msg.id}`,
          GSI1PK: `DEPT#${msg.to}`,
          GSI1SK: `TS#${msg.timestamp}`,
          GSI2PK: `TRACE#${msg.traceId}`,
          GSI2SK: `TS#${msg.timestamp}`,
          entityType: "message",
          ...msg,
        },
      }),
    );
    console.log(`  Message: ${msg.from} → ${msg.to} (${msg.type})`);
  }

  // Seed tasks
  for (const task of tasks) {
    await ddb.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          PK: `TASK#${task.id}`,
          SK: `TASK#${task.id}`,
          GSI1PK: `DEPT#${task.task}`,
          GSI1SK: `STATUS#${task.status}#${task.updatedAt}`,
          GSI2PK: `TRACE#${task.traceId}`,
          GSI2SK: `TASK#${task.createdAt}`,
          entityType: "task",
          ...task,
        },
      }),
    );
    console.log(`  Task: ${task.task}/${task.type} — ${task.status}`);
  }

  console.log(`\nSeeded ${messages.length} messages and ${tasks.length} tasks.`);
  console.log("\nTask summary:");
  console.log("  Accounting: 2 tasks (1 awaiting_approval, 1 completed)");
  console.log("  Legal: 2 tasks (1 processing, 1 awaiting_approval)");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
