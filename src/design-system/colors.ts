/**
 * Central color palette for the table app.
 * Tweak these values to restyle the entire application.
 * Tailwind tokens are generated from colors.ts and theme.ts in theme.css.
 */
export const colors = {
  brand: {
    50: "#f0fafa",
    100: "#daeeee",
    200: "#a1d2d2",
    300: "#6ec4bc",
    400: "#3dad9f",
    500: "#0e9b8c",
    600: "#073e38",
  },
  surface: {
    DEFAULT: "#ffffff",
    muted: "#fdf8f4",
    subtle: "#fef8e2",
    preview: "#daeeee",
  },
  border: {
    DEFAULT: "#d3d2d2",
    brand: "#a1d2d2",
    brandStrong: "#0e9b8c",
    preview: "#daeeee",
  },
  text: {
    DEFAULT: "#070606",
    secondary: "#242122",
    muted: "#565656",
    subtle: "#9ca3af",
  },
  destructive: {
    DEFAULT: "#c30014",
    hover: "#a30011",
    border: "#c30014",
    borderHover: "#5c1515",
  },
  error: {
    bg: "#fce8e8",
    border: "#fde5e0",
    text: "#5c1515",
  },
  overlay: {
    backdrop: "rgba(7, 6, 6, 0.45)",
  },
  skeleton: {
    from: "#d3d2d2",
    via: "#ebeaea",
    to: "#d3d2d2",
  },
  shadow: {
    modal: "rgba(7, 6, 6, 0.2)",
  },
} as const;

export type ColorToken = typeof colors;
