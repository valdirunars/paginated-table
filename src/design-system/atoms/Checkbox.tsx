import type { ChangeEventHandler } from "react";
import { useEffect, useRef } from "react";
import { interactive } from "../styles";
import { cn } from "../utils";

type CheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  "aria-label": string;
  className?: string;
};

export function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  className,
  "aria-label": ariaLabel,
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.indeterminate = !checked && indeterminate;
  }, [checked, indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
      className={cn(
        "size-checkbox cursor-pointer rounded-ui-sm border border-border-brand-strong accent-brand-500 shadow-ui-sm",
        interactive.transition,
        "hover:border-brand-500",
        interactive.focusRing,
        className,
      )}
    />
  );
}
