#!/usr/bin/env bun
/**
 * Seeds the intake database with sample documents across all types.
 *
 * Idempotent: each seed doc has a deterministic file_hash like `seed-doc-1`.
 * Re-running updates in place rather than creating duplicates.
 *
 * Requires DATABASE_URL in env (from root .env).
 */
import { db, schema } from "@cometa/db";
import { eq } from "drizzle-orm";

interface SeedDoc {
  hash: string;
  originalName: string;
  description: string;
  type: "invoice" | "receipt" | "contract" | "delivery_note" | "bill";
  status:
    | "processing"
    | "pending"
    | "reviewed"
    | "approved"
    | "rejected"
    | "awaiting_signature";
  aiSummary?: string;
  extractedData?: Record<string, unknown>;
  isFlagged?: boolean;
  flags?: { type: string; message: string }[];
  senderEmail?: string;
  source?: "upload" | "email";
  receivedAt: Date;
  rejectionReason?: string;
}

const samples: SeedDoc[] = [
  {
    hash: "seed-doc-1",
    originalName: "eskom-march-2026.pdf",
    description: "Monthly electricity bill from Eskom for March 2026",
    type: "bill",
    status: "approved",
    aiSummary:
      "Electricity bill for March 2026. Account holder: Reified Studio. Amount due R2,450.00 by 30 April.",
    extractedData: {
      supplier: "Eskom Holdings",
      total: 2450,
      accountNumber: "4501234567",
      dueDate: "2026-04-30",
    },
    senderEmail: "billing@eskom.co.za",
    source: "email",
    receivedAt: new Date("2026-04-15T09:30:00Z"),
  },
  {
    hash: "seed-doc-2",
    originalName: "figma-enterprise-agreement.pdf",
    description: "Software license agreement with Figma Inc",
    type: "contract",
    status: "awaiting_signature",
    aiSummary: "Annual software license agreement for Figma Enterprise. 12-month term starting May 2026.",
    extractedData: {
      counterparty: "Figma Inc",
      effectiveDate: "2026-05-01",
      termMonths: 12,
      value: 4200,
    },
    source: "upload",
    receivedAt: new Date("2026-04-14T14:20:00Z"),
  },
  {
    hash: "seed-doc-3",
    originalName: "takealot-office-supplies.pdf",
    description: "Office supplies purchase from Takealot",
    type: "receipt",
    status: "approved",
    aiSummary: "Office supplies receipt. Ordered via Takealot marketplace.",
    extractedData: {
      supplier: "Takealot",
      total: 1234.56,
      items: "Stationery, printer paper, toner",
    },
    source: "upload",
    receivedAt: new Date("2026-04-13T11:45:00Z"),
  },
  {
    hash: "seed-doc-4",
    originalName: "dhl-macbook-delivery.pdf",
    description: "Delivery of new MacBook Pro units",
    type: "delivery_note",
    status: "pending",
    extractedData: {
      courier: "DHL Express",
      trackingNumber: "DHL-ZA-9876543",
      items: "3x MacBook Pro M4, 1x Magic Keyboard",
    },
    isFlagged: true,
    flags: [{ type: "warning", message: "Missing signature" }],
    senderEmail: "logistics@dhl.com",
    source: "email",
    receivedAt: new Date("2026-04-12T08:00:00Z"),
  },
  {
    hash: "seed-doc-5",
    originalName: "aws-q1-2026-invoice.pdf",
    description: "Q1 2026 tax invoice from AWS",
    type: "invoice",
    status: "approved",
    aiSummary:
      "AWS infrastructure costs for Q1 2026. Includes EC2, S3, Lambda, and CloudFront usage.",
    extractedData: {
      supplier: "Amazon Web Services",
      invoiceNumber: "INV-2026-Q1-4521",
      total: 3847.22,
      dueDate: "2026-05-15",
    },
    senderEmail: "aws-billing@amazon.com",
    source: "email",
    receivedAt: new Date("2026-04-10T16:30:00Z"),
  },
  {
    hash: "seed-doc-6",
    originalName: "designco-consulting.pdf",
    description: "Consulting services invoice from DesignCo",
    type: "invoice",
    status: "pending",
    extractedData: {
      supplier: "DesignCo",
      total: 18500,
      dueDate: "2026-05-10",
    },
    source: "upload",
    receivedAt: new Date("2026-04-10T10:15:00Z"),
  },
  {
    hash: "seed-doc-7",
    originalName: "nda-acme-corp.pdf",
    description: "Non-disclosure agreement with Acme Corp",
    type: "contract",
    status: "awaiting_signature",
    extractedData: {
      counterparty: "Acme Corp",
      effectiveDate: "2026-04-20",
    },
    source: "upload",
    receivedAt: new Date("2026-04-09T13:00:00Z"),
  },
  {
    hash: "seed-doc-8",
    originalName: "vumatel-internet.pdf",
    description: "Monthly internet bill from Vumatel",
    type: "bill",
    status: "approved",
    extractedData: {
      supplier: "Vumatel",
      total: 999,
      accountNumber: "VUM-88821",
    },
    senderEmail: "accounts@vumatel.co.za",
    source: "email",
    receivedAt: new Date("2026-04-08T07:45:00Z"),
  },
  {
    hash: "seed-doc-9",
    originalName: "flysafair-travel.pdf",
    description: "Travel expense receipt — Cape Town trip",
    type: "receipt",
    status: "pending",
    extractedData: {
      supplier: "FlySafair",
      total: 2100,
      route: "JNB → CPT return",
    },
    isFlagged: true,
    flags: [{ type: "warning", message: "Missing boarding pass" }],
    source: "upload",
    receivedAt: new Date("2026-04-03T18:00:00Z"),
  },
  {
    hash: "seed-doc-10",
    originalName: "joburg-water-march.pdf",
    description: "Water & sanitation bill — March 2026",
    type: "bill",
    status: "rejected",
    extractedData: {
      supplier: "City of Johannesburg",
      total: 780,
    },
    flags: [{ type: "warning", message: "Amount mismatch" }],
    rejectionReason: "invalid",
    senderEmail: "accounts@joburg.org.za",
    source: "email",
    receivedAt: new Date("2026-03-28T10:30:00Z"),
  },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("✖ DATABASE_URL is not set. Add it to the root .env file.");
    process.exit(1);
  }

  console.log(`==> Seeding ${samples.length} documents into intake DB...`);

  let created = 0;
  let updated = 0;

  for (const doc of samples) {
    const values = {
      originalName: doc.originalName,
      mimeType: "application/pdf",
      sizeBytes: 102400,
      fileHash: doc.hash,
      s3Url: `https://example.invalid/${doc.hash}.pdf`,
      s3Key: `seed/${doc.hash}.pdf`,
      type: doc.type,
      status: doc.status,
      source: doc.source ?? "upload",
      description: doc.description,
      aiSummary: doc.aiSummary ?? null,
      extractedData: doc.extractedData ?? null,
      isFlagged: doc.isFlagged ?? false,
      flags: doc.flags ?? [],
      senderEmail: doc.senderEmail ?? null,
      rejectionReason: doc.rejectionReason ?? null,
      receivedAt: doc.receivedAt,
    };

    const existing = await db
      .select({ id: schema.documents.id })
      .from(schema.documents)
      .where(eq(schema.documents.fileHash, doc.hash))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(schema.documents)
        .set(values)
        .where(eq(schema.documents.fileHash, doc.hash));
      updated++;
      console.log(`  ↻ updated: ${doc.hash} (${doc.type})`);
    } else {
      await db.insert(schema.documents).values(values);
      created++;
      console.log(`  ✓ created: ${doc.hash} (${doc.type})`);
    }
  }

  console.log(`==> Done. ${created} created, ${updated} updated.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
