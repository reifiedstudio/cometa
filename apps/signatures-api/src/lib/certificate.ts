import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { db, schema } from "@cometa/db";
import { eq } from "drizzle-orm";

const s3 = new S3Client({});
const BUCKET = process.env.S3_BUCKET ?? "";
const PDF_CONVERTER_URL = process.env.PDF_CONVERTER_URL ?? "";

interface CertificateData {
  requestId: string;
  documentName: string;
  documentHash: string;
  requestedBy: string;
  requestedByEmail: string;
  completedAt: string;
  signers: Array<{
    name: string;
    email: string;
    signedAt: string;
    ipAddress: string;
    signatureHash: string;
  }>;
}

function generateCertificateHtml(data: CertificateData): string {
  const signerRows = data.signers
    .map(
      (s) => `
      <tr>
        <td>${esc(s.name)}</td>
        <td>${esc(s.email)}</td>
        <td>${new Date(s.signedAt).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}</td>
        <td>${esc(s.ipAddress)}</td>
        <td class="hash">${esc(s.signatureHash.slice(0, 16))}...</td>
      </tr>`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Signing Certificate — ${esc(data.documentName)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #212327;
      max-width: 800px;
      margin: 0 auto;
      padding: 2.5rem 2rem;
      font-size: 13px;
      line-height: 1.6;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #EBEEF1;
      padding-bottom: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .logo { font-size: 0.875rem; font-weight: 700; color: #212327; }
    .badge {
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #16a34a;
      border: 1px solid #bbf7d0;
      border-radius: 4px;
      padding: 0.125rem 0.5rem;
      background: #f0fdf4;
    }

    h1 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem; }
    .subtitle { font-size: 0.8125rem; color: #717983; margin-bottom: 2rem; }

    .section-title {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #717983;
      margin-bottom: 0.75rem;
      margin-top: 1.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .info-item label {
      font-size: 0.6875rem;
      color: #717983;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .info-item p {
      font-size: 0.8125rem;
      color: #212327;
      font-weight: 500;
      margin-top: 0.125rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.5rem 0 1.5rem;
    }
    th {
      text-align: left;
      padding: 0.5rem 0.625rem;
      border-bottom: 1px solid #EBEEF1;
      font-weight: 500;
      color: #717983;
      font-size: 0.6875rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    td {
      padding: 0.5rem 0.625rem;
      border-bottom: 1px solid #F3F4F6;
      color: #555A65;
      font-size: 0.8125rem;
    }
    .hash {
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 0.75rem;
      color: #717983;
    }

    .document-hash {
      background: #F8F8FA;
      border: 1px solid #EBEEF1;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      margin: 0.5rem 0 1.5rem;
    }
    .document-hash label {
      font-size: 0.6875rem;
      color: #717983;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .document-hash p {
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 0.75rem;
      color: #212327;
      word-break: break-all;
      margin-top: 0.25rem;
    }

    .footer {
      border-top: 1px solid #EBEEF1;
      margin-top: 2rem;
      padding-top: 1rem;
      font-size: 0.6875rem;
      color: #717983;
    }
    .footer p { margin-bottom: 0.25rem; }

    @media print {
      body { max-width: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Cometa</div>
    <div class="badge">Completed</div>
  </div>

  <h1>Signing Certificate</h1>
  <p class="subtitle">${esc(data.documentName)}</p>

  <div class="section-title">Document Details</div>
  <div class="info-grid">
    <div class="info-item">
      <label>Requested By</label>
      <p>${esc(data.requestedByEmail)}</p>
    </div>
    <div class="info-item">
      <label>Completed</label>
      <p>${new Date(data.completedAt).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}</p>
    </div>
    <div class="info-item">
      <label>Request ID</label>
      <p class="hash">${esc(data.requestId)}</p>
    </div>
    <div class="info-item">
      <label>Signers</label>
      <p>${data.signers.length}</p>
    </div>
  </div>

  <div class="document-hash">
    <label>Document Hash (SHA-256)</label>
    <p>${esc(data.documentHash)}</p>
  </div>

  <div class="section-title">Signatures</div>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Signed</th>
        <th>IP Address</th>
        <th>Signature Hash</th>
      </tr>
    </thead>
    <tbody>
      ${signerRows}
    </tbody>
  </table>

  <div class="footer">
    <p>This certificate confirms that all parties electronically signed the document referenced above.</p>
    <p>Each signature hash is computed as SHA-256(document_hash | email | name | timestamp | ip_address).</p>
    <p>This electronic signature is valid under the Electronic Communications and Transactions Act 25 of 2002 (ECTA).</p>
  </div>
</body>
</html>`;
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Generate a signing certificate PDF and store it in S3.
 * Called when all signers have completed.
 */
export async function generateCertificate(requestId: string): Promise<string | null> {
  const [request] = await db
    .select()
    .from(schema.signatureRequests)
    .where(eq(schema.signatureRequests.id, requestId))
    .limit(1);

  if (!request) return null;

  const files = await db
    .select()
    .from(schema.signatureFiles)
    .where(eq(schema.signatureFiles.requestId, requestId))
    .limit(1);

  const signers = await db
    .select()
    .from(schema.signers)
    .where(eq(schema.signers.requestId, requestId));

  const documentName = files[0]?.originalName ?? "Document";

  const html = generateCertificateHtml({
    requestId: request.id,
    documentName,
    documentHash: request.documentHash,
    requestedBy: request.requestedBy,
    requestedByEmail: request.requestedByEmail,
    completedAt: new Date().toISOString(),
    signers: signers.map((s) => ({
      name: s.name ?? s.email,
      email: s.email,
      signedAt: s.signedAt?.toISOString() ?? "",
      ipAddress: s.ipAddress ?? "unknown",
      signatureHash: s.signatureHash ?? "",
    })),
  });

  // Convert to PDF
  if (!PDF_CONVERTER_URL) {
    console.warn("[certificate] No PDF_CONVERTER_URL configured, skipping certificate generation");
    return null;
  }

  try {
    const res = await fetch(PDF_CONVERTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, filename: `certificate-${requestId}` }),
    });

    if (!res.ok) {
      console.error("[certificate] PDF conversion failed:", await res.text());
      return null;
    }

    const pdfBuffer = Buffer.from(await res.arrayBuffer());
    const s3Key = `signatures/certificates/${requestId}.pdf`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      }),
    );

    // Store the certificate key on the request
    await db
      .update(schema.signatureRequests)
      .set({ certificateKey: s3Key, updatedAt: new Date() })
      .where(eq(schema.signatureRequests.id, requestId));

    console.log(`[certificate] Generated for request ${requestId}: ${s3Key}`);
    return s3Key;
  } catch (err) {
    console.error("[certificate] Failed to generate:", err);
    return null;
  }
}
