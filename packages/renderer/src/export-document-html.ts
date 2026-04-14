import type { Signer } from "./signature-block.js";

export interface ExportDocumentOptions {
  title: string;
  markdown: string;
  company: {
    name: string;
    logo?: string;
    registrationNumber?: string;
    vatNumber?: string;
    address?: string;
    website?: string;
    email?: string;
    phone?: string;
  };
  reference?: string;
  date?: string;
  signers?: Signer[];
  confidential?: boolean;
}

/**
 * Generate a standalone, print-ready HTML document with company branding,
 * signature blocks, and page numbers. Designed for PDF conversion via
 * Puppeteer or window.print().
 */
export function exportDocumentToHtml(options: ExportDocumentOptions): string {
  const { title, markdown, company, reference, date, signers, confidential } = options;

  const escapedMarkdown = markdown
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");

  const companyDetails = [
    company.address,
    company.registrationNumber && `Reg: ${company.registrationNumber}`,
    company.vatNumber && `VAT: ${company.vatNumber}`,
  ]
    .filter(Boolean)
    .join(" &middot; ");

  const companyContact = [company.website, company.email, company.phone]
    .filter(Boolean)
    .join(" &middot; ");

  const signerHtml = signers?.length
    ? `<section class="signatures">
        <h3 class="sig-title">Signatures</h3>
        <div class="sig-grid sig-cols-${Math.min(signers.length, 2)}">
          ${signers
            .map(
              (s) => `<div class="sig-box">
              <div class="sig-area"></div>
              <div class="sig-details">
                <p class="sig-name">${esc(s.name)}</p>
                ${s.role ? `<p class="sig-meta">${esc(s.role)}</p>` : ""}
                ${s.company ? `<p class="sig-meta">${esc(s.company)}</p>` : ""}
                ${s.email ? `<p class="sig-meta">${esc(s.email)}</p>` : ""}
              </div>
              <div class="sig-date">
                <span>Date:</span>
                ${s.signedAt ? `<span>${esc(s.signedAt)}</span>` : '<span class="sig-date-line"></span>'}
              </div>
            </div>`,
            )
            .join("\n")}
        </div>
      </section>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 2.5rem 2rem;
    }

    /* ── Header ── */
    .doc-header { border-bottom: 2px solid #e5e5e5; padding-bottom: 1.5rem; margin-bottom: 2rem; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .company { display: flex; align-items: center; gap: 0.75rem; }
    .company-logo { height: 40px; width: auto; }
    .company-initial { width: 40px; height: 40px; background: #1a1a1a; color: #fff; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.125rem; }
    .company-name { font-size: 0.875rem; font-weight: 600; }
    .company-reg { font-size: 0.75rem; color: #666; }
    .header-meta { text-align: right; font-size: 0.75rem; color: #666; }
    .header-meta .ref { font-family: monospace; }
    .doc-title { font-size: 1.25rem; font-weight: 600; margin-top: 1rem; }

    /* ── Content ── */
    h1 { font-size: 1.75rem; font-weight: 700; margin: 2rem 0 1rem; }
    h2 { font-size: 1.375rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
    h3 { font-size: 1.125rem; font-weight: 500; margin: 1.25rem 0 0.5rem; }
    p { margin-bottom: 0.75rem; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.875rem; }
    th { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 2px solid #e5e5e5; font-weight: 500; color: #666; font-size: 0.75rem; }
    td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #f0f0f0; }
    code { background: #f5f5f5; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875rem; }
    pre { background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #ddd; padding-left: 1rem; color: #666; font-style: italic; margin: 1rem 0; }
    ul, ol { margin-bottom: 0.75rem; padding-left: 1.5rem; }
    li { margin-bottom: 0.25rem; }
    a { color: #2563eb; }
    hr { border: none; border-top: 1px solid #e5e5e5; margin: 1.5rem 0; }
    .chart-placeholder { background: #f9fafb; border: 1px solid #e5e5e5; border-radius: 0.5rem; padding: 1.5rem; margin: 1rem 0; text-align: center; color: #666; font-size: 0.875rem; }

    /* ── Signatures ── */
    .signatures { margin-top: 3rem; }
    .sig-title { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-bottom: 1.5rem; }
    .sig-grid { display: grid; gap: 2rem; }
    .sig-cols-1 { grid-template-columns: 1fr; }
    .sig-cols-2 { grid-template-columns: 1fr 1fr; }
    .sig-box { }
    .sig-area { height: 4rem; border: 2px dashed #d4d4d4; border-radius: 6px; background: #fafafa; margin-bottom: 1rem; }
    .sig-details { border-top: 1px solid #e5e5e5; padding-top: 0.5rem; }
    .sig-name { font-size: 0.875rem; font-weight: 500; }
    .sig-meta { font-size: 0.75rem; color: #666; }
    .sig-date { font-size: 0.75rem; color: #666; margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
    .sig-date-line { display: inline-block; width: 8rem; border-bottom: 1px solid #999; }

    /* ── Footer ── */
    .doc-footer { border-top: 1px solid #e5e5e5; margin-top: 3rem; padding-top: 1rem; display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.75rem; color: #666; }
    .footer-company { font-weight: 500; color: #1a1a1a; }
    .confidential { font-size: 0.6875rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-bottom: 0.5rem; }

    /* ── Page footer (repeats on every printed page) ── */
    .page-footer {
      display: none;
    }

    /* ── Print / PDF ── */
    @page {
      size: A4;
      margin: 2cm 1.5cm 2.5cm 1.5cm;
      @bottom-right { content: "Page " counter(page) " of " counter(pages); font-size: 8pt; color: #999; }
      @bottom-left { content: "${esc(company.name)}"; font-size: 8pt; color: #999; }
    }
    @media print {
      body { max-width: none; padding: 0; }
      .doc-header { break-after: avoid; }
      .signatures { break-inside: avoid; }
      .doc-footer { break-inside: avoid; }
      .page-footer {
        display: block;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 9pt;
        color: #999;
        padding-bottom: 0.5cm;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="doc-header">
    <div class="header-top">
      <div class="company">
        ${
          company.logo
            ? `<img src="${esc(company.logo)}" alt="${esc(company.name)}" class="company-logo" />`
            : `<div class="company-initial">${esc(company.name.charAt(0))}</div>`
        }
        <div>
          <div class="company-name">${esc(company.name)}</div>
          ${company.registrationNumber ? `<div class="company-reg">Reg: ${esc(company.registrationNumber)}</div>` : ""}
        </div>
      </div>
      <div class="header-meta">
        ${reference ? `<div class="ref">${esc(reference)}</div>` : ""}
        ${date ? `<div>${esc(date)}</div>` : ""}
      </div>
    </div>
    <h1 class="doc-title">${esc(title)}</h1>
  </header>

  <!-- Content -->
  <div id="content"></div>

  <!-- Signatures -->
  ${signerHtml}

  <!-- Page footer (repeats on every printed page) -->
  <div class="page-footer">${esc(company.name)} &middot; ${esc(title)}</div>

  <!-- Footer -->
  <footer class="doc-footer">
    <div>
      ${confidential ? '<div class="confidential">Confidential</div>' : ""}
      <div class="footer-company">${esc(company.name)}</div>
      ${companyDetails ? `<div>${companyDetails}</div>` : ""}
    </div>
    <div style="text-align:right;">
      ${companyContact ? `<div>${companyContact}</div>` : ""}
    </div>
  </footer>

  <script>
    const md = \`${escapedMarkdown}\`;
    const processed = md.replace(/\`\`\`chart\\n([\\s\\S]*?)\`\`\`/g, (_, json) => {
      try {
        const def = JSON.parse(json.trim());
        const items = (def.data || []).map(d => d.label + ": " + d.value).join(", ");
        return '<div class="chart-placeholder"><strong>' + (def.title || "Chart") + '</strong><br/>' + items + '</div>';
      } catch { return '<div class="chart-placeholder">Chart data</div>'; }
    });
    document.getElementById("content").innerHTML = marked.parse(processed);
  <\/script>
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
