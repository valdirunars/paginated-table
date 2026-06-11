import type { HTMLAttributes } from "react";
import { cn } from "../utils";
import { Skeleton } from "./Skeleton";

type ButtonSkeletonProps = HTMLAttributes<HTMLSpanElement> & {
  width?: string;
};

export function ButtonSkeleton({
  className,
  width = "w-24",
  ...props
}: ButtonSkeletonProps) {
  return (
    <Skeleton
      className={cn(
        "h-[var(--skeleton-control-height)] shrink-0 rounded-ui-lg",
        width,
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
