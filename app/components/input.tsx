import { cn } from "cn";
import type { ComponentProps } from "react";

export function Input({ className, ...props }: ComponentProps<"input">) {
    return (
        <input
            className={cn(
                "text-body w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-primary transition-colors outline-none placeholder:text-tertiary hover:border-tertiary focus-visible:ring-2 focus-visible:ring-accent-primary aria-invalid:border-status-error",
                className,
            )}
            {...props}
        />
    );
}
