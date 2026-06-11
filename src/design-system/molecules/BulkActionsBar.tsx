import type { HTMLAttributes } from "react";
import type { ButtonVariant } from "../atoms/Button";
import { Button } from "../atoms/Button";
import { Skeleton } from "../atoms/Skeleton";
import { surfaces } from "../styles";
import { cn } from "../utils";

export type BulkActionButton = {
  id: string;
  label: string;
  variant?: ButtonVariant;
  onClick: () => void;
};

type BulkActionsBarProps = HTMLAttributes<HTMLDivElement> & {
  selectionLabel: string;
  clearSelectionLabel: string;
  showActions: boolean;
  onClearSelection: () => void;
  actions: BulkActionButton[];
};

export const bulkActionsBarLayout = cn(
  "flex items-center justify-between gap-ui-md px-panel-x py-ui-md",
);

export function BulkActionsBar({
  selectionLabel,
  clearSelectionLabel,
  showActions,
  onClearSelection,
  actions,
  className,
  ...props
}: BulkActionsBarProps) {
  return (
    <div
      className={cn("box-border", bulkActionsBarLayout, surfaces.panel, className)}
      role={showActions ? "status" : undefined}
      aria-live={showActions ? "polite" : undefined}
      {...props}
    >
      <span>{selectionLabel}</span>
      <div className="flex items-center gap-ui-md">
        <Button
          hidden={!showActions}
          onClick={onClearSelection}
          disabled={!showActions}
          tabIndex={showActions ? 0 : -1}
          aria-hidden={!showActions}
        >
          {clearSelectionLabel}
        </Button>
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            hidden={!showActions}
            onClick={action.onClick}
            disabled={!showActions}
            tabIndex={showActions ? 0 : -1}
            aria-hidden={!showActions}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

type BulkActionsBarSkeletonProps = HTMLAttributes<HTMLDivElement>;

export function BulkActionsBarSkeleton({
  className,
  ...props
}: BulkActionsBarSkeletonProps) {
  return (
    <div
      className={cn("box-border w-full", bulkActionsBarLayout, surfaces.panel, className)}
      aria-hidden="true"
      {...props}
    >
      <Skeleton className="h-[var(--skeleton-control-height)] w-full rounded-ui-lg" />
    </div>
  );
}
