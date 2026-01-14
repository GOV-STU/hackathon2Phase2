"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, checked, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only peer"
            ref={ref}
            checked={checked}
            {...props}
          />
          <div
            className={cn(
              "w-11 h-6 rounded-full transition-all duration-200 ease-premium",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-600 peer-focus-visible:ring-offset-2",
              "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
              checked
                ? "bg-primary-600 dark:bg-primary-500"
                : "bg-gray-300 dark:bg-gray-700",
              className
            )}
          >
            <motion.div
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
              animate={{
                x: checked ? 20 : 0,
              }}
              transition={{
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </div>
        </div>
        {label && (
          <span className="text-sm text-gray-900 dark:text-gray-50 select-none">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle };
