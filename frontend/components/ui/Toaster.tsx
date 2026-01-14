"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as "light" | "dark" | "system"}
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-gray-900 dark:group-[.toaster]:text-gray-50 dark:group-[.toaster]:border-gray-800",
          description: "group-[.toast]:text-gray-600 dark:group-[.toast]:text-gray-400",
          actionButton:
            "group-[.toast]:bg-primary-600 group-[.toast]:text-white dark:group-[.toast]:bg-primary-500",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-900 dark:group-[.toast]:bg-gray-800 dark:group-[.toast]:text-gray-50",
        },
      }}
    />
  );
}
