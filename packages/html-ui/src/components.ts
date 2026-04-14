/**
 * HTML component renderers.
 * Each function returns a self-contained HTML string with inline styles.
 */

import { colors, font, radius, spacing } from "./theme.js";

// ── Helpers ──

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatZAR(amount: number): string {
  return `R ${Math.abs(amount).toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function pct(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}

// ── Badge ──

export type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "muted";

const badgeColors: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  default: { bg: colors.bgSubtle, text: colors.text, border: colors.border },
  success: { bg: colors.successLight, text: colors.success, border: colors.successBorder },
  warning: { bg: colors.warningLight, text: colors.warning, border: colors.warningBorder },
  error: { bg: colors.errorLight, text: colors.error, border: colors.errorBorder },
  info: { bg: colors.infoLight, text: colors.info, border: colors.infoBorder },
  muted: { bg: colors.bgMuted, text: colors.textMuted, border: colors.borderLight },
};

export function badge(label: string, variant: BadgeVariant = "default"): string {
  const c = badgeColors[variant];
  return `<span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:${radius.full};font-size:${font.size.xs};font-weight:${font.weight.medium};font-family:${font.family};background:${c.bg};color:${c.text};border:1px solid ${c.border}">${esc(label)}</span>`;
}

// ── Status badge (maps domain statuses to variants) ──

const statusVariants: Record<string, BadgeVariant> = {
  completed: "success",
  paid: "success",
  approved: "success",
  signed: "success",
  processing: "info",
  assigned: "info",
  authorised: "info",
  active: "info",
  pending: "warning",
  queued: "warning",
  awaiting_approval: "warning",
  draft: "warning",
  failed: "error",
  overdue: "error",
  rejected: "error",
};

export function statusBadge(status: string): string {
  const variant = statusVariants[status] ?? "muted";
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return badge(label, variant);
}

// ── Metric Card ──

export function metricCard(opts: {
  label: string;
  value: string;
  change?: string;
  changeDirection?: "up" | "down" | "neutral";
  sublabel?: string;
}): string {
  const changeColor =
    opts.changeDirection === "up"
      ? colors.success
      : opts.changeDirection === "down"
        ? colors.error
        : colors.textMuted;
  const arrow =
    opts.changeDirection === "up" ? "&#9650;" : opts.changeDirection === "down" ? "&#9660;" : "";

  return `<div style="padding:${spacing.lg};border:1px solid ${colors.border};border-radius:${radius.lg};background:${colors.bg};font-family:${font.family}">
  <div style="font-size:${font.size.xs};color:${colors.textMuted};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:${spacing.xs}">${esc(opts.label)}</div>
  <div style="font-size:${font.size["2xl"]};font-weight:${font.weight.bold};color:${colors.text};line-height:1.2">${esc(opts.value)}</div>
  ${opts.change ? `<div style="font-size:${font.size.xs};color:${changeColor};margin-top:${spacing.xs}">${arrow} ${esc(opts.change)}</div>` : ""}
  ${opts.sublabel ? `<div style="font-size:${font.size.xs};color:${colors.textLight};margin-top:2px">${esc(opts.sublabel)}</div>` : ""}
</div>`;
}

// ── Metric Row (multiple cards side by side) ──

export function metricRow(cards: string[]): string {
  const width = `${Math.floor(100 / cards.length)}%`;
  const items = cards.map((c) => `<div style="flex:1;min-width:140px">${c}</div>`).join("");
  return `<div style="display:flex;gap:${spacing.md};flex-wrap:wrap">${items}</div>`;
}

// ── Table ──

