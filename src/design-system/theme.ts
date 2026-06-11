/**
 * Non-color theme tokens for the table app.
 * Tweak these values to shift radius, spacing, shadows, typography, and motion.
 * Mirror changes in theme.css so Tailwind utilities stay in sync.
 */
export const theme = {
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.625rem",
    xl: "0.75rem",
    full: "9999px",
  },
  spacing: {
    controlX: "0.75rem",
    controlY: "0.45rem",
    inputX: "0.75rem",
    inputY: "0.5rem",
    panelX: "1.25rem",
    panelY: "1rem",
    tableCellX: "0.75rem",
    tableCellY: "0.5rem",
    gapSm: "0.5rem",
    gapMd: "0.75rem",
    gapLg: "1rem",
    page: "2rem",
  },
  border: {
    width: "1px",
  },
  shadow: {
    sm: "0 1px 2px rgba(7, 6, 6, 0.06), 0 1px 3px rgba(7, 6, 6, 0.08)",
    md: "0 4px 12px rgba(7, 6, 6, 0.08), 0 2px 4px rgba(7, 6, 6, 0.04)",
    modal: "0 20px 50px rgba(7, 6, 6, 0.2)",
    focus: "0 0 0 3px rgba(14, 155, 140, 0.35)",
  },
  motion: {
    fast: "150ms",
    normal: "200ms",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  typography: {
    display: { size: "1.75rem", lineHeight: "1.25", weight: "600" },
    h1: { size: "1.5rem", lineHeight: "1.35", weight: "600" },
    h2: { size: "1.25rem", lineHeight: "1.4", weight: "600" },
    h3: { size: "1.125rem", lineHeight: "1.45", weight: "600" },
    body: { size: "1rem", lineHeight: "1.5", weight: "400" },
    bodySm: { size: "0.875rem", lineHeight: "1.5", weight: "400" },
    caption: { size: "0.875rem", lineHeight: "1.45", weight: "400" },
    label: { size: "0.875rem", lineHeight: "1.4", weight: "500" },
  },
  size: {
    checkbox: "1rem",
    iconButton: "2rem",
    bulkBar: "3rem",
    inputMinWidth: "16rem",
    modalMaxWidth: "36rem",
    previewMaxHeight: "12rem",
    tableMinHeight: "22rem",
  },
  zIndex: {
    sticky: "1",
    modal: "20",
    overlay: "9999",
  },
} as const;

export type ThemeToken = typeof theme;
