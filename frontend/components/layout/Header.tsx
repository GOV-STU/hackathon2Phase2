"use client";

import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { MobileSidebar } from "./MobileSidebar";
import { useState } from "react";
import { auth } from "@/lib/auth";

export function Header() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const user = auth.getCurrentUser();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 md:h-16 items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-3 md:gap-8">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden w-9 h-9 p-0 -ml-2"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-primary-600 dark:bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-bold text-base md:text-lg">T</span>
                </div>
                <span className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-50">
                  Todo
                </span>
              </Link>

              {/* Search - Desktop */}
              <div className="hidden lg:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    aria-label="Search tasks"
                    className="w-64 xl:w-80 h-9 pl-9 pr-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-50 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 md:gap-3">
              <DarkModeToggle />

              {/* User Menu - Desktop */}
              <div className="hidden md:flex items-center gap-3">
                <Avatar
                  src=""
                  fallback={user?.name || "User"}
                  size="sm"
                  className="cursor-pointer hover:ring-2 hover:ring-primary-500 hover:ring-offset-2 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
    </>
  );
}
