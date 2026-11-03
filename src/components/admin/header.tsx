"use client";

import { Menu, Bell, Search } from "lucide-react";
import ThemeToggle from "@/components/ui/theme-toggle";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/70 bg-white/75 px-4 backdrop-blur-2xl dark:border-white/10 dark:bg-[#080e1b]/75 sm:px-7">

      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-xl border border-slate-200 p-2 text-slate-600 dark:border-white/10 dark:text-white md:hidden"
        >
          <Menu size={21} />
        </button>

        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
            Administration
          </h1>
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
            Manage your school activities
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          aria-label="Search"
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 sm:flex"
        >
          <Search size={19} />
        </button>

        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
        >
          <Bell size={19} />
        </button>

        <ThemeToggle />

        <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white sm:flex">
          A
        </div>
      </div>
    </header>
  );
}