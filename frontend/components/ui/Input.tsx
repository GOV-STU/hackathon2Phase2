import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value !== "");
      props.onBlur?.(e);
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "peer w-full h-11 px-4 pt-5 pb-1 rounded-md border transition-all duration-200 ease-premium",
            "bg-white dark:bg-gray-900",
            "text-gray-900 dark:text-gray-50",
            "placeholder-transparent",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            error
              ? "border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400"
              : success
              ? "border-green-500 focus:ring-green-500 dark:border-green-400 dark:focus:ring-green-400"
              : "border-gray-200 dark:border-gray-800 focus:ring-primary-600 dark:focus:ring-primary-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={label || props.placeholder}
          {...props}
        />
        {label && (
          <label
            className={cn(
              "absolute left-4 transition-all duration-200 ease-premium pointer-events-none",
              "text-gray-600 dark:text-gray-400",
              isFocused || hasValue || props.value
                ? "top-1.5 text-xs font-medium"
                : "top-3 text-base",
              error
                ? "text-red-500 dark:text-red-400"
                : success
                ? "text-green-500 dark:text-green-400"
                : "peer-focus:text-primary-600 dark:peer-focus:text-primary-500"
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
