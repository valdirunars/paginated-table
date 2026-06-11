import type { HTMLAttributes } from "react";
import { surfaces } from "../styles";
import { cn } from "../utils";
import { Button } from "./Button";

type ErrorAlertProps = HTMLAttributes<HTMLDivElement> & {
  message: string;
  onRetry: () => void;
  retryLabel?: string;
};

export function ErrorAlert({
  message,
  onRetry,
  retryLabel = "Retry",
  className,
  ...props
}: ErrorAlertProps) {
  return (
    <div
      className={cn(
        "mb-ui-md flex items-center justify-between gap-ui-md px-panel-x py-ui-md",
        surfaces.error,
        className,
      )}
      role="alert"
      {...props}
    >
      <span>{message}</span>
      <Button onClick={onRetry}>{retryLabel}</Button>
    </div>
  );
}
