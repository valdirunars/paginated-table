import type { HTMLAttributes } from "react";
import { ButtonSkeleton } from "../atoms/ButtonSkeleton";
import { CaptionSkeleton } from "../atoms/CaptionSkeleton";
import { cn } from "../utils";

type PaginationSkeletonProps = HTMLAttributes<HTMLDivElement>;

export function PaginationSkeleton({ className, ...props }: PaginationSkeletonProps) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      aria-hidden="true"
      {...props}
    >
      <CaptionSkeleton width="w-48" variant="body-sm" />
      <div className="flex gap-ui-sm">
        <ButtonSkeleton width="w-20" />
        <ButtonSkeleton width="w-16" />
      </div>
    </div>
  );
}
