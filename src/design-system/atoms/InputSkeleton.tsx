import type { HTMLAttributes } from "react";
import { cn } from "../utils";
import { Skeleton } from "./Skeleton";

type InputSkeletonProps = HTMLAttributes<HTMLLabelElement>;

export function InputSkeleton({ className, ...props }: InputSkeletonProps) {
  return (
    <label
      className={cn("flex w-fit max-w-full items-center gap-ui-sm", className)}
      {...props}
    >
      <Skeleton
        className="h-[var(--skeleton-input-height)] w-[var(--spacing-input-min)] shrink-0 rounded-ui-lg"
        aria-hidden="true"
      />
    </label>
  );
}
