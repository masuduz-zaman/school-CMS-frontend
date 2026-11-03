"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-full border border-slate-200 bg-white/50 dark:border-white/10 dark:bg-white/10" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle color theme"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-700 shadow-sm backdrop-blur-xl transition hover:scale-105 dark:border-white/10 dark:bg-slate-800/70 dark:text-amber-300"
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}