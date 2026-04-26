import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { exportDocumentToHtml } from "@cometa/renderer";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { randomBytes } from "node:crypto";
import { z } from "zod";

const s3 = new S3Client({});
const UTILITIES_BUCKET = process.env["UTILITIES_BUCKET"] ?? "cometa-dev-use1-notes-content";
const ASSETS_CDN_URL = process.env["ASSETS_CDN_URL"] ?? "https://assets.daniellourie.me";

async function htmlToPdf(html: string, filename: string) {
  const converterUrl = process.env["PDF_CONVERTER_URL"];
  if (!converterUrl) throw new Error("PDF converter service not configured.");

  const res = await fetch(converterUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html, filename }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`PDF conversion failed (${res.status}): ${errText}`);
  }

  const pdfBuffer = Buffer.from(await res.arrayBuffer());
  const pdfFilename = `${filename}.pdf`;

  const token = randomBytes(32).toString("hex");
  const s3Key = `pdfs/${token}/${pdfFilename}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: UTILITIES_BUCKET,
      Key: s3Key,
      Body: pdfBuffer,
      ContentType: "application/pdf",
      ContentDisposition: `attachment; filename="${pdfFilename}"`,
    }),
  );

  const downloadUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: UTILITIES_BUCKET, Key: s3Key }),
    { expiresIn: 86400 },
  );

  const sizeKB = Math.round(pdfBuffer.byteLength / 1024);
  return { downloadUrl, pdfFilename, sizeKB, s3Key, s3Bucket: UTILITIES_BUCKET };
}

export function registerUtilitiesTools(server: McpServer): void {
  server.tool(
    "create_branded_document",
    `Create a professional branded PDF document with company letterhead, footer, and optional signature blocks. Returns a download link.

Use this when the user wants to create formal business documents: contracts, service agreements, NDAs, proposals, invoices, letters, or any document that needs company branding.

The content field accepts GitHub-Flavored Markdown (headings, tables, lists, bold/italic, etc).

Before calling, ask the user:
1. What type of document (contract, NDA, invoice, proposal, letter, etc.)
2. The document content / key terms
3. How many signers and their details (name, role, company)
4. Whether it should be marked confidential

Company details (logo, registration, VAT) are applied automatically.

IMPORTANT: The tool response includes a preview card image in markdown format. You MUST include this image in your reply to the user exactly as provided — it shows a branded card for the document type. Always render it above the download link.`,
    {
      title: z.string().describe("Document title (e.g. 'Service Agreement', 'Non-Disclosure Agreement')"),
      type: z.enum(["contract", "nda", "invoice", "proposal", "letter", "agreement"]).optional().describe("Document type — determines the preview card style"),
      content: z.string().describe("Document body as markdown. Structure with numbered sections (## 1. Services, ## 2. Term, etc.)"),
      filename: z.string().optional().describe("PDF filename without extension (e.g. 'service-agreement-2026'). Defaults to slugified title."),
      reference: z.string().optional().describe("Document reference number (e.g. 'SA-2026-0042')"),
      date: z.string().optional().describe("Document date (e.g. '14 April 2026')"),
      signers: z
        .array(
          z.object({
            name: z.string().describe("Full name"),
            role: z.string().optional().describe("Role/title (e.g. 'Director', 'Client')"),
            company: z.string().optional().describe("Company name"),
            email: z.string().optional().describe("Email address"),
          }),
        )
        .optional()
        .describe("People who need to sign this document"),
      confidential: z.boolean().optional().describe("Mark document as confidential"),
    },
    async ({ title, type, content, filename, reference, date, signers, confidential }) => {
      try {
        // TODO: load company details from org profile
        const company = {
          name: "Cometa",
          logo: `${ASSETS_CDN_URL}/brand/cometa-wordmark.svg`,
          registrationNumber: "2024/123456/07",
          vatNumber: "4012345678",
          address: "123 Main Road, Cape Town, 8001",
          email: "hello@cometa.co",
          website: "cometa.co",
        };

        const html = exportDocumentToHtml({
          title,
          markdown: content,
          company,
          reference,
          date:
            date ??
            new Date().toLocaleDateString("en-ZA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          signers: signers ?? [],
          confidential: confidential ?? false,
        });

        const slug = filename ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const pdf = await htmlToPdf(html, slug);

        const signerCount = signers?.length ?? 0;
        const cardType = type ?? "document";

        // Structured data for the MCP App view to render
        const viewData = JSON.stringify({
          title,
          type: cardType,
          filename: pdf.pdfFilename,
          sizeKB: pdf.sizeKB,
          downloadUrl: pdf.downloadUrl,
          reference,
          signerCount,
          confidential: confidential ?? false,
        });

        return {
          content: [
            {
              type: "text" as const,
              text: `Created branded PDF: **${pdf.pdfFilename}** (${pdf.sizeKB} KB)\n\nTitle: ${title}${reference ? `\nRef: ${reference}` : ""}${signerCount > 0 ? `\nSigners: ${signerCount}` : ""}${confidential ? "\nMarked confidential" : ""}\n\n[Download PDF](${pdf.downloadUrl})\n\nThis link expires in 24 hours.\n\nTo send this for signing, use request_signature with fileS3Key="${pdf.s3Key}" and fileS3Bucket="${pdf.s3Bucket}".`,
            },
            {
              type: "text" as const,
              text: viewData,
            },
          ],
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text" as const, text: `Document error: ${msg}` }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    "convert_to_pdf",
    "Convert raw HTML to a PDF. Upload to S3 and return a secure download link (valid 24 hours). Use this for custom HTML that isn't a branded document.",
    {
      html: z.string().describe("The HTML content to convert to PDF"),
      filename: z.string().optional().describe("Filename for the PDF (without .pdf extension)"),
    },
    async ({ html, filename }) => {
      try {
        const pdf = await htmlToPdf(html, filename ?? "document");
        return {
          content: [
            {
              type: "text" as const,
              text: `PDF generated: **${pdf.pdfFilename}** (${pdf.sizeKB} KB)\n\nDownload: ${pdf.downloadUrl}\n\nThis link expires in 24 hours.`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: `PDF conversion error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
