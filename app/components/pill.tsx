import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const pillVariants = cva("rounded-md px-2", {
    variants: {
        variant: {
            info: "bg-status-info/14 text-status-info",
            error: "bg-status-error/14 text-status-error",
            warning: "bg-status-warning/14 text-status-warning",
            success: "bg-status-success/14 text-status-success",
            accent: "bg-accent-primary/14 text-accent-primary",
        },
    },
    defaultVariants: {
        variant: "info",
    },
});

type PillProps = VariantProps<typeof pillVariants> & {
    children?: ReactNode;
    className?: string;
};

export default function Pill({ variant, children, className }: PillProps) {
    return (
        <span className={pillVariants({ variant })}>
            <span className={"text-body px-1 " + className}>{children}</span>
        </span>
    );
}
