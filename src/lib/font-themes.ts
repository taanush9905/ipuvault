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
  { id: "sf-pro", name: "SF Pro", category: "Sans", stack: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif' },
  { id: "inter", name: "Inter", category: "Sans", stack: '"Inter", ui-sans-serif, system-ui, sans-serif', googleFamily: "Inter" },
  { id: "geist", name: "Geist", category: "Sans", stack: '"Geist", "Geist Sans", ui-sans-serif, sans-serif' },
  { id: "helvetica", name: "Helvetica Neue", category: "Sans", stack: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { id: "segoe", name: "Segoe UI", category: "Sans", stack: '"Segoe UI", system-ui, sans-serif' },
  { id: "roboto", name: "Roboto", category: "Sans", stack: 'Roboto, "Helvetica Neue", Arial, sans-serif' },
  { id: "plus-jakarta", name: "Plus Jakarta Sans", category: "Sans", stack: '"Plus Jakarta Sans", ui-sans-serif, sans-serif', googleFamily: "Plus Jakarta Sans" },
  { id: "manrope", name: "Manrope", category: "Sans", stack: 'Manrope, ui-sans-serif, sans-serif', googleFamily: "Manrope" },
  { id: "dm-sans", name: "DM Sans", category: "Sans", stack: '"DM Sans", ui-sans-serif, sans-serif', googleFamily: "DM Sans" },
  { id: "outfit", name: "Outfit", category: "Sans", stack: 'Outfit, ui-sans-serif, sans-serif', googleFamily: "Outfit" },
  { id: "satoshi", name: "Satoshi", category: "Sans", stack: 'Satoshi, ui-sans-serif, sans-serif' },
  { id: "general-sans", name: "General Sans", category: "Sans", stack: '"General Sans", ui-sans-serif, sans-serif' },
  { id: "cabinet", name: "Cabinet Grotesk", category: "Display", stack: '"Cabinet Grotesk", ui-sans-serif, sans-serif' },
  { id: "sora", name: "Sora", category: "Sans", stack: 'Sora, ui-sans-serif, sans-serif', googleFamily: "Sora" },
  { id: "urbanist", name: "Urbanist", category: "Sans", stack: 'Urbanist, ui-sans-serif, sans-serif', googleFamily: "Urbanist" },
  { id: "figtree", name: "Figtree", category: "Sans", stack: 'Figtree, ui-sans-serif, sans-serif', googleFamily: "Figtree" },
  { id: "nunito", name: "Nunito", category: "Sans", stack: 'Nunito, ui-sans-serif, sans-serif', googleFamily: "Nunito" },
  { id: "poppins", name: "Poppins", category: "Sans", stack: 'Poppins, ui-sans-serif, sans-serif', googleFamily: "Poppins" },
  { id: "montserrat", name: "Montserrat", category: "Sans", stack: 'Montserrat, ui-sans-serif, sans-serif', googleFamily: "Montserrat" },
  { id: "work-sans", name: "Work Sans", category: "Sans", stack: '"Work Sans", ui-sans-serif, sans-serif', googleFamily: "Work Sans" },
  { id: "rubik", name: "Rubik", category: "Sans", stack: 'Rubik, ui-sans-serif, sans-serif', googleFamily: "Rubik" },
  { id: "lexend", name: "Lexend", category: "Sans", stack: 'Lexend, ui-sans-serif, sans-serif', googleFamily: "Lexend" },
  { id: "space-grotesk", name: "Space Grotesk", category: "Display", stack: '"Space Grotesk", ui-sans-serif, sans-serif', googleFamily: "Space Grotesk" },
  { id: "syne", name: "Syne", category: "Display", stack: 'Syne, ui-sans-serif, sans-serif', googleFamily: "Syne" },
  { id: "archivo", name: "Archivo", category: "Sans", stack: 'Archivo, ui-sans-serif, sans-serif' },
  { id: "ibm-plex-sans", name: "IBM Plex Sans", category: "Sans", stack: '"IBM Plex Sans", ui-sans-serif, sans-serif' },
  { id: "source-sans", name: "Source Sans 3", category: "Sans", stack: '"Source Sans 3", ui-sans-serif, sans-serif' },
  { id: "noto-sans", name: "Noto Sans", category: "Sans", stack: '"Noto Sans", ui-sans-serif, sans-serif' },
  { id: "raleway", name: "Raleway", category: "Sans", stack: 'Raleway, ui-sans-serif, sans-serif' },
  { id: "lato", name: "Lato", category: "Sans", stack: 'Lato, ui-sans-serif, sans-serif' },
  { id: "open-sans", name: "Open Sans", category: "Sans", stack: '"Open Sans", ui-sans-serif, sans-serif' },
  { id: "ubuntu", name: "Ubuntu", category: "Sans", stack: 'Ubuntu, ui-sans-serif, sans-serif' },
  { id: "fira-sans", name: "Fira Sans", category: "Sans", stack: '"Fira Sans", ui-sans-serif, sans-serif' },
  { id: "karla", name: "Karla", category: "Sans", stack: 'Karla, ui-sans-serif, sans-serif' },
  { id: "jakarta-display", name: "Jakarta Display", category: "Display", stack: '"Plus Jakarta Sans", "Segoe UI", sans-serif' },
  { id: "avenir", name: "Avenir", category: "Sans", stack: 'Avenir, "Avenir Next", Montserrat, sans-serif' },
  { id: "gill-sans", name: "Gill Sans", category: "Sans", stack: '"Gill Sans", "Gill Sans MT", Calibri, sans-serif' },
  { id: "frutiger", name: "Frutiger", category: "Sans", stack: 'Frutiger, "Frutiger Linotype", "Segoe UI", sans-serif' },
  { id: "optima", name: "Optima", category: "Sans", stack: 'Optima, Segoe, "Segoe UI", sans-serif' },
  { id: "futura", name: "Futura", category: "Display", stack: 'Futura, "Trebuchet MS", Arial, sans-serif' },
  { id: "century-gothic", name: "Century Gothic", category: "Sans", stack: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif' },
  { id: "trebuchet", name: "Trebuchet MS", category: "Sans", stack: '"Trebuchet MS", "Lucida Grande", sans-serif' },
  { id: "verdana", name: "Verdana", category: "Sans", stack: 'Verdana, Geneva, sans-serif' },
  { id: "tahoma", name: "Tahoma", category: "Sans", stack: 'Tahoma, Verdana, sans-serif' },
  { id: "arial", name: "Arial", category: "Sans", stack: 'Arial, Helvetica, sans-serif' },
  { id: "georgia", name: "Georgia", category: "Serif", stack: 'Georgia, "Times New Roman", serif' },
  { id: "times", name: "Times New Roman", category: "Serif", stack: '"Times New Roman", Times, serif' },
  { id: "palatino", name: "Palatino", category: "Serif", stack: 'Palatino, "Palatino Linotype", "Book Antiqua", serif' },
  { id: "garamond", name: "Garamond", category: "Serif", stack: 'Garamond, "EB Garamond", Georgia, serif' },
  { id: "baskerville", name: "Baskerville", category: "Serif", stack: 'Baskerville, "Baskerville Old Face", Georgia, serif' },
  { id: "merriweather", name: "Merriweather", category: "Serif", stack: 'Merriweather, Georgia, serif', googleFamily: "Merriweather" },
  { id: "lora", name: "Lora", category: "Serif", stack: 'Lora, Georgia, serif', googleFamily: "Lora" },
  { id: "playfair", name: "Playfair Display", category: "Serif", stack: '"Playfair Display", Georgia, serif', googleFamily: "Playfair Display" },
  { id: "jetbrains", name: "JetBrains Mono", category: "Mono", stack: '"JetBrains Mono", ui-monospace, monospace', googleFamily: "JetBrains Mono" },
  { id: "fira-code", name: "Fira Code", category: "Mono", stack: '"Fira Code", ui-monospace, monospace', googleFamily: "Fira Code" },
  { id: "sf-mono", name: "SF Mono", category: "Mono", stack: '"SF Mono", "SFMono-Regular", Menlo, Monaco, Consolas, monospace' },
  { id: "consolas", name: "Consolas", category: "Mono", stack: 'Consolas, "Liberation Mono", Menlo, monospace' },
];

export const DEFAULT_FONT_THEME: FontThemeId = "sf-pro";
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
