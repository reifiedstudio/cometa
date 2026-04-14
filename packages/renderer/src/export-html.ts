/**
 * Generate a standalone HTML page from markdown content.
 * Uses marked.js via CDN for rendering — no React dependency at runtime.
 * Called on-demand from the "Download HTML" button.
 */
export function exportToHtml(markdown: string, title: string): string {
  const escapedMarkdown = markdown
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
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
    @media print {
      body { max-width: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div id="content"></div>
  <script>
    const md = \`${escapedMarkdown}\`;
    // Replace chart code blocks with a placeholder
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

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
