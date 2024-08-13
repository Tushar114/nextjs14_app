"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");

  const handleThemeChange = () => {
    // Update theme in LS
    localStorage.setItem("theme", mode);

    const savedTheme = localStorage.getItem("theme");
    const isSysThemeDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const newMode =
      savedTheme === "dark" || (savedTheme === "system" && isSysThemeDark)
        ? "dark"
        : "light";

    newMode === "dark"
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  };

  useEffect(() => {
    handleThemeChange();
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
