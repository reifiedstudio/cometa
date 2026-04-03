/**
 * Cometa Design Tokens
 * Extracted from cometa.co
 */

export const colors = {
  // Brand
  brand: {
    gold: "#D09305",
    goldBright: "#FFBB0D",
    goldLight: "#FFB300",
  },

  // Backgrounds
  background: {
    primary: "#FFFFFF",
    secondary: "#F8F8F8",
    tertiary: "#F1F1F1",
    dark: "#141414",
    darkAlt: "#1A1A1A",
  },

  // Text
  text: {
    primary: "#212327",
    secondary: "#555A65",
    tertiary: "#464E58",
    muted: "#717983",
    mutedAlt: "#80838B",
    disabled: "#B4B6BC",
    disabledAlt: "#D5DAE1",
    inverse: "#FFFFFF",
    dark: "#2C2F34",
    card: "#444444",
  },

  // Neutrals
  neutral: {
    0: "#000000",
    50: "#F8F8F8",
    75: "#F1F1F1",
    100: "#EBEEF1",
    150: "#E0E0E0",
    200: "#D2D3D5",
    250: "#D5DAE1",
    300: "#BCCACE",
    400: "#B4B6BC",
    450: "#A8A8A8",
    500: "#80838B",
    600: "#717983",
    700: "#555A65",
    750: "#4A4A4A",
    800: "#464E58",
    850: "#444444",
    900: "#2C2F34",
    950: "#212327",
    1000: "#141414",
  },

  // Accent
  accent: {
    blue: "#0075C9",
    blueLight: "#E6F1FA",
    green: "#16A349",
  },

  // Overlays
  overlay: {
    light90: "rgba(255, 255, 255, 0.9)",
    light50: "rgba(255, 255, 255, 0.5)",
    light10: "rgba(255, 255, 255, 0.1)",
    dark50: "rgba(0, 0, 0, 0.5)",
    dark10: "rgba(0, 0, 0, 0.1)",
    goldHover: "rgba(208, 147, 5, 0.7)",
    shadow: "rgba(70, 78, 88, 0.1)",
    shadowLight: "rgba(187, 187, 187, 0.5)",
  },
} as const;

export const fonts = {
  heading: "'Aeonik', sans-serif",
  body: "'Inter', sans-serif",
  secondary: "'Noto Sans', sans-serif",
} as const;

export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700,
} as const;

export type Colors = typeof colors;
export type Fonts = typeof fonts;
export type FontWeights = typeof fontWeights;
