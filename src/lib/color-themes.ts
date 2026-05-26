export type ColorThemeId =
  | "fresh-green"
  | "forest"
  | "mint"
  | "lime"
  | "ocean-teal"
  | "sky"
  | "classic-blue"
  | "indigo"
  | "royal-purple"
  | "violet"
  | "sunset-gold"
  | "amber"
  | "coral"
  | "rose"
  | "ruby"
  | "slate";

export type ColorTheme = {
  id: ColorThemeId;
  name: string;
  preview: [string, string];
  vars: Record<string, string>;
  darkVars: Record<string, string>;
};

type Palette = {
  primary: string;
  glow: string;
  bg: string;
  fg: string;
  card: string;
  secondary: string;
  muted: string;
  mutedFg: string;
  accent: string;
  accentFg: string;
  border: string;
};

function lightPalette(p: Palette): Record<string, string> {
  return {
    "--background": p.bg,
    "--foreground": p.fg,
    "--card": p.card,
    "--card-foreground": p.fg,
    "--popover": p.card,
    "--popover-foreground": p.fg,
    "--primary": p.primary,
    "--primary-foreground": "0 0% 100%",
    "--primary-glow": p.glow,
    "--secondary": p.secondary,
    "--secondary-foreground": p.fg,
    "--muted": p.muted,
    "--muted-foreground": p.mutedFg,
    "--accent": p.accent,
    "--accent-foreground": p.accentFg,
    "--border": p.border,
    "--input": p.border,
    "--ring": p.primary,
  };
}

function darkPalette(p: Palette & { primaryFg?: string }): Record<string, string> {
  return {
    "--background": p.bg,
    "--foreground": p.fg,
    "--card": p.card,
    "--card-foreground": p.fg,
    "--popover": p.card,
    "--popover-foreground": p.fg,
    "--primary": p.primary,
    "--primary-foreground": p.primaryFg ?? p.bg,
    "--primary-glow": p.glow,
    "--secondary": p.secondary,
    "--secondary-foreground": p.fg,
    "--muted": p.muted,
    "--muted-foreground": p.mutedFg,
    "--accent": p.accent,
    "--accent-foreground": p.accentFg,
    "--border": p.border,
    "--input": p.border,
    "--ring": p.primary,
  };
}

function theme(
  id: ColorThemeId,
  name: string,
  preview: [string, string],
  light: Palette,
  dark: Palette & { primaryFg?: string }
): ColorTheme {
  return { id, name, preview, vars: lightPalette(light), darkVars: darkPalette(dark) };
}

