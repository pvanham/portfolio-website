/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative inline-flex items-center justify-center p-2 rounded-md opacity-50 cursor-default"
        aria-label="Toggle theme"
        disabled
      >
        <Moon size={24} />
      </button>
    );
  }

  const isCurrentlyDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isCurrentlyDark ? "light" : "dark")}
      // Removed focus:ring-2 and focus:ring-ring
      className="relative inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label="Toggle theme"
    >
      <Sun
        size={20}
        className={
          "absolute transition-all duration-300 ease-in-out " +
          (isCurrentlyDark
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-50 rotate-90")
        }
      />
      <Moon
        size={24}
        className={
          "absolute transition-all duration-300 ease-in-out " +
          (!isCurrentlyDark
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-50 -rotate-90")
        }
      />
      <span className="opacity-0">
        <Moon size={20} />
      </span>
    </button>
  );
}
