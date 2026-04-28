import { randomUUID } from "node:crypto";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

const sigId = `sig_${randomUUID()}`;
const fileId = `sigfile_${randomUUID()}`;
const signer1Id = `signer_${randomUUID()}`;
const signer2Id = `signer_${randomUUID()}`;
const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 14);

await sql.unsafe(
  `INSERT INTO signatures.signature_requests
   (id, status, message, requested_by, requested_by_email, document_hash, expires_at)
   VALUES ($1, 'pending', $2, $3, $4, $5, $6)`,
  [
    sigId,
    "Smoke test NDA",
    "user_smoke",
    "daniel.robert.lourie@gmail.com",
    "abc123def456",
    expiresAt,
  ] as any,
);

await sql.unsafe(
  `INSERT INTO signatures.signature_files
   (id, request_id, s3_key, s3_bucket, original_name, mime_type, size_bytes)
   VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  [
    fileId,
    sigId,
    "signatures/test-nda.pdf",
    "cometa-dev-private",
    "test-nda.pdf",
    "application/pdf",
    102400,
  ] as any,
);

await sql.unsafe(
  `INSERT INTO signatures.signers
   (id, request_id, email, name, token, status, "order")
   VALUES
   ($1, $2, $3, $4, $5, 'pending', 0),
   ($6, $7, $8, $9, $10, 'pending', 1)`,
  [
    signer1Id, sigId, "alice@example.com", "Alice", "tok_alice_" + randomUUID().slice(0, 8),
    signer2Id, sigId, "bob@example.com", "Bob", "tok_bob_" + randomUUID().slice(0, 8),
  ] as any,
);

console.log(`Seeded signature request: ${sigId}`);
console.log(`  file: ${fileId}`);
console.log(`  signers: ${signer1Id}, ${signer2Id}`);

await sql.end({ timeout: 5 });
