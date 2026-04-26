import type { Signer } from "./signature-block";

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
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      line-height: 1.65;
      color: #212327;
      max-width: 800px;
      margin: 0 auto;
      padding: 2.5rem 2rem;
      font-size: 14px;
    }

    /* ── Header ── */
    .doc-header {
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid #EBEEF1;
      margin-bottom: 1.25rem;
    }
    .company { display: flex; align-items: center; gap: 0.75rem; }
    .company-logo { height: 20px; width: auto; }
    .company-initial {
      width: 28px; height: 28px;
      background: #212327; color: #fff;
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.8rem;
    }
    .company-name { font-size: 0.8125rem; font-weight: 600; color: #212327; }
    .company-reg { font-size: 0.6875rem; color: #717983; }
    .header-meta { text-align: right; font-size: 0.6875rem; color: #717983; }
    .header-meta .ref { font-family: "SF Mono", "Fira Code", monospace; font-size: 0.6875rem; }
    .doc-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #212327;
      letter-spacing: -0.01em;
    }

    /* ── Content ── */
    h1 { font-size: 1.375rem; font-weight: 700; margin: 2.5rem 0 0.75rem; color: #212327; letter-spacing: -0.01em; }
    h2 { font-size: 1.125rem; font-weight: 600; margin: 2rem 0 0.625rem; color: #212327; }
    h3 { font-size: 0.9375rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: #212327; }
    p { margin-bottom: 0.75rem; color: #555A65; }
    strong { color: #212327; }

    table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; font-size: 0.8125rem; }
    th {
      text-align: left;
      padding: 0.625rem 0.75rem;
      border-bottom: 1px solid #EBEEF1;
      font-weight: 500;
      color: #717983;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    td { padding: 0.625rem 0.75rem; border-bottom: 1px solid #F3F4F6; color: #555A65; }
    tr:last-child td { font-weight: 600; color: #212327; }

    code { background: #F8F8FA; padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.8125rem; font-family: "SF Mono", "Fira Code", monospace; }
    pre { background: #F8F8FA; padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0; border: 1px solid #EBEEF1; }
    pre code { background: none; padding: 0; }

    blockquote { border-left: 3px solid #212327; padding-left: 1rem; color: #555A65; margin: 1rem 0; }
    ul, ol { margin-bottom: 0.75rem; padding-left: 1.5rem; color: #555A65; }
    li { margin-bottom: 0.375rem; }
    li::marker { color: #717983; }
    a { color: #212327; text-decoration: underline; text-underline-offset: 2px; }
    hr { border: none; border-top: 1px solid #EBEEF1; margin: 2rem 0; }

    .chart-placeholder {
      background: #F8F8FA;
      border: 1px solid #EBEEF1;
      border-radius: 8px;
      padding: 1.5rem;
      margin: 1rem 0;
      text-align: center;
      color: #717983;
      font-size: 0.8125rem;
    }

    /* ── Signatures ── */
    .signatures { margin-top: 3rem; page-break-inside: avoid; }
    .sig-title {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #717983;
      margin-bottom: 1.5rem;
    }
    .sig-grid { display: grid; gap: 2rem; }
    .sig-cols-1 { grid-template-columns: 1fr; max-width: 50%; }
    .sig-cols-2 { grid-template-columns: 1fr 1fr; }
    .sig-area {
      height: 4rem;
      border: 1.5px dashed #D1D5DB;
      border-radius: 8px;
      background: #FAFAFA;
      margin-bottom: 0.75rem;
    }
    .sig-details { border-top: 1px solid #EBEEF1; padding-top: 0.5rem; }
    .sig-name { font-size: 0.8125rem; font-weight: 600; color: #212327; }
    .sig-meta { font-size: 0.75rem; color: #717983; }
    .sig-date { font-size: 0.75rem; color: #717983; margin-top: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
    .sig-date-line { display: inline-block; width: 8rem; border-bottom: 1px solid #D1D5DB; }

    /* ── Footer ── */
    .doc-footer {
      border-top: 1px solid #EBEEF1;
      margin-top: 3rem;
      padding-top: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 0.6875rem;
      color: #717983;
    }
    .footer-company { font-weight: 600; color: #212327; margin-bottom: 0.125rem; }
    .confidential {
      display: inline-block;
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #717983;
      border: 1px solid #EBEEF1;
      border-radius: 4px;
      padding: 0.125rem 0.5rem;
      margin-bottom: 0.5rem;
    }

    /* ── Print / PDF ── */
    @media print {
      body { max-width: none; padding: 0; }
      .doc-header { break-after: avoid; }
      .signatures { break-inside: avoid; }
      .doc-footer { break-inside: avoid; }
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
