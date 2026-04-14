/**
 * SVG chart renderers — self-contained inline SVG strings.
 * No JS, no external deps. Works everywhere HTML works.
 */

import { colors, font } from "./theme.js";

// ── Bar Chart ──

export function barChart(opts: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  width?: number;
  showValues?: boolean;
  formatValue?: (v: number) => string;
}): string {
  const W = opts.width ?? 600;
  const H = opts.height ?? 200;
  const pad = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const max = Math.max(...opts.data.map((d) => d.value), 1);
  const barW = Math.min(40, (chartW / opts.data.length) * 0.6);
  const gap = chartW / opts.data.length;
  const fmt = opts.formatValue ?? ((v) => v.toLocaleString());

  // Y-axis gridlines
  const gridLines = 4;
  const gridStep = max / gridLines;
  let gridSvg = "";
  for (let i = 0; i <= gridLines; i++) {
    const y = pad.top + chartH - (i / gridLines) * chartH;
    const val = Math.round(gridStep * i);
    gridSvg += `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="${colors.borderLight}" stroke-width="1" />`;
    gridSvg += `<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" fill="${colors.textLight}" font-size="10" font-family="${font.family}">${fmt(val)}</text>`;
  }

  // Bars
  let barsSvg = "";
  opts.data.forEach((d, i) => {
    const barH = (d.value / max) * chartH;
    const x = pad.left + i * gap + (gap - barW) / 2;
    const y = pad.top + chartH - barH;
    const color = d.color ?? colors.chart[i % colors.chart.length];

    barsSvg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="3" fill="${color}" />`;

    if (opts.showValues) {
      barsSvg += `<text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" fill="${colors.textMuted}" font-size="10" font-family="${font.family}">${fmt(d.value)}</text>`;
    }

    // X-axis label
    barsSvg += `<text x="${x + barW / 2}" y="${pad.top + chartH + 16}" text-anchor="middle" fill="${colors.textMuted}" font-size="10" font-family="${font.family}">${d.label}</text>`;
  });

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
  ${gridSvg}
  ${barsSvg}
</svg>`;
}

// ── Line Chart ──

export function lineChart(opts: {
  series: { label: string; data: number[]; color?: string }[];
  labels: string[];
  height?: number;
  width?: number;
  formatValue?: (v: number) => string;
}): string {
  const W = opts.width ?? 600;
  const H = opts.height ?? 200;
  const pad = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const allValues = opts.series.flatMap((s) => s.data);
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
  const range = max - min || 1;
  const fmt = opts.formatValue ?? ((v) => v.toLocaleString());

  // Grid
  const gridLines = 4;
  let gridSvg = "";
  for (let i = 0; i <= gridLines; i++) {
    const y = pad.top + chartH - (i / gridLines) * chartH;
    const val = Math.round(min + (range * i) / gridLines);
    gridSvg += `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="${colors.borderLight}" stroke-width="1" />`;
    gridSvg += `<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" fill="${colors.textLight}" font-size="10" font-family="${font.family}">${fmt(val)}</text>`;
  }

  // X labels
  let xLabels = "";
  opts.labels.forEach((l, i) => {
    const x = pad.left + (i / (opts.labels.length - 1)) * chartW;
    xLabels += `<text x="${x}" y="${pad.top + chartH + 16}" text-anchor="middle" fill="${colors.textMuted}" font-size="10" font-family="${font.family}">${l}</text>`;
  });

  // Lines
  let linesSvg = "";
  opts.series.forEach((s, si) => {
    const color = s.color ?? colors.chart[si % colors.chart.length];
    const points = s.data.map((v, i) => {
      const x = pad.left + (i / (s.data.length - 1)) * chartW;
      const y = pad.top + chartH - ((v - min) / range) * chartH;
      return `${x},${y}`;
    });
    linesSvg += `<polyline points="${points.join(" ")}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />`;

    // Dots
    s.data.forEach((v, i) => {
      const x = pad.left + (i / (s.data.length - 1)) * chartW;
      const y = pad.top + chartH - ((v - min) / range) * chartH;
      linesSvg += `<circle cx="${x}" cy="${y}" r="3" fill="${color}" />`;
    });
  });

  // Legend
  let legendSvg = "";
  if (opts.series.length > 1) {
    opts.series.forEach((s, i) => {
      const color = s.color ?? colors.chart[i % colors.chart.length];
      const x = pad.left + i * 120;
      legendSvg += `<circle cx="${x}" cy="${H - 6}" r="4" fill="${color}" />`;
      legendSvg += `<text x="${x + 8}" y="${H - 2}" fill="${colors.textMuted}" font-size="10" font-family="${font.family}">${s.label}</text>`;
    });
  }

  return `<svg width="${W}" height="${H + (opts.series.length > 1 ? 20 : 0)}" viewBox="0 0 ${W} ${H + (opts.series.length > 1 ? 20 : 0)}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
  ${gridSvg}
  ${xLabels}
  ${linesSvg}
  ${legendSvg}
</svg>`;
}

