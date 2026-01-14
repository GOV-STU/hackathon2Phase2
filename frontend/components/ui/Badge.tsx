import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        high: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
        medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
        low: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
        default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      },
      size: {
        sm: "text-xs px-1.5 py-0.5",
        md: "text-xs px-2 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
