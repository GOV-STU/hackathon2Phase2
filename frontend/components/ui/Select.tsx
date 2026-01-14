"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select an option",
      label,
      error,
      disabled,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value);
    const selectRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => selectRef.current!);

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
    };

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    React.useEffect(() => {
      setSelectedValue(value);
    }, [value]);

    return (
      <div ref={selectRef} className={cn("relative w-full", className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full h-11 px-4 rounded-md border transition-all duration-200 ease-premium",
            "bg-white dark:bg-gray-900",
            "text-gray-900 dark:text-gray-50",
            "flex items-center justify-between",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            error
              ? "border-red-500 focus:ring-red-500 dark:border-red-400"
              : "border-gray-200 dark:border-gray-800 focus:ring-primary-600 dark:focus:ring-primary-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isOpen && "ring-2 ring-primary-600 dark:ring-primary-500"
          )}
        >
          <span
            className={cn(
              "text-base",
              !selectedOption && "text-gray-500 dark:text-gray-400"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full px-4 py-2 text-left text-base transition-colors duration-150",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "flex items-center justify-between",
                  selectedValue === option.value &&
                    "bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400"
                )}
              >
                <span>{option.label}</span>
                {selectedValue === option.value && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
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

Select.displayName = "Select";

export { Select };
