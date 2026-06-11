import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils";

type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "body-sm"
  | "caption"
  | "muted"
  | "label";

const variantStyles: Record<TypographyVariant, string> = {
  display: "text-display text-foreground",
  h1: "text-h1 text-foreground",
  h2: "text-h2 text-foreground",
  h3: "text-h3 text-foreground",
  body: "text-body text-foreground",
  "body-sm": "text-body-sm text-foreground",
  caption: "text-caption text-foreground-muted",
  muted: "text-body-sm text-foreground-subtle",
  label: "text-label text-foreground",
};

const defaultElements: Record<TypographyVariant, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  "body-sm": "p",
  caption: "p",
  muted: "p",
  label: "span",
};

type TypographyProps = HTMLAttributes<HTMLElement> & {
  variant?: TypographyVariant;
  as?: ElementType;
  children: ReactNode;
};

export function Typography({
  variant = "body",
  as,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = as ?? defaultElements[variant];

  return (
    <Component className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
