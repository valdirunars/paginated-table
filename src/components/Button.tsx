import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "default" | "destructive" | "ghost" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  hidden?: boolean;
};

export function Button({
  variant = "default",
  hidden = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = [
    "button",
    `button--${variant}`,
    hidden ? "button--hidden" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={classes} {...props} />;
}
