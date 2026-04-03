"use client";

import * as React from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme-constants";

export type ThemePreference = "light" | "dark" | "system";

type Ctx = {
  theme: ThemePreference;
  setTheme: (t: ThemePreference) => void;
  resolvedTheme: "light" | "dark";
  mounted: boolean;
};

const ThemeCtx = React.createContext<Ctx | null>(null);

function getSystemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readStored(): ThemePreference {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return "system";
}

function applyHtmlClass(isDark: boolean) {
  const root = document.documentElement;
  if (isDark) root.classList.add("dark");
  else root.classList.remove("dark");
}

function resolveToDark(pref: ThemePreference): boolean {
  if (pref === "dark") return true;
  if (pref === "light") return false;
  return getSystemDark();
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setThemeState] = React.useState<ThemePreference>("system");
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  React.useEffect(() => {
    const stored = readStored();
    setThemeState(stored);
    const dark = resolveToDark(stored);
    setResolvedTheme(dark ? "dark" : "light");
    applyHtmlClass(dark);
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    const dark = resolveToDark(theme);
    setResolvedTheme(dark ? "dark" : "light");
    applyHtmlClass(dark);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme, mounted]);

  React.useEffect(() => {
    if (!mounted || theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const dark = getSystemDark();
      setResolvedTheme(dark ? "dark" : "light");
      applyHtmlClass(dark);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme, mounted]);

  const setTheme = React.useCallback((t: ThemePreference) => {
    setThemeState(t);
  }, []);

  const value = React.useMemo<Ctx>(
    () => ({ theme, setTheme, resolvedTheme, mounted }),
    [theme, setTheme, resolvedTheme, mounted]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useAppTheme() {
  const ctx = React.useContext(ThemeCtx);
  if (!ctx) throw new Error("useAppTheme must be used within AppThemeProvider");
  return ctx;
}
