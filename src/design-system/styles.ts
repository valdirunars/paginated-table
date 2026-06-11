import { cn } from "./utils";

/** Shared interaction states used across atoms. */
export const interactive = {
  transition: cn(
    "transition-[background-color,border-color,box-shadow,transform] duration-ui-fast ease-ui",
  ),
  focusRing: cn(
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40 focus-visible:ring-offset-1",
  ),
  disabled: "disabled:cursor-not-allowed disabled:opacity-55",
  hidden: "pointer-events-none invisible",
} as const;

/** Reusable surface patterns for pages, panels, and overlays. */
export const surfaces = {
  page: "box-border flex h-dvh flex-col gap-ui-lg overflow-auto bg-surface-muted p-page text-foreground",
  panel: cn(
    "rounded-ui-lg border border-border-brand bg-surface shadow-ui-sm",
  ),
  panelInset: cn(
    "rounded-ui-lg border border-border-preview bg-surface-preview shadow-ui-sm",
  ),
  error: cn(
    "rounded-ui-lg border border-error-border bg-error-bg text-error-text shadow-ui-sm",
  ),
  modalBackdrop: "fixed inset-0 z-modal flex items-center justify-center bg-overlay-backdrop p-ui-lg",
  modal: cn(
    "relative w-full max-w-modal rounded-ui-xl bg-surface px-panel-x py-panel-y shadow-modal",
  ),
  tableScroll: "min-h-0 flex-1 overflow-auto",
  tableHeaderCell: cn(
    "sticky top-0 z-sticky border-b border-border bg-surface-muted px-table-cell-x py-table-cell-y text-left",
  ),
  tableCell: "border-b border-border px-table-cell-x py-table-cell-y text-left",
} as const;
