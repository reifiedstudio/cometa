/**
 * Design tokens — inline-safe values for all components.
 * No CSS variables, no external refs. Just values.
 */

export const colors = {
  // Neutrals
  bg: "#ffffff",
  bgMuted: "#f8f9fa",
  bgSubtle: "#f1f3f5",
  border: "#e2e5e9",
  borderLight: "#eef0f2",

  text: "#1a1a1a",
  textMuted: "#6b7280",
  textLight: "#9ca3af",

  // Semantic
  primary: "#2563eb",
  primaryLight: "#eff6ff",

  success: "#16a34a",
  successLight: "#f0fdf4",
  successBorder: "#bbf7d0",

  warning: "#d97706",
  warningLight: "#fffbeb",
  warningBorder: "#fde68a",

  error: "#dc2626",
  errorLight: "#fef2f2",
  errorBorder: "#fecaca",

  info: "#2563eb",
  infoLight: "#eff6ff",
  infoBorder: "#bfdbfe",

  // Chart palette
  chart: ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#8b5cf6", "#06b6d4", "#ec4899", "#f59e0b"],
} as const;

export const font = {
  family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'SF Mono', 'Fira Code', 'Consolas', monospace",
  size: {
    xs: "11px",
    sm: "13px",
    base: "14px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
  },
  weight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "32px",
} as const;

export const radius = {
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  full: "9999px",
} as const;
