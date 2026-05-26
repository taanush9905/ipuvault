import { createContext, useContext, useEffect, useState } from "react";
import { applyColorTheme, getStoredColorTheme, type ColorThemeId } from "@/lib/color-themes";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
  colorTheme: ColorThemeId;
  setColorTheme: (id: ColorThemeId) => void;
}>({
  theme: "light",
  toggle: () => {},
  colorTheme: "fresh-green",
  setColorTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("pyq:theme") as Theme | null;
    if (stored) return stored;
    return "light";
  });

  const [colorTheme, setColorThemeState] = useState<ColorThemeId>(() =>
    typeof window === "undefined" ? "fresh-green" : getStoredColorTheme()
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("pyq:theme", theme);
    applyColorTheme(colorTheme, theme);
  }, [theme, colorTheme]);

  const setColorTheme = (id: ColorThemeId) => {
    setColorThemeState(id);
    applyColorTheme(id, theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")),
        colorTheme,
        setColorTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
