import type { ButtonHTMLAttributes } from "react";
import { interactive } from "../styles";
import { cn } from "../utils";

export type ButtonVariant = "default" | "destructive" | "ghost" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  hidden?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  default: cn(
    "shrink-0 rounded-ui-lg border border-brand-600 bg-brand-500 px-control-x py-control-y text-surface shadow-ui-sm",
    interactive.transition,
    "hover:enabled:-translate-y-px hover:enabled:border-brand-600 hover:enabled:bg-brand-600 hover:enabled:shadow-ui-md",
    "active:enabled:translate-y-0",
    interactive.focusRing,
  ),
  destructive: cn(
    "shrink-0 rounded-ui-lg border border-destructive-border bg-destructive px-control-x py-control-y text-surface shadow-ui-sm",
    interactive.transition,
    "hover:enabled:-translate-y-px hover:enabled:border-destructive-border-hover hover:enabled:bg-destructive-hover hover:enabled:shadow-ui-md",
    "active:enabled:translate-y-0",
    interactive.focusRing,
  ),
  ghost: cn(
    "w-full rounded-ui-md border-0 bg-transparent p-0 text-left",
    interactive.transition,
    "hover:enabled:bg-brand-50",
    interactive.focusRing,
  ),
  icon: cn(
    "absolute top-ui-sm right-ui-sm size-icon-button rounded-ui-full border-0 bg-surface/80 text-xl leading-none text-foreground-muted shadow-ui-sm backdrop-blur-sm",
    interactive.transition,
    "hover:enabled:bg-brand-100 hover:enabled:text-foreground hover:enabled:shadow-ui-md",
    interactive.focusRing,
  ),
};

export function Button({
  variant = "default",
  hidden = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "cursor-pointer font-[inherit]",
        interactive.disabled,
        variantStyles[variant],
        hidden && interactive.hidden,
        className,
      )}
      {...props}
    />
  );
}