// ── Donut Chart ──

export function donutChart(opts: {
  data: { label: string; value: number; color?: string }[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}): string {
  const size = opts.size ?? 160;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * 0.6;
  const total = opts.data.reduce((s, d) => s + d.value, 0) || 1;

  let pathsSvg = "";
  let angle = -90; // start at top

  opts.data.forEach((d, i) => {
    const sliceAngle = (d.value / total) * 360;
    const startRad = (angle * Math.PI) / 180;
    const endRad = ((angle + sliceAngle) * Math.PI) / 180;
    const color = d.color ?? colors.chart[i % colors.chart.length];

    const x1 = cx + outerR * Math.cos(startRad);
    const y1 = cy + outerR * Math.sin(startRad);
    const x2 = cx + outerR * Math.cos(endRad);
    const y2 = cy + outerR * Math.sin(endRad);
    const x3 = cx + innerR * Math.cos(endRad);
    const y3 = cy + innerR * Math.sin(endRad);
    const x4 = cx + innerR * Math.cos(startRad);
    const y4 = cy + innerR * Math.sin(startRad);

    const large = sliceAngle > 180 ? 1 : 0;

    pathsSvg += `<path d="M${x1},${y1} A${outerR},${outerR} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${innerR},${innerR} 0 ${large} 0 ${x4},${y4} Z" fill="${color}" />`;
    angle += sliceAngle;
  });

  // Center text
  let centerSvg = "";
  if (opts.centerValue) {
    centerSvg += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="${colors.text}" font-size="16" font-weight="${font.weight.bold}" font-family="${font.family}">${opts.centerValue}</text>`;
  }
  if (opts.centerLabel) {
    centerSvg += `<text x="${cx}" y="${cy + 12}" text-anchor="middle" fill="${colors.textMuted}" font-size="10" font-family="${font.family}">${opts.centerLabel}</text>`;
  }

  // Legend below
  const legendY = size + 8;
  let legendSvg = "";
  opts.data.forEach((d, i) => {
    const color = d.color ?? colors.chart[i % colors.chart.length];
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = col * (size / 2);
    const y = legendY + row * 16;
    legendSvg += `<rect x="${x}" y="${y}" width="8" height="8" rx="2" fill="${color}" />`;
    legendSvg += `<text x="${x + 12}" y="${y + 8}" fill="${colors.textMuted}" font-size="10" font-family="${font.family}">${d.label}</text>`;
  });

  const legendRows = Math.ceil(opts.data.length / 2);
  const totalH = size + 12 + legendRows * 16;

  return `<svg width="${size}" height="${totalH}" viewBox="0 0 ${size} ${totalH}" xmlns="http://www.w3.org/2000/svg">
  ${pathsSvg}
  ${centerSvg}
  ${legendSvg}
</svg>`;
}

// ── Sparkline (tiny inline chart) ──

export function sparkline(opts: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}): string {
  const W = opts.width ?? 80;
  const H = opts.height ?? 24;
  const pad = 2;
  const color = opts.color ?? colors.primary;
  const max = Math.max(...opts.data, 1);
  const min = Math.min(...opts.data, 0);
  const range = max - min || 1;

  const points = opts.data
    .map((v, i) => {
      const x = pad + (i / (opts.data.length - 1)) * (W - pad * 2);
      const y = pad + (1 - (v - min) / range) * (H - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle">
  <polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
</svg>`;
}

// ── Horizontal stacked bar ──

export function stackedBar(opts: {
  segments: { label: string; value: number; color?: string }[];
  height?: number;
}): string {
  const H = opts.height ?? 8;
  const total = opts.segments.reduce((s, d) => s + d.value, 0) || 1;
  let x = 0;
  let rectsSvg = "";

  opts.segments.forEach((seg, i) => {
    const w = (seg.value / total) * 100;
    const color = seg.color ?? colors.chart[i % colors.chart.length];
    const rx = i === 0 ? `rx="4"` : i === opts.segments.length - 1 ? `rx="4"` : "";
    rectsSvg += `<div style="width:${w}%;height:${H}px;background:${color};${i === 0 ? `border-radius:4px 0 0 4px` : ""}${i === opts.segments.length - 1 ? `border-radius:0 4px 4px 0` : ""}" title="${seg.label}: ${seg.value}"></div>`;
    x += w;
  });

  return `<div style="display:flex;width:100%;overflow:hidden;border-radius:4px">${rectsSvg}</div>`;
}
