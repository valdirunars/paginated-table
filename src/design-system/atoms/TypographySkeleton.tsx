import type { HTMLAttributes } from "react";
import { cn } from "../utils";
import { Skeleton } from "./Skeleton";

export type TypographySkeletonVariant = "h1" | "caption" | "body-sm";

const heightClassByVariant: Record<TypographySkeletonVariant, string> = {
  h1: "h-[var(--skeleton-h1-height)]",
  caption: "h-[var(--skeleton-caption-height)]",
  "body-sm": "h-[var(--skeleton-body-sm-height)]",
};

const defaultWidthByVariant: Record<TypographySkeletonVariant, string> = {
  h1: "w-80",
  caption: "w-56",
  "body-sm": "w-48",
};

type TypographySkeletonProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: TypographySkeletonVariant;
  width?: string;
};

export function TypographySkeleton({
  className,
  variant = "caption",
  width,
  ...props
}: TypographySkeletonProps) {
  return (
    <Skeleton
      className={cn(
        "shrink-0",
        heightClassByVariant[variant],
        width ?? defaultWidthByVariant[variant],
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
