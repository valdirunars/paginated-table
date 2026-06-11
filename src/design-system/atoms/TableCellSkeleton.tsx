import type { HTMLAttributes } from "react";
import { cn } from "../utils";
import { Skeleton } from "./Skeleton";

type TableCellSkeletonProps = HTMLAttributes<HTMLSpanElement>;

export function TableCellSkeleton({ className, ...props }: TableCellSkeletonProps) {
  return (
    <Skeleton
      className={cn("h-[var(--skeleton-table-cell-height)] w-full", className)}
      aria-hidden="true"
      {...props}
    />
  );
}
