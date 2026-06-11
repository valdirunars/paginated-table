import type { InputHTMLAttributes } from "react";
import { interactive } from "../styles";
import { cn } from "../utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "min-w-input-min rounded-ui-lg border border-border-brand bg-surface px-input-x py-input-y font-[inherit] shadow-ui-sm",
        interactive.transition,
        "placeholder:text-foreground-subtle",
        "hover:border-brand-400",
        "focus:border-brand-500 focus:shadow-focus",
        interactive.focusRing,
        className,
      )}
      {...props}
    />
  );
}
