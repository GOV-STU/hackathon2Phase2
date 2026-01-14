"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, CheckCircle2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "All", href: "/dashboard", icon: Home },
  { name: "Today", href: "/dashboard/today", icon: Calendar },
  { name: "Completed", href: "/dashboard/completed", icon: CheckCircle2 },
];

interface MobileBottomNavProps {
  onAddTask?: () => void;
}

export function MobileBottomNav({ onAddTask }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ease-premium min-w-[64px]",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                isActive
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-600 dark:text-gray-400 active:bg-gray-100 dark:active:bg-gray-800"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}

        {/* Add Task Button */}
        <button
          onClick={onAddTask}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ease-premium min-w-[64px]",
            "text-primary-600 dark:text-primary-400",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            "active:scale-95"
          )}
        >
          <div className="h-8 w-8 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <span className="text-xs font-medium">Add</span>
        </button>
      </div>
    </nav>
  );
}