export const COLOR_THEMES: ColorTheme[] = [
  theme("fresh-green", "Fresh Green", ["#f0fdf4", "#16a34a"],
    { primary: "142 71% 38%", glow: "142 65% 50%", bg: "140 40% 98%", fg: "150 30% 12%", card: "0 0% 100%", secondary: "140 30% 94%", muted: "140 25% 93%", mutedFg: "150 12% 42%", accent: "142 50% 92%", accentFg: "142 71% 28%", border: "140 20% 88%" },
    { primary: "142 65% 45%", glow: "142 60% 55%", bg: "150 25% 6%", fg: "140 20% 96%", card: "150 22% 9%", secondary: "150 20% 14%", muted: "150 18% 13%", mutedFg: "140 12% 62%", accent: "142 35% 16%", accentFg: "142 65% 65%", border: "150 18% 16%" }),
  theme("forest", "Forest", ["#ecfdf5", "#047857"],
    { primary: "160 84% 30%", glow: "160 70% 42%", bg: "152 45% 97%", fg: "160 40% 10%", card: "0 0% 100%", secondary: "152 35% 92%", muted: "152 30% 91%", mutedFg: "160 15% 40%", accent: "152 40% 90%", accentFg: "160 84% 25%", border: "152 25% 85%" },
    { primary: "160 70% 42%", glow: "160 65% 50%", bg: "160 30% 6%", fg: "152 20% 95%", card: "160 28% 9%", secondary: "160 22% 14%", muted: "160 20% 12%", mutedFg: "152 12% 60%", accent: "160 30% 15%", accentFg: "160 70% 60%", border: "160 20% 15%" }),
  theme("mint", "Mint", ["#ecfdf5", "#10b981"],
    { primary: "160 84% 39%", glow: "160 75% 50%", bg: "158 45% 97%", fg: "165 30% 12%", card: "0 0% 100%", secondary: "158 35% 93%", muted: "158 30% 91%", mutedFg: "165 14% 42%", accent: "160 45% 90%", accentFg: "160 84% 30%", border: "158 25% 86%" },
    { primary: "160 75% 48%", glow: "160 70% 58%", bg: "165 28% 6%", fg: "158 20% 96%", card: "165 26% 9%", secondary: "165 22% 14%", muted: "165 20% 12%", mutedFg: "158 12% 62%", accent: "160 32% 16%", accentFg: "160 75% 62%", border: "165 18% 15%" }),
  theme("lime", "Lime", ["#f7fee7", "#65a30d"],
    { primary: "84 81% 40%", glow: "84 75% 50%", bg: "80 50% 97%", fg: "85 30% 12%", card: "0 0% 100%", secondary: "80 40% 92%", muted: "80 35% 90%", mutedFg: "85 14% 40%", accent: "84 50% 88%", accentFg: "84 81% 32%", border: "80 28% 85%" },
    { primary: "84 75% 48%", glow: "84 70% 55%", bg: "85 25% 6%", fg: "80 20% 96%", card: "85 23% 9%", secondary: "85 20% 14%", muted: "85 18% 12%", mutedFg: "80 12% 60%", accent: "84 30% 15%", accentFg: "84 75% 60%", border: "85 17% 15%" }),
  theme("ocean-teal", "Ocean Teal", ["#f0fdfa", "#0d9488"],
    { primary: "173 80% 36%", glow: "173 70% 48%", bg: "180 40% 98%", fg: "190 40% 12%", card: "0 0% 100%", secondary: "180 30% 93%", muted: "180 25% 92%", mutedFg: "190 15% 42%", accent: "173 45% 90%", accentFg: "173 80% 28%", border: "180 20% 87%" },
    { primary: "173 70% 42%", glow: "173 65% 52%", bg: "190 35% 6%", fg: "180 20% 95%", card: "190 30% 9%", secondary: "190 25% 14%", muted: "190 22% 12%", mutedFg: "180 12% 60%", accent: "173 30% 15%", accentFg: "173 70% 58%", border: "190 22% 15%" }),
  theme("sky", "Sky Blue", ["#f0f9ff", "#0284c7"],
    { primary: "199 89% 42%", glow: "199 85% 52%", bg: "204 45% 98%", fg: "210 35% 12%", card: "0 0% 100%", secondary: "204 35% 93%", muted: "204 30% 91%", mutedFg: "210 14% 42%", accent: "199 50% 90%", accentFg: "199 89% 32%", border: "204 25% 87%" },
    { primary: "199 85% 50%", glow: "199 80% 58%", bg: "210 32% 7%", fg: "204 20% 96%", card: "210 28% 10%", secondary: "210 24% 14%", muted: "210 22% 12%", mutedFg: "204 12% 62%", accent: "199 32% 16%", accentFg: "199 85% 65%", border: "210 20% 16%" }),
  theme("classic-blue", "Classic Blue", ["#eff6ff", "#2563eb"],
    { primary: "217 91% 55%", glow: "217 91% 70%", bg: "210 40% 99%", fg: "222 47% 11%", card: "0 0% 100%", secondary: "215 25% 96%", muted: "215 25% 95%", mutedFg: "215 16% 47%", accent: "217 91% 96%", accentFg: "217 91% 35%", border: "215 25% 90%" },
    { primary: "217 91% 60%", glow: "217 85% 68%", bg: "222 40% 7%", fg: "210 40% 98%", card: "222 38% 10%", secondary: "217 30% 14%", muted: "217 28% 12%", mutedFg: "215 20% 62%", accent: "217 35% 16%", accentFg: "217 91% 72%", border: "217 28% 16%" }),
  theme("indigo", "Indigo", ["#eef2ff", "#4f46e5"],
    { primary: "239 84% 58%", glow: "239 80% 68%", bg: "234 45% 98%", fg: "240 30% 12%", card: "0 0% 100%", secondary: "234 35% 94%", muted: "234 30% 92%", mutedFg: "240 14% 45%", accent: "239 50% 92%", accentFg: "239 84% 42%", border: "234 25% 88%" },
    { primary: "239 80% 65%", glow: "239 75% 72%", bg: "240 32% 7%", fg: "234 20% 96%", card: "240 28% 10%", secondary: "240 24% 14%", muted: "240 22% 12%", mutedFg: "234 12% 62%", accent: "239 32% 16%", accentFg: "239 80% 72%", border: "240 20% 16%" }),
  theme("royal-purple", "Royal Purple", ["#faf5ff", "#7c3aed"],
    { primary: "262 83% 52%", glow: "262 75% 62%", bg: "270 40% 98%", fg: "270 30% 12%", card: "0 0% 100%", secondary: "270 30% 94%", muted: "270 25% 93%", mutedFg: "270 12% 45%", accent: "262 50% 92%", accentFg: "262 83% 40%", border: "270 20% 88%" },
    { primary: "262 75% 62%", glow: "262 70% 68%", bg: "270 30% 7%", fg: "270 20% 96%", card: "270 28% 10%", secondary: "270 22% 14%", muted: "270 20% 12%", mutedFg: "270 12% 62%", accent: "262 35% 16%", accentFg: "262 75% 70%", border: "270 20% 16%" }),
  theme("violet", "Violet", ["#f5f3ff", "#8b5cf6"],
    { primary: "258 90% 58%", glow: "258 85% 66%", bg: "260 45% 98%", fg: "265 28% 12%", card: "0 0% 100%", secondary: "260 35% 94%", muted: "260 30% 92%", mutedFg: "265 14% 45%", accent: "258 48% 91%", accentFg: "258 90% 42%", border: "260 24% 88%" },
    { primary: "258 85% 65%", glow: "258 80% 72%", bg: "265 30% 7%", fg: "260 20% 96%", card: "265 28% 10%", secondary: "265 22% 14%", muted: "265 20% 12%", mutedFg: "260 12% 62%", accent: "258 32% 16%", accentFg: "258 85% 72%", border: "265 20% 16%" }),
  theme("sunset-gold", "Sunset Gold", ["#fffbeb", "#d97706"],
    { primary: "32 95% 44%", glow: "38 92% 55%", bg: "45 50% 98%", fg: "30 30% 12%", card: "0 0% 100%", secondary: "45 40% 93%", muted: "45 35% 92%", mutedFg: "30 15% 42%", accent: "38 70% 90%", accentFg: "32 95% 35%", border: "45 25% 87%" },
    { primary: "38 90% 50%", glow: "38 85% 58%", bg: "30 25% 7%", fg: "45 20% 96%", card: "30 22% 10%", secondary: "30 20% 14%", muted: "30 18% 12%", mutedFg: "45 12% 60%", accent: "32 35% 15%", accentFg: "38 90% 62%", border: "30 18% 15%" }),
  theme("amber", "Amber", ["#fffbeb", "#f59e0b"],
    { primary: "38 92% 50%", glow: "40 95% 58%", bg: "48 55% 97%", fg: "35 28% 12%", card: "0 0% 100%", secondary: "48 45% 92%", muted: "48 40% 90%", mutedFg: "35 14% 42%", accent: "38 65% 88%", accentFg: "38 92% 38%", border: "48 30% 86%" },
    { primary: "40 90% 55%", glow: "40 85% 62%", bg: "35 24% 7%", fg: "48 20% 96%", card: "35 22% 10%", secondary: "35 20% 14%", muted: "35 18% 12%", mutedFg: "48 12% 60%", accent: "38 32% 15%", accentFg: "40 90% 62%", border: "35 17% 15%" }),
  theme("coral", "Coral", ["#fff7ed", "#ea580c"],
    { primary: "24 95% 48%", glow: "20 90% 55%", bg: "30 50% 98%", fg: "25 30% 12%", card: "0 0% 100%", secondary: "30 40% 93%", muted: "30 35% 91%", mutedFg: "25 14% 42%", accent: "24 60% 90%", accentFg: "24 95% 38%", border: "30 28% 87%" },
    { primary: "22 90% 55%", glow: "20 85% 62%", bg: "25 26% 7%", fg: "30 20% 96%", card: "25 23% 10%", secondary: "25 20% 14%", muted: "25 18% 12%", mutedFg: "30 12% 60%", accent: "24 32% 15%", accentFg: "22 90% 62%", border: "25 17% 15%" }),
  theme("rose", "Rose", ["#fff1f2", "#e11d48"],
    { primary: "347 77% 50%", glow: "350 85% 58%", bg: "350 50% 98%", fg: "345 30% 12%", card: "0 0% 100%", secondary: "350 40% 94%", muted: "350 35% 92%", mutedFg: "345 14% 45%", accent: "347 55% 92%", accentFg: "347 77% 40%", border: "350 28% 88%" },
    { primary: "347 75% 58%", glow: "350 80% 65%", bg: "345 28% 7%", fg: "350 20% 96%", card: "345 26% 10%", secondary: "345 22% 14%", muted: "345 20% 12%", mutedFg: "350 12% 62%", accent: "347 32% 16%", accentFg: "347 75% 68%", border: "345 18% 15%" }),
  theme("ruby", "Ruby", ["#fef2f2", "#dc2626"],
    { primary: "0 72% 51%", glow: "0 68% 58%", bg: "0 45% 98%", fg: "0 30% 12%", card: "0 0% 100%", secondary: "0 40% 94%", muted: "0 35% 92%", mutedFg: "0 14% 45%", accent: "0 55% 92%", accentFg: "0 72% 40%", border: "0 28% 88%" },
    { primary: "0 70% 58%", glow: "0 65% 65%", bg: "0 28% 7%", fg: "0 20% 96%", card: "0 26% 10%", secondary: "0 22% 14%", muted: "0 20% 12%", mutedFg: "0 12% 62%", accent: "0 32% 16%", accentFg: "0 70% 68%", border: "0 18% 15%" }),
  theme("slate", "Slate", ["#f8fafc", "#475569"],
    { primary: "215 25% 40%", glow: "215 22% 50%", bg: "210 40% 98%", fg: "222 30% 12%", card: "0 0% 100%", secondary: "210 30% 94%", muted: "210 25% 92%", mutedFg: "215 14% 45%", accent: "215 25% 90%", accentFg: "215 25% 32%", border: "210 22% 88%" },
    { primary: "215 22% 55%", glow: "215 20% 62%", bg: "222 28% 7%", fg: "210 20% 96%", card: "222 26% 10%", secondary: "222 22% 14%", muted: "222 20% 12%", mutedFg: "210 12% 62%", accent: "215 22% 16%", accentFg: "215 22% 68%", border: "222 18% 15%" }),
];

