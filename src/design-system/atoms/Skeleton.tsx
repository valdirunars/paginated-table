import type { HTMLAttributes } from "react";
import { cn } from "../utils";

type SkeletonProps = HTMLAttributes<HTMLSpanElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <span
      className={cn(
        "block h-4 w-full rounded-ui-md bg-linear-to-r from-skeleton-from via-skeleton-via to-skeleton-to bg-size-[400%_100%] animate-skeleton-pulse",
        className,
      )}
      {...props}
    />
  );
}
