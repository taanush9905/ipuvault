import { loadGoogleFont } from "@/lib/google-fonts";

export type FontThemeId = string;

export type FontTheme = {
  id: FontThemeId;
  name: string;
  category: "Sans" | "Serif" | "Mono" | "Display";
  stack: string;
  /** Loads from Google Fonts when set — makes preview visibly different */
  googleFamily?: string;
};

export const FONT_THEMES: FontTheme[] = [
  { id: "inter", name: "Inter", category: "Sans", stack: '"Inter", ui-sans-serif, system-ui, sans-serif', googleFamily: "Inter" },
  { id: "geist", name: "Geist", category: "Sans", stack: '"Geist", "Geist Sans", ui-sans-serif, sans-serif', googleFamily: "Geist" },
  { id: "satoshi", name: "Satoshi", category: "Sans", stack: '"Satoshi", ui-sans-serif, sans-serif' },
];

export const DEFAULT_FONT_THEME: FontThemeId = "inter";
export const FONT_THEME_STORAGE_KEY = "pyq:font-theme";

export function applyFontTheme(id: FontThemeId) {
  const font = FONT_THEMES.find((f) => f.id === id) ?? FONT_THEMES[0];
  if (font.googleFamily) loadGoogleFont(font.googleFamily);
  document.documentElement.style.setProperty("--font-sans", font.stack);
  document.body.style.fontFamily = font.stack;
  document.documentElement.setAttribute("data-font", font.id);
  localStorage.setItem(FONT_THEME_STORAGE_KEY, id);
}

export function getStoredFontTheme(): FontThemeId {
  const stored = localStorage.getItem(FONT_THEME_STORAGE_KEY);
  if (stored && FONT_THEMES.some((f) => f.id === stored)) return stored;
  return DEFAULT_FONT_THEME;
}
