"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, indeterminate, checked, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate]);

    return (
      <label className="inline-flex items-center gap-2 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only peer"
            ref={inputRef}
            checked={checked}
            {...props}
          />
          <div
            className={cn(
              "w-5 h-5 rounded border-2 transition-all duration-200 ease-premium",
              "flex items-center justify-center",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-600 peer-focus-visible:ring-offset-2",
              "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
              checked || indeterminate
                ? "bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500"
                : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 group-hover:border-primary-600 dark:group-hover:border-primary-500",
              className
            )}
          >
            {checked && !indeterminate && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </motion.div>
            )}
            {indeterminate && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Minus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </motion.div>
            )}
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

Checkbox.displayName = "Checkbox";

export { Checkbox };
