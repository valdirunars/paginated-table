import type { HTMLAttributes } from "react";
import { TypographySkeleton, type TypographySkeletonVariant } from "./TypographySkeleton";

type CaptionSkeletonProps = HTMLAttributes<HTMLSpanElement> & {
  width?: string;
  variant?: Extract<TypographySkeletonVariant, "caption" | "body-sm">;
};

export function CaptionSkeleton({
  variant = "caption",
  ...props
}: CaptionSkeletonProps) {
  return <TypographySkeleton variant={variant} {...props} />;
}
