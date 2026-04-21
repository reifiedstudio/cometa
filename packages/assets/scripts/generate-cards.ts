/**
 * One-time script: generates static PNG card images from SVG templates.
 * Run with: bun run scripts/generate-cards.ts
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../src/cards/images");

mkdirSync(OUT_DIR, { recursive: true });

// ── SVG icon paths (24x24 viewBox, stroke-based) ──

const icons: Record<string, string> = {
  document: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  contract: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  nda: `<rect x="3" y="11" width="18" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="16" r="1" fill="currentColor"/>`,
  invoice: `<path d="M4 2v20l4-2 4 2 4-2 4 2V2l-4 2-4-2-4 2L4 2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 10h8M8 14h4" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  proposal: `<path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 21h6" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  letter: `<rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2 6l10 7 10-7" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  signature: `<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  task: `<rect x="5" y="3" width="14" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 3V1M15 3V1M9 14l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  note: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M14 2v6h6M8 13h3M8 17h6" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  link: `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
};

interface CardDef {
  name: string;
  label: string;
  accent: string;
  icon: string;
}

const cards: CardDef[] = [
  // Document types
  { name: "contract", label: "Contract", accent: "#3b82f6", icon: "contract" },
  { name: "nda", label: "Non-Disclosure Agreement", accent: "#8b5cf6", icon: "nda" },
  { name: "invoice", label: "Invoice", accent: "#10b981", icon: "invoice" },
  { name: "proposal", label: "Proposal", accent: "#f59e0b", icon: "proposal" },
  { name: "letter", label: "Letter", accent: "#6366f1", icon: "letter" },
  { name: "agreement", label: "Agreement", accent: "#3b82f6", icon: "contract" },
  { name: "document", label: "Document", accent: "#737373", icon: "document" },

  // Service types
  { name: "signature", label: "Signature Request", accent: "#ec4899", icon: "signature" },
  { name: "task", label: "Task", accent: "#f97316", icon: "task" },
  { name: "note", label: "Note", accent: "#06b6d4", icon: "note" },
  { name: "link", label: "Link Preview", accent: "#a855f7", icon: "link" },
];

function renderSvg(card: CardDef): string {
  const iconSvg = icons[card.icon] ?? icons.document;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="315" viewBox="0 0 600 315">
  <rect width="600" height="315" rx="12" fill="#0a0a0a"/>

  <!-- Dot pattern -->
  <defs>
    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="0.8" fill="${card.accent}" opacity="0.07"/>
    </pattern>
  </defs>
  <rect width="600" height="315" fill="url(#dots)"/>

  <!-- Accent bar -->
  <rect x="0" y="0" width="600" height="4" fill="${card.accent}"/>

  <!-- Icon background -->
  <rect x="40" y="80" width="72" height="72" rx="14" fill="${card.accent}" opacity="0.12"/>

  <!-- Icon -->
  <svg x="56" y="96" width="40" height="40" viewBox="0 0 24 24" style="color:${card.accent}">
    ${iconSvg}
  </svg>

  <!-- Label -->
  <text x="132" y="113" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="600" fill="#f5f5f5">${card.label}</text>
  <text x="132" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#737373">Cometa</text>

  <!-- Divider -->
  <rect x="40" y="200" width="520" height="1" fill="#262626"/>

  <!-- Footer -->
  <text x="40" y="260" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#525252">Generated by Cometa</text>
  <text x="560" y="260" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#525252" text-anchor="end">cometa.co</text>
</svg>`;
}

async function main() {
  console.log(`Generating ${cards.length} card images...`);

  for (const card of cards) {
    const svg = renderSvg(card);
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    const outPath = join(OUT_DIR, `${card.name}.png`);
    writeFileSync(outPath, png);
    console.log(`  ${card.name}.png (${Math.round(png.byteLength / 1024)} KB)`);
  }

  // Also generate a TypeScript module with inlined base64
  const lines: string[] = [
    "// Auto-generated by scripts/generate-cards.ts — do not edit manually",
    "",
  ];

  for (const card of cards) {
    const png = await sharp(Buffer.from(renderSvg(card))).png().toBuffer();
    const b64 = png.toString("base64");
    const varName = card.name + "Card";
    lines.push(`export const ${varName} = "${b64}";`);
  }

  // Lookup helpers
  lines.push("");
  lines.push("const documentCardMap: Record<string, string> = {");
  for (const card of cards.filter((c) => ["contract", "nda", "invoice", "proposal", "letter", "agreement"].includes(c.name))) {
    lines.push(`  ${card.name}: ${card.name}Card,`);
  }
  lines.push("};");
  lines.push("");
  lines.push("export function getDocumentCard(type?: string): string {");
  lines.push("  if (!type) return documentCard;");
  lines.push('  const key = type.toLowerCase().replace(/[^a-z]/g, "");');
  lines.push("  return documentCardMap[key] ?? documentCard;");
  lines.push("}");
  lines.push("");
  lines.push("const serviceCardMap: Record<string, string> = {");
  for (const card of cards.filter((c) => ["signature", "task", "note", "link", "document"].includes(c.name))) {
    lines.push(`  ${card.name}: ${card.name}Card,`);
  }
  lines.push("};");
  lines.push("");
  lines.push("export function getServiceCard(service: string): string {");
  lines.push("  return serviceCardMap[service] ?? documentCard;");
  lines.push("}");

  const tsPath = join(__dirname, "../src/cards/generated.ts");
  writeFileSync(tsPath, lines.join("\n") + "\n");
  console.log(`\nGenerated TypeScript module: src/cards/generated.ts`);

  console.log(`\nDone! Images written to src/cards/images/`);
}

main();