export function table(opts: {
  headers: string[];
  rows: string[][];
  alignRight?: number[]; // column indices to right-align
}): string {
  const rightCols = new Set(opts.alignRight ?? []);
  const thStyle = (i: number) =>
    `padding:${spacing.sm} ${spacing.md};text-align:${rightCols.has(i) ? "right" : "left"};font-size:${font.size.xs};font-weight:${font.weight.semibold};color:${colors.textMuted};border-bottom:2px solid ${colors.border};white-space:nowrap`;
  const tdStyle = (i: number) =>
    `padding:${spacing.sm} ${spacing.md};text-align:${rightCols.has(i) ? "right" : "left"};font-size:${font.size.sm};color:${colors.text};border-bottom:1px solid ${colors.borderLight}`;

  const thead = opts.headers.map((h, i) => `<th style="${thStyle(i)}">${esc(h)}</th>`).join("");
  const tbody = opts.rows
    .map((row) => {
      const cells = row.map((cell, i) => `<td style="${tdStyle(i)}">${cell}</td>`).join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `<table style="width:100%;border-collapse:collapse;font-family:${font.family}">
  <thead><tr>${thead}</tr></thead>
  <tbody>${tbody}</tbody>
</table>`;
}

// ── Section / Card wrapper ──

export function section(opts: { title?: string; subtitle?: string; content: string }): string {
  return `<div style="border:1px solid ${colors.border};border-radius:${radius.lg};background:${colors.bg};overflow:hidden;font-family:${font.family}">
  ${
    opts.title
      ? `<div style="padding:${spacing.lg};border-bottom:1px solid ${colors.borderLight}">
    <div style="font-size:${font.size.lg};font-weight:${font.weight.semibold};color:${colors.text}">${esc(opts.title)}</div>
    ${opts.subtitle ? `<div style="font-size:${font.size.sm};color:${colors.textMuted};margin-top:2px">${esc(opts.subtitle)}</div>` : ""}
  </div>`
      : ""
  }
  <div style="padding:${spacing.lg}">${opts.content}</div>
</div>`;
}

// ── Page layout ──

export function page(opts: { title: string; subtitle?: string; children: string[] }): string {
  return `<div style="max-width:720px;font-family:${font.family};color:${colors.text}">
  <div style="margin-bottom:${spacing["2xl"]}">
    <div style="font-size:${font.size.xl};font-weight:${font.weight.bold};color:${colors.text}">${esc(opts.title)}</div>
    ${opts.subtitle ? `<div style="font-size:${font.size.sm};color:${colors.textMuted};margin-top:${spacing.xs}">${esc(opts.subtitle)}</div>` : ""}
  </div>
  ${opts.children.join(`\n<div style="height:${spacing.lg}"></div>\n`)}
</div>`;
}

// ── Progress Bar ──

export function progressBar(opts: {
  value: number;
  max: number;
  label?: string;
  color?: string;
}): string {
  const p = pct(opts.value, opts.max);
  const color = opts.color ?? colors.primary;
  return `<div style="font-family:${font.family}">
  ${
    opts.label
      ? `<div style="display:flex;justify-content:space-between;margin-bottom:${spacing.xs}">
    <span style="font-size:${font.size.xs};color:${colors.textMuted}">${esc(opts.label)}</span>
    <span style="font-size:${font.size.xs};font-weight:${font.weight.medium};color:${colors.text}">${p}%</span>
  </div>`
      : ""
  }
  <div style="height:6px;background:${colors.bgSubtle};border-radius:${radius.full};overflow:hidden">
    <div style="height:100%;width:${p}%;background:${color};border-radius:${radius.full};transition:width 0.3s"></div>
  </div>
</div>`;
}

// ── List item ──

export function listItem(opts: {
  title: string;
  subtitle?: string;
  right?: string;
  badge?: string;
}): string {
  return `<div style="display:flex;align-items:center;justify-content:space-between;padding:${spacing.md} 0;border-bottom:1px solid ${colors.borderLight};font-family:${font.family}">
  <div style="min-width:0;flex:1">
    <div style="font-size:${font.size.sm};font-weight:${font.weight.medium};color:${colors.text}">${esc(opts.title)}</div>
    ${opts.subtitle ? `<div style="font-size:${font.size.xs};color:${colors.textMuted};margin-top:1px">${esc(opts.subtitle)}</div>` : ""}
  </div>
  <div style="display:flex;align-items:center;gap:${spacing.sm};margin-left:${spacing.md}">
    ${opts.badge ?? ""}
    ${opts.right ? `<span style="font-size:${font.size.sm};font-weight:${font.weight.medium};color:${colors.text};white-space:nowrap">${opts.right}</span>` : ""}
  </div>
</div>`;
}

// ── Key-Value pair ──

export function kvPair(key: string, value: string): string {
  return `<div style="display:flex;justify-content:space-between;padding:${spacing.sm} 0;font-family:${font.family}">
  <span style="font-size:${font.size.sm};color:${colors.textMuted}">${esc(key)}</span>
  <span style="font-size:${font.size.sm};font-weight:${font.weight.medium};color:${colors.text}">${value}</span>
</div>`;
}

// ── Divider ──

export function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${colors.border};margin:${spacing.lg} 0" />`;
}

// ── Empty state ──

export function emptyState(message: string): string {
  return `<div style="text-align:center;padding:${spacing["3xl"]} ${spacing.lg};font-family:${font.family}">
  <div style="font-size:${font.size.sm};color:${colors.textMuted}">${esc(message)}</div>
</div>`;
}
