"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "./Icons";

type Theme = "light" | "dark";

const systemTheme = (): Theme => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
const currentTheme = (): Theme => (document.documentElement.dataset.theme as Theme | undefined) ?? systemTheme();

/**
 * One button: light or dark. Picking the opposite of the device saves
 * the choice; picking the same as the device clears it, so the site goes
 * back to following the device rather than pinning a setting the visitor
 * has forgotten about.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  // Unknown until mounted: the HTML is the same for everyone.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(currentTheme());
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    try {
      if (next === systemTheme()) {
        delete root.dataset.theme;
        localStorage.removeItem("theme");
      } else {
        root.dataset.theme = next;
        localStorage.setItem("theme", next);
      }
    } catch {
      root.dataset.theme = next;
    }
    setTheme(next);
  };

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`flex h-11 w-11 flex-none items-center justify-center rounded-full border border-paper/20 text-paper transition-colors hover:border-paper/45 ${className}`}
    >
      {theme === null ? null : theme === "dark" ? <Sun size={19} /> : <Moon size={18} />}
    </button>
  );
}
