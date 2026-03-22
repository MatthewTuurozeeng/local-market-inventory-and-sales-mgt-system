import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = "vendor-space-theme";

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const getStoredTheme = (): Theme | null => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    return getStoredTheme() ?? getSystemTheme();
  });
  const [usesSystemTheme, setUsesSystemTheme] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return getStoredTheme() === null;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (!usesSystemTheme) {
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      setThemeState(event.matches ? "dark" : "light");
    };
    if (media.addEventListener) {
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
    media.addListener(handler);
    return () => media.removeListener(handler);
  }, [usesSystemTheme]);

  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }
      if (!event.newValue) {
        setUsesSystemTheme(true);
        setThemeState(getSystemTheme());
        return;
      }
      if (event.newValue === "light" || event.newValue === "dark") {
        setUsesSystemTheme(false);
        setThemeState(event.newValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    setUsesSystemTheme(false);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export type { Theme };
