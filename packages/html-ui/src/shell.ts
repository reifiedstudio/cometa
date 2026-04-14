/**
 * Page shell — wraps report HTML in a full page with a toolbar.
 * Toolbar has: download HTML, download PDF (print), expiry notice.
 */

import { colors, font, spacing } from "./theme.js";

export function pageShell(opts: {
  title: string;
  content: string;
  createdAt?: string;
  expiresInDays?: number;
}): string {
  const created = opts.createdAt ?? new Date().toISOString();
  const expiry = opts.expiresInDays ?? 30;
  const createdDate = new Date(created).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${opts.title} — Cometa</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: ${font.family}; background: ${colors.bgMuted}; color: ${colors.text}; }
  @media print { .toolbar { display: none !important; } body { background: #fff; } .content { padding: 0 !important; } }
</style>
</head>
<body>

<div class="toolbar" style="position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid ${colors.border};padding:${spacing.sm} ${spacing.lg};display:flex;align-items:center;justify-content:space-between">
  <div style="display:flex;align-items:center;gap:${spacing.md}">
    <span style="font-size:${font.size.sm};font-weight:${font.weight.semibold};color:${colors.text}">Cometa</span>
    <span style="font-size:${font.size.xs};color:${colors.textLight}">Generated ${createdDate}</span>
    <span style="font-size:${font.size.xs};color:${colors.textLight}">· Expires in ${expiry} days</span>
  </div>
  <div style="display:flex;align-items:center;gap:${spacing.sm}">
    <button onclick="downloadHtml()" style="font-family:${font.family};font-size:${font.size.xs};padding:4px 10px;border:1px solid ${colors.border};border-radius:${spacing.xs};background:#fff;color:${colors.text};cursor:pointer">Download HTML</button>
    <button onclick="window.print()" style="font-family:${font.family};font-size:${font.size.xs};padding:4px 10px;border:1px solid ${colors.border};border-radius:${spacing.xs};background:#fff;color:${colors.text};cursor:pointer">Print / PDF</button>
  </div>
</div>

<div class="content" style="max-width:800px;margin:0 auto;padding:${spacing["3xl"]} ${spacing.lg}">
  ${opts.content}
</div>

<script>
function downloadHtml() {
  const html = document.documentElement.outerHTML;
  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '${opts.title
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()}.html';
  a.click();
  URL.revokeObjectURL(a.href);
}
</script>

</body>
</html>`;
}
