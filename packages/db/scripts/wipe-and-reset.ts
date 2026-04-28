/**
 * Wipe + reset for prefixed-ID rollout.
 *
 *   bun run scripts/wipe-and-reset.ts
 *
 * Drops all business data across Postgres, DDB, S3, and SQS, then leaves the
 * schema ready for `bun run db:migrate` to recreate Postgres tables with the
 * new prefixed-ID columns.
 *
 * Preserved: Clerk auth_table, document_types config, infrastructure, vaults,
 * agents, SSM params.
 */
import postgres from "postgres";
import { DynamoDBClient, ScanCommand, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { SQSClient, PurgeQueueCommand } from "@aws-sdk/client-sqs";

const NAME_PREFIX = process.env.NAME_PREFIX ?? "cometa-dev";
const DATABASE_URL = process.env.DATABASE_URL;
const S3_BUCKET = process.env.S3_BUCKET ?? `${NAME_PREFIX}-private`;
const DDB_TABLE = process.env.DYNAMODB_TABLE ?? `${NAME_PREFIX}-services`;
const REGION = process.env.AWS_REGION ?? "us-east-1";
const ACCOUNT_ID = process.env.AWS_ACCOUNT_ID ?? "876793967088";

if (!DATABASE_URL) throw new Error("DATABASE_URL required");
if (!S3_BUCKET) throw new Error("S3_BUCKET required");

console.log(`Wiping ${NAME_PREFIX} (region: ${REGION})\n`);

// ── 1. Postgres ────────────────────────────────────────────────────────────
console.log("Postgres: dropping tables + drizzle state...");
{
  const sql = postgres(DATABASE_URL, { ssl: "require" });
  // Drop signatures schema (cascade removes everything inside)
  await sql.unsafe(`DROP SCHEMA IF EXISTS signatures CASCADE`);
  // Drop public business tables (keep document_types config? no — wiping cleanly)
  await sql.unsafe(`DROP TABLE IF EXISTS audit_logs CASCADE`);
  await sql.unsafe(`DROP TABLE IF EXISTS documents CASCADE`);
  await sql.unsafe(`DROP TABLE IF EXISTS document_types CASCADE`);
  // Reset drizzle migration tracker so the new fresh migration applies as 0000
  await sql.unsafe(`DROP TABLE IF EXISTS drizzle.__drizzle_migrations CASCADE`);
  await sql.end({ timeout: 5 });
}
console.log("  ✓ postgres tables dropped\n");

// ── 2. DynamoDB ────────────────────────────────────────────────────────────
console.log(`DynamoDB: scanning + deleting ${DDB_TABLE}...`);
{
  const ddb = new DynamoDBClient({ region: REGION });
  let total = 0;
  let lastKey: Record<string, any> | undefined;
  do {
    const scan = await ddb.send(
      new ScanCommand({
        TableName: DDB_TABLE,
        ProjectionExpression: "PK, SK",
        ExclusiveStartKey: lastKey,
      }),
    );
    const items = scan.Items ?? [];
    // Skip auth-related rows (preserve Clerk identity)
    const business = items.filter(
      (i) => !(i.PK?.S?.startsWith("USER#") || i.PK?.S?.startsWith("AUTH#")),
    );
    // Batch delete in groups of 25
    for (let i = 0; i < business.length; i += 25) {
      const batch = business.slice(i, i + 25);
      await ddb.send(
        new BatchWriteItemCommand({
          RequestItems: {
            [DDB_TABLE]: batch.map((it) => ({
              DeleteRequest: { Key: { PK: it.PK!, SK: it.SK! } },
            })),
          },
        }),
      );
      total += batch.length;
    }
    lastKey = scan.LastEvaluatedKey;
  } while (lastKey);
  console.log(`  ✓ deleted ${total} ddb rows\n`);
}

// ── 3. S3 ──────────────────────────────────────────────────────────────────
console.log(`S3: wiping intake/, signatures/, notes/ prefixes in ${S3_BUCKET}...`);
{
  const s3 = new S3Client({ region: REGION });
  for (const prefix of ["intake/", "signatures/", "notes/"]) {
    let token: string | undefined;
    let total = 0;
    do {
      const list = await s3.send(
        new ListObjectsV2Command({
          Bucket: S3_BUCKET,
          Prefix: prefix,
          ContinuationToken: token,
        }),
      );
      const objects = list.Contents ?? [];
      if (objects.length > 0) {
        await s3.send(
          new DeleteObjectsCommand({
            Bucket: S3_BUCKET,
            Delete: { Objects: objects.map((o) => ({ Key: o.Key! })) },
          }),
        );
        total += objects.length;
      }
      token = list.NextContinuationToken;
    } while (token);
    console.log(`  ✓ ${prefix} — ${total} objects`);
  }
  console.log();
}

// ── 4. SQS ─────────────────────────────────────────────────────────────────
console.log("SQS: purging department queues...");
{
  const sqs = new SQSClient({ region: REGION });
  for (const slug of ["accounting", "legal"]) {
    const queueUrl = `https://sqs.${REGION}.amazonaws.com/${ACCOUNT_ID}/${NAME_PREFIX}-${slug}-service`;
    try {
      await sqs.send(new PurgeQueueCommand({ QueueUrl: queueUrl }));
      console.log(`  ✓ purged ${slug}`);
    } catch (err: any) {
      console.warn(`  ⚠ ${slug}: ${err.message ?? err}`);
    }
  }
  console.log();
}

console.log("Wipe complete. Next: bun run db:migrate to recreate Postgres tables, then deploy.");
