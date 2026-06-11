import type { HTMLAttributes } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { ButtonSkeleton } from "../atoms/ButtonSkeleton";
import { interactive, surfaces } from "../styles";
import { cn } from "../utils";

export type SelectLanguageOption = {
  value: string;
  emoji: string;
  languageName: string;
};

type SelectLanguageProps = {
  value: string;
  options: SelectLanguageOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
};

export function SelectLanguage({
  value,
  options,
  onChange,
  ariaLabel,
  className,
}: SelectLanguageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!selected) {
    return null;
  }

  return (
    <div ref={containerRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "inline-flex cursor-pointer items-center gap-ui-sm rounded-ui-lg border border-border-brand bg-surface px-control-x py-control-y text-caption text-foreground shadow-ui-sm",
          interactive.transition,
          "hover:border-brand-400 hover:bg-brand-50",
          interactive.focusRing,
        )}
      >
        <span aria-hidden="true">{selected.emoji}</span>
        <span>{selected.languageName}</span>
        <span aria-hidden="true" className="text-foreground-muted">
          ▾
        </span>
      </button>
      {isOpen ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className={cn(
            "absolute top-[calc(100%+var(--spacing-ui-sm))] right-0 z-sticky min-w-full list-none p-ui-sm",
            surfaces.panel,
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-ui-sm rounded-ui-md border-0 px-ui-sm py-ui-sm text-left text-caption",
                    interactive.transition,
                    isSelected
                      ? "bg-brand-50 text-foreground"
                      : "bg-transparent text-foreground hover:bg-brand-50",
                    interactive.focusRing,
                  )}
                >
                  <span aria-hidden="true">{option.emoji}</span>
                  <span>{option.languageName}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

type SelectLanguageSkeletonProps = HTMLAttributes<HTMLSpanElement>;

export function SelectLanguageSkeleton({
  className,
  ...props
}: SelectLanguageSkeletonProps) {
  return (
    <ButtonSkeleton
      width="w-[7.5rem]"
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}
