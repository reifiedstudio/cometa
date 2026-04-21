#!/usr/bin/env bun
/**
 * Seeds sample notes into the shared services DynamoDB table + S3 content.
 *
 * Each note record lives in DynamoDB with an `s3Key` pointing at an HTML
 * content blob in the notes-content bucket. `queryAllNotes` doesn't filter
 * by user, so seed notes show up for every signed-in user.
 *
 * Idempotent: deterministic IDs + S3 PutObject is upsert.
 *
 * Requires:
 *   - DYNAMODB_TABLE env var (defaults to cometa-dev-services)
 *   - NOTES_BUCKET env var (defaults to cometa-dev-use1-notes-content)
 *   - AWS credentials
 */
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { putNote } from "@cometa/service-core";
import type { Note } from "@cometa/service-core";

const DEFAULT_TABLE = "cometa-dev-services";
const DEFAULT_BUCKET = "cometa-dev-private";
const DEFAULT_PREFIX = "notes/";

interface SeedNote {
  id: string;
  title: string;
  snippet: string;
  body: string;
  template?: string;
  starred?: boolean;
  createdDaysAgo: number;
}

const samples: SeedNote[] = [
  {
    id: "seed-note-1",
    title: "Welcome to Cometa Notes",
    snippet: "Your internal wiki for decisions, specs, and everything in between.",
    body: `<h1>Welcome to Cometa Notes</h1>
<p>This is your internal wiki. Use it for:</p>
<ul>
  <li>Decision records</li>
  <li>Meeting notes</li>
  <li>Specs and RFCs</li>
  <li>Onboarding docs</li>
</ul>
<p>Star notes to keep them at the top of your list.</p>`,
    starred: true,
    createdDaysAgo: 30,
  },
  {
    id: "seed-note-2",
    title: "Q2 2026 Goals",
    snippet: "High-level objectives for April–June: ship signatures v2, launch drive handoffs, 99.9% API uptime.",
    body: `<h1>Q2 2026 Goals</h1>
<h2>Product</h2>
<ul>
  <li>Ship signatures v2 with bulk signing</li>
  <li>Launch drive handoffs for legal and accounting</li>
  <li>MCP App gallery: 10+ apps available</li>
</ul>
<h2>Infra</h2>
<ul>
  <li>99.9% API uptime across all services</li>
  <li>Cut p95 intake processing time by 40%</li>
  <li>Migrate notes to versioned S3 storage</li>
</ul>`,
    createdDaysAgo: 7,
  },
  {
    id: "seed-note-3",
    title: "Incident: intake processing backlog (2026-04-03)",
    snippet: "Root cause: SQS DLQ misconfigured after Terraform apply. Resolved in 47 min.",
    body: `<h1>Incident: intake processing backlog</h1>
<p><strong>Date:</strong> 2026-04-03</p>
<p><strong>Duration:</strong> 47 minutes</p>
<p><strong>Impact:</strong> ~120 documents stuck in "processing" status; no data loss.</p>
<h2>Root cause</h2>
<p>After a Terraform apply, the processing DLQ's redrive policy was reset to default, causing failed messages to be discarded instead of queued for retry.</p>
<h2>Resolution</h2>
<ul>
  <li>Restored redrive policy</li>
  <li>Replayed messages from CloudWatch logs</li>
  <li>Added a monitoring alarm on DLQ message age</li>
</ul>
<h2>Action items</h2>
<ul>
  <li>Lock down DLQ config in Terraform with explicit redrive_policy</li>
  <li>Add integration test that verifies message-retry path</li>
</ul>`,
    createdDaysAgo: 13,
  },
];

function wrapHtml(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif; max-width: 720px; margin: 48px auto; padding: 0 24px; line-height: 1.6; color: #0f172a; }
    h1 { margin-top: 0; }
    h2 { margin-top: 32px; }
    ul { padding-left: 24px; }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

async function main() {
  if (!process.env.DYNAMODB_TABLE) {
    process.env.DYNAMODB_TABLE = DEFAULT_TABLE;
    console.log(`(using default DYNAMODB_TABLE=${DEFAULT_TABLE})`);
  }
  const bucket = process.env.NOTES_BUCKET ?? DEFAULT_BUCKET;
  const notesPrefix = process.env.NOTES_PREFIX ?? DEFAULT_PREFIX;

  const s3 = new S3Client({});
  const now = Date.now();

  console.log(`==> Seeding ${samples.length} notes (DDB=${process.env.DYNAMODB_TABLE}, S3=${bucket})...`);

  for (const n of samples) {
    const createdAt = new Date(now - n.createdDaysAgo * 24 * 60 * 60 * 1000).toISOString();
    const updatedAt = new Date().toISOString();
    const s3Key = `${notesPrefix}seed/${n.id}.html`;

    // Upload HTML content
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: s3Key,
        Body: wrapHtml(n.title, n.body),
        ContentType: "text/html; charset=utf-8",
      }),
    );

    // Write note record
    const note: Note = {
      id: n.id,
      userId: "seed-user-1",
      userEmail: "daniel@reified.dev",
      orgId: "seed-org-1",
      title: n.title,
      snippet: n.snippet,
      s3Key,
      template: n.template,
      starred: n.starred ?? false,
      deleted: false,
      createdAt,
      updatedAt,
    };

    await putNote(note);
    console.log(`  ✓ ${n.id} — ${n.title}`);
  }

  console.log(`==> Done. ${samples.length} notes seeded.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
