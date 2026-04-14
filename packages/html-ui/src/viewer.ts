/**
 * Markdown viewer shell — a self-contained HTML page that:
 * 1. Renders markdown (tables, headings, lists, code blocks)
 * 2. Renders Mermaid diagrams from ```mermaid blocks
 * 3. Has a toolbar with Download MD, Print/PDF buttons
 * 4. Styled to look clean and professional
 */

import { colors, font, spacing } from "./theme.js";

export function viewerShell(opts: {
  title: string;
  markdown: string;
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

  // Escape the markdown for embedding in a script tag
  const escaped = opts.markdown.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${opts.title} — Cometa</title>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"><\/script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: ${font.family}; background: ${colors.bgMuted}; color: ${colors.text}; }

  .toolbar {
    position: sticky; top: 0; z-index: 50;
    background: #fff; border-bottom: 1px solid ${colors.border};
    padding: ${spacing.sm} ${spacing.lg};
    display: flex; align-items: center; justify-content: space-between;
  }
  .toolbar-left { display: flex; align-items: center; gap: ${spacing.md}; }
  .toolbar-right { display: flex; align-items: center; gap: ${spacing.sm}; }
  .toolbar-brand { font-size: ${font.size.sm}; font-weight: ${font.weight.semibold}; color: ${colors.text}; }
  .toolbar-meta { font-size: ${font.size.xs}; color: ${colors.textLight}; }
  .toolbar-btn {
    font-family: ${font.family}; font-size: ${font.size.xs};
    padding: 4px 10px; border: 1px solid ${colors.border};
    border-radius: ${spacing.xs}; background: #fff;
    color: ${colors.text}; cursor: pointer;
  }
  .toolbar-btn:hover { background: ${colors.bgMuted}; }

  .content {
    max-width: 800px; margin: 0 auto;
    padding: ${spacing["3xl"]} ${spacing.lg};
  }

  /* Markdown styles */
  .content h1 { font-size: 1.75rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
  .content h2 { font-size: 1.35rem; font-weight: 600; margin: 1.25rem 0 0.5rem; border-bottom: 1px solid ${colors.border}; padding-bottom: 0.35rem; }
  .content h3 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.4rem; }
  .content p { margin: 0.5rem 0; line-height: 1.6; }
  .content em { font-size: ${font.size.sm}; color: ${colors.textLight}; }
  .content strong { font-weight: 600; }
  .content ul, .content ol { margin: 0.5rem 0 0.5rem 1.5rem; }
  .content li { margin: 0.2rem 0; line-height: 1.5; }

  .content table {
    width: 100%; border-collapse: collapse; margin: 0.75rem 0;
    font-size: ${font.size.sm};
  }
  .content th {
    text-align: left; font-weight: 600; padding: 8px 12px;
    border-bottom: 2px solid ${colors.border}; background: ${colors.bgMuted};
  }
  .content td {
    padding: 6px 12px; border-bottom: 1px solid ${colors.border};
  }
  .content tr:hover td { background: ${colors.bgMuted}; }

  .content code {
    font-family: ui-monospace, "SF Mono", monospace;
    font-size: 0.85em; background: ${colors.bgMuted};
    padding: 2px 5px; border-radius: 3px;
  }
  .content pre {
    background: ${colors.bgMuted}; padding: 1rem;
    border-radius: 6px; overflow-x: auto; margin: 0.75rem 0;
  }
  .content pre code { background: none; padding: 0; }

  .mermaid { margin: 1rem 0; text-align: center; }

  @media print {
    .toolbar { display: none !important; }
    body { background: #fff; }
    .content { padding: 0 !important; }
  }
</style>
</head>
<body>

<div class="toolbar">
  <div class="toolbar-left">
    <span class="toolbar-brand">Cometa</span>
    <span class="toolbar-meta">Generated ${createdDate}</span>
    <span class="toolbar-meta">· Expires in ${expiry} days</span>
  </div>
  <div class="toolbar-right">
    <button class="toolbar-btn" onclick="downloadMd()">Download</button>
    <button class="toolbar-btn" onclick="window.print()">Print / PDF</button>
  </div>
</div>

<div class="content" id="content"></div>

<script>
const raw = \`${escaped}\`;

// Parse markdown
const html = marked.parse(raw);
document.getElementById('content').innerHTML = html;

// Init Mermaid
mermaid.initialize({ startOnLoad: false, theme: 'neutral', fontFamily: '${font.family.replace(/'/g, "")}' });
mermaid.run({ querySelector: '.language-mermaid' }).catch(() => {
  // Fallback: find pre>code.language-mermaid and convert to div.mermaid
  document.querySelectorAll('code.language-mermaid').forEach((el, i) => {
    const pre = el.parentElement;
    const div = document.createElement('div');
    div.className = 'mermaid';
    div.textContent = el.textContent;
    pre.replaceWith(div);
  });
  mermaid.run({ querySelector: '.mermaid' });
});

function downloadMd() {
  const blob = new Blob([raw], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '${opts.title
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()}.md';
  a.click();
  URL.revokeObjectURL(a.href);
}
<\/script>

</body>
</html>`;
}
