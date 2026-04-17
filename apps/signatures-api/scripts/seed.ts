#!/usr/bin/env bun
/**
 * Seeds the signatures schema with sample requests + signers.
 *
 * Idempotent: each seed request has a deterministic documentHash like
 * `seed-sig-1`. Re-running updates in place.
 */
import { db, schema } from "@cometa/db";
import { eq } from "drizzle-orm";

interface SeedSigner {
  email: string;
  name: string;
  status: "pending" | "viewed" | "signed";
  order: number;
}

interface SeedRequest {
  docHash: string;
  sourceRef: string;
  status: "pending" | "partially_signed" | "completed";
  message: string;
  requestedBy: string;
  requestedByEmail: string;
  signers: SeedSigner[];
  expiresInDays: number;
}

const samples: SeedRequest[] = [
  {
    docHash: "seed-sig-1",
    sourceRef: "seed-doc-2",
    status: "partially_signed",
    message: "Please review and sign the Figma Enterprise agreement.",
    requestedBy: "user-seed-1",
    requestedByEmail: "daniel@reified.dev",
    signers: [
      { email: "sarah@figma.com", name: "Sarah Chen", status: "signed", order: 0 },
      { email: "james@reified.dev", name: "James Park", status: "pending", order: 1 },
      { email: "legal@reified.dev", name: "Legal Team", status: "pending", order: 2 },
    ],
    expiresInDays: 14,
  },
  {
    docHash: "seed-sig-2",
    sourceRef: "seed-doc-7",
    status: "pending",
    message: "NDA with Acme Corp — please sign.",
    requestedBy: "user-seed-1",
    requestedByEmail: "daniel@reified.dev",
    signers: [
      { email: "ceo@acme.com", name: "Acme CEO", status: "pending", order: 0 },
      { email: "james@reified.dev", name: "James Park", status: "pending", order: 1 },
    ],
    expiresInDays: 10,
  },
  {
    docHash: "seed-sig-3",
    sourceRef: "seed-lease-1",
    status: "completed",
    message: "Office lease renewal for 2026.",
    requestedBy: "user-seed-1",
    requestedByEmail: "daniel@reified.dev",
    signers: [
      { email: "landlord@propco.co.za", name: "Jane Landlord", status: "signed", order: 0 },
      { email: "daniel@reified.dev", name: "Daniel Lourie", status: "signed", order: 1 },
    ],
    expiresInDays: 30,
  },
];

function randomToken(prefix: string, i: number): string {
  return `seed-token-${prefix}-${i}-${Math.random().toString(36).slice(2, 10)}`;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("✖ DATABASE_URL is not set. Add it to the root .env file.");
    process.exit(1);
  }

  console.log(`==> Seeding ${samples.length} signature requests...`);

  let created = 0;
  let updated = 0;

  for (const req of samples) {
    const expiresAt = new Date(Date.now() + req.expiresInDays * 24 * 60 * 60 * 1000);

    const requestValues = {
      sourceRef: req.sourceRef,
      status: req.status,
      message: req.message,
      requestedBy: req.requestedBy,
      requestedByEmail: req.requestedByEmail,
      documentHash: req.docHash,
      expiresAt,
    };

    const existing = await db
      .select({ id: schema.signatureRequests.id })
      .from(schema.signatureRequests)
      .where(eq(schema.signatureRequests.documentHash, req.docHash))
      .limit(1);

    let requestId: string;

    if (existing.length > 0) {
      requestId = existing[0].id;
      await db
        .update(schema.signatureRequests)
        .set(requestValues)
        .where(eq(schema.signatureRequests.id, requestId));

      // Clear old signers for this request so we can re-insert the seed set cleanly
      await db.delete(schema.signers).where(eq(schema.signers.requestId, requestId));
      updated++;
      console.log(`  ↻ updated: ${req.docHash} (${req.status})`);
    } else {
      const inserted = await db
        .insert(schema.signatureRequests)
        .values(requestValues)
        .returning({ id: schema.signatureRequests.id });
      requestId = inserted[0].id;
      created++;
      console.log(`  ✓ created: ${req.docHash} (${req.status})`);
    }

    // Insert signers
    for (let i = 0; i < req.signers.length; i++) {
      const s = req.signers[i];
      await db.insert(schema.signers).values({
        requestId,
        email: s.email,
        name: s.name,
        token: randomToken(req.docHash, i),
        status: s.status,
        order: s.order,
        signedAt: s.status === "signed" ? new Date() : null,
      });
    }
  }

  console.log(`==> Done. ${created} created, ${updated} updated.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