export const DEFAULT_COLOR_THEME: ColorThemeId = "fresh-green";
export const COLOR_THEME_STORAGE_KEY = "pyq:color-theme";

export type ThemeMode = "light" | "dark";

/** Build hero gradients & shadows from primary so homepage banner updates with accent */
function withDerived(vars: Record<string, string>, mode: ThemeMode): Record<string, string> {
  const p = vars["--primary"];
  const glow = vars["--primary-glow"] ?? p;
  const bg = vars["--background"];
  const sec = vars["--secondary"];
  const shadow = mode === "dark" ? 0.28 : 0.2;
  return {
    ...vars,
    "--info": p,
    "--success": p,
    "--gradient-primary": `linear-gradient(135deg, hsl(${p}), hsl(${glow}))`,
    "--gradient-subtle": `linear-gradient(180deg, hsl(${bg}), hsl(${sec}))`,
    "--shadow-lg": `0 12px 32px -8px hsl(${p} / ${shadow})`,
    "--shadow-md": `0 4px 12px -2px hsl(${p} / ${shadow * 0.5})`,
  };
}

export function applyColorTheme(id: ColorThemeId, mode: ThemeMode = "light") {
  const theme = COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0];
  const base = mode === "dark" ? theme.darkVars : theme.vars;
  const vars = withDerived(base, mode);
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  localStorage.setItem(COLOR_THEME_STORAGE_KEY, id);
}

export function getStoredColorTheme(): ColorThemeId {
  const stored = localStorage.getItem(COLOR_THEME_STORAGE_KEY) as ColorThemeId | null;
  if (stored && COLOR_THEMES.some((t) => t.id === stored)) return stored;
  return DEFAULT_COLOR_THEME;
}
