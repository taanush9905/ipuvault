export type ColorThemeId = string;

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
  theme("fresh-green", "Premium Gold", ["#050816", "#F4C542"],
    { primary: "44 89% 61%", glow: "44 89% 61%", bg: "229 63% 5%", fg: "0 0% 100%", card: "220 49% 8%", secondary: "220 49% 12%", muted: "220 40% 12%", mutedFg: "223 24% 78%", accent: "44 89% 61% / 0.15", accentFg: "44 89% 61%", border: "220 40% 14%" },
    { primary: "44 89% 61%", glow: "44 89% 61%", bg: "229 63% 5%", fg: "0 0% 100%", card: "220 49% 8%", secondary: "220 49% 12%", muted: "220 40% 12%", mutedFg: "223 24% 78%", accent: "44 89% 61% / 0.15", accentFg: "44 89% 61%", border: "220 40% 14%" }),
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
  theme("neon-green", "Neon Green", ["#ecfdf5", "#22c55e"],
    { primary: "142 76% 42%", glow: "142 80% 55%", bg: "140 50% 97%", fg: "150 30% 10%", card: "0 0% 100%", secondary: "140 35% 92%", muted: "140 30% 90%", mutedFg: "150 12% 40%", accent: "142 55% 88%", accentFg: "142 76% 30%", border: "140 25% 85%" },
    { primary: "142 70% 50%", glow: "142 75% 58%", bg: "150 28% 5%", fg: "140 20% 96%", card: "150 25% 8%", secondary: "150 22% 13%", muted: "150 20% 11%", mutedFg: "140 12% 60%", accent: "142 35% 14%", accentFg: "142 70% 62%", border: "150 18% 14%" }),
  theme("emerald", "Emerald", ["#d1fae5", "#059669"],
    { primary: "160 84% 35%", glow: "160 78% 48%", bg: "155 45% 97%", fg: "165 30% 10%", card: "0 0% 100%", secondary: "155 35% 92%", muted: "155 30% 90%", mutedFg: "165 14% 40%", accent: "160 50% 88%", accentFg: "160 84% 28%", border: "155 25% 85%" },
    { primary: "160 75% 45%", glow: "160 70% 55%", bg: "165 28% 6%", fg: "155 20% 95%", card: "165 26% 9%", secondary: "165 22% 14%", muted: "165 20% 12%", mutedFg: "155 12% 60%", accent: "160 32% 15%", accentFg: "160 75% 60%", border: "165 18% 15%" }),
  theme("teal", "Teal", ["#ccfbf1", "#14b8a6"],
    { primary: "174 72% 40%", glow: "174 68% 52%", bg: "175 45% 97%", fg: "185 30% 10%", card: "0 0% 100%", secondary: "175 35% 92%", muted: "175 30% 90%", mutedFg: "185 14% 40%", accent: "174 50% 88%", accentFg: "174 72% 30%", border: "175 25% 85%" },
    { primary: "174 68% 48%", glow: "174 65% 56%", bg: "185 30% 6%", fg: "175 20% 95%", card: "185 28% 9%", secondary: "185 24% 14%", muted: "185 22% 12%", mutedFg: "175 12% 60%", accent: "174 32% 15%", accentFg: "174 68% 62%", border: "185 18% 15%" }),
  theme("cyan", "Cyan", ["#cffafe", "#06b6d4"],
    { primary: "189 85% 42%", glow: "189 80% 52%", bg: "190 45% 97%", fg: "200 30% 10%", card: "0 0% 100%", secondary: "190 35% 92%", muted: "190 30% 90%", mutedFg: "200 14% 40%", accent: "189 55% 88%", accentFg: "189 85% 32%", border: "190 25% 85%" },
    { primary: "189 80% 50%", glow: "189 75% 58%", bg: "200 32% 6%", fg: "190 20% 95%", card: "200 28% 9%", secondary: "200 24% 14%", muted: "200 22% 12%", mutedFg: "190 12% 60%", accent: "189 32% 15%", accentFg: "189 80% 65%", border: "200 18% 15%" }),
  theme("azure", "Azure", ["#e0f2fe", "#0ea5e9"],
    { primary: "200 90% 45%", glow: "200 85% 55%", bg: "205 45% 98%", fg: "215 30% 10%", card: "0 0% 100%", secondary: "205 35% 93%", muted: "205 30% 91%", mutedFg: "215 14% 42%", accent: "200 55% 90%", accentFg: "200 90% 35%", border: "205 25% 87%" },
    { primary: "200 85% 52%", glow: "200 80% 60%", bg: "215 32% 7%", fg: "205 20% 96%", card: "215 28% 10%", secondary: "215 24% 14%", muted: "215 22% 12%", mutedFg: "205 12% 62%", accent: "200 32% 16%", accentFg: "200 85% 68%", border: "215 20% 16%" }),
  theme("navy", "Navy", ["#dbeafe", "#1e40af"],
    { primary: "224 76% 42%", glow: "224 72% 52%", bg: "220 40% 98%", fg: "230 35% 10%", card: "0 0% 100%", secondary: "220 30% 94%", muted: "220 28% 92%", mutedFg: "230 14% 42%", accent: "224 50% 92%", accentFg: "224 76% 32%", border: "220 24% 88%" },
    { primary: "224 72% 55%", glow: "224 68% 62%", bg: "230 35% 7%", fg: "220 20% 96%", card: "230 30% 10%", secondary: "230 26% 14%", muted: "230 24% 12%", mutedFg: "220 12% 62%", accent: "224 32% 16%", accentFg: "224 72% 72%", border: "230 20% 16%" }),
  theme("fuchsia", "Fuchsia", ["#fae8ff", "#c026d3"],
    { primary: "292 84% 48%", glow: "292 78% 58%", bg: "295 45% 98%", fg: "300 30% 10%", card: "0 0% 100%", secondary: "295 35% 94%", muted: "295 30% 92%", mutedFg: "300 14% 42%", accent: "292 55% 92%", accentFg: "292 84% 38%", border: "295 25% 88%" },
    { primary: "292 78% 58%", glow: "292 74% 65%", bg: "300 30% 7%", fg: "295 20% 96%", card: "300 28% 10%", secondary: "300 24% 14%", muted: "300 22% 12%", mutedFg: "295 12% 62%", accent: "292 32% 16%", accentFg: "292 78% 70%", border: "300 20% 16%" }),
  theme("pink", "Pink", ["#fce7f3", "#db2777"],
    { primary: "330 80% 52%", glow: "330 75% 60%", bg: "335 50% 98%", fg: "340 30% 10%", card: "0 0% 100%", secondary: "335 40% 94%", muted: "335 35% 92%", mutedFg: "340 14% 42%", accent: "330 55% 92%", accentFg: "330 80% 40%", border: "335 28% 88%" },
    { primary: "330 75% 58%", glow: "330 70% 65%", bg: "340 28% 7%", fg: "335 20% 96%", card: "340 26% 10%", secondary: "340 22% 14%", muted: "340 20% 12%", mutedFg: "335 12% 62%", accent: "330 32% 16%", accentFg: "330 75% 68%", border: "340 18% 15%" }),
  theme("crimson", "Crimson", ["#ffe4e6", "#be123c"],
    { primary: "350 78% 48%", glow: "350 72% 56%", bg: "350 45% 98%", fg: "355 30% 10%", card: "0 0% 100%", secondary: "350 35% 94%", muted: "350 30% 92%", mutedFg: "355 14% 42%", accent: "350 55% 92%", accentFg: "350 78% 38%", border: "350 25% 88%" },
    { primary: "350 72% 55%", glow: "350 68% 62%", bg: "355 28% 7%", fg: "350 20% 96%", card: "355 26% 10%", secondary: "355 22% 14%", muted: "355 20% 12%", mutedFg: "350 12% 62%", accent: "350 32% 16%", accentFg: "350 72% 68%", border: "355 18% 15%" }),
  theme("bronze", "Bronze", ["#fef3c7", "#b45309"],
    { primary: "28 85% 42%", glow: "32 88% 52%", bg: "40 50% 97%", fg: "30 28% 10%", card: "0 0% 100%", secondary: "40 40% 92%", muted: "40 35% 90%", mutedFg: "30 14% 40%", accent: "28 60% 88%", accentFg: "28 85% 32%", border: "40 28% 86%" },
    { primary: "32 82% 50%", glow: "32 78% 58%", bg: "30 24% 7%", fg: "40 20% 96%", card: "30 22% 10%", secondary: "30 20% 14%", muted: "30 18% 12%", mutedFg: "40 12% 60%", accent: "28 32% 15%", accentFg: "32 82% 62%", border: "30 17% 15%" }),
  theme("olive", "Olive", ["#f7fee7", "#4d7c0f"],
    { primary: "82 70% 38%", glow: "82 65% 48%", bg: "85 45% 97%", fg: "90 28% 10%", card: "0 0% 100%", secondary: "85 38% 92%", muted: "85 33% 90%", mutedFg: "90 14% 40%", accent: "82 50% 86%", accentFg: "82 70% 28%", border: "85 26% 85%" },
    { primary: "82 65% 46%", glow: "82 60% 54%", bg: "90 25% 7%", fg: "85 20% 95%", card: "90 23% 10%", secondary: "90 20% 14%", muted: "90 18% 12%", mutedFg: "85 12% 60%", accent: "82 30% 15%", accentFg: "82 65% 58%", border: "90 17% 15%" }),
  theme("graphite", "Graphite", ["#f1f5f9", "#334155"],
    { primary: "215 20% 35%", glow: "215 18% 45%", bg: "210 35% 98%", fg: "220 25% 10%", card: "0 0% 100%", secondary: "210 28% 94%", muted: "210 24% 92%", mutedFg: "220 12% 42%", accent: "215 20% 88%", accentFg: "215 20% 28%", border: "210 22% 87%" },
    { primary: "215 18% 52%", glow: "215 16% 58%", bg: "220 25% 7%", fg: "210 18% 95%", card: "220 22% 10%", secondary: "220 20% 14%", muted: "220 18% 12%", mutedFg: "210 12% 60%", accent: "215 18% 16%", accentFg: "215 18% 65%", border: "220 17% 15%" }),
  theme("midnight", "Midnight", ["#e2e8f0", "#1e293b"],
    { primary: "222 47% 25%", glow: "222 40% 38%", bg: "210 40% 98%", fg: "222 40% 8%", card: "0 0% 100%", secondary: "214 30% 94%", muted: "214 28% 92%", mutedFg: "215 16% 42%", accent: "222 35% 90%", accentFg: "222 47% 20%", border: "214 24% 88%" },
    { primary: "217 33% 55%", glow: "217 30% 62%", bg: "222 40% 5%", fg: "210 25% 96%", card: "222 35% 8%", secondary: "217 28% 12%", muted: "217 26% 10%", mutedFg: "215 15% 62%", accent: "217 28% 14%", accentFg: "217 33% 70%", border: "217 24% 14%" }),
  theme("electric", "Electric Blue", ["#dbeafe", "#3b82f6"],
    { primary: "221 83% 53%", glow: "221 90% 65%", bg: "214 50% 98%", fg: "222 40% 10%", card: "0 0% 100%", secondary: "214 40% 94%", muted: "214 35% 92%", mutedFg: "222 14% 42%", accent: "221 70% 94%", accentFg: "221 83% 40%", border: "214 28% 88%" },
    { primary: "221 80% 60%", glow: "221 85% 68%", bg: "222 40% 7%", fg: "214 20% 96%", card: "222 35% 10%", secondary: "222 30% 14%", muted: "222 28% 12%", mutedFg: "214 12% 62%", accent: "221 35% 16%", accentFg: "221 80% 72%", border: "222 20% 16%" }),
  theme("aurora", "Aurora", ["#ecfeff", "#2dd4bf"],
    { primary: "172 66% 50%", glow: "190 80% 55%", bg: "180 45% 97%", fg: "195 30% 10%", card: "0 0% 100%", secondary: "180 35% 92%", muted: "180 30% 90%", mutedFg: "195 14% 40%", accent: "172 50% 88%", accentFg: "172 66% 35%", border: "180 25% 85%" },
    { primary: "175 60% 48%", glow: "190 70% 55%", bg: "195 30% 6%", fg: "180 20% 95%", card: "195 28% 9%", secondary: "195 24% 14%", muted: "195 22% 12%", mutedFg: "180 12% 60%", accent: "172 32% 15%", accentFg: "175 60% 62%", border: "195 18% 15%" }),
  theme("sakura", "Sakura", ["#fff1f2", "#f472b6"],
    { primary: "340 82% 58%", glow: "350 85% 65%", bg: "345 50% 98%", fg: "350 28% 10%", card: "0 0% 100%", secondary: "345 40% 94%", muted: "345 35% 92%", mutedFg: "350 14% 42%", accent: "340 60% 92%", accentFg: "340 82% 45%", border: "345 28% 88%" },
    { primary: "340 78% 62%", glow: "350 80% 68%", bg: "350 28% 7%", fg: "345 20% 96%", card: "350 26% 10%", secondary: "350 22% 14%", muted: "350 20% 12%", mutedFg: "345 12% 62%", accent: "340 32% 16%", accentFg: "340 78% 72%", border: "350 18% 15%" }),
  theme("copper", "Copper", ["#ffedd5", "#c2410c"],
    { primary: "20 90% 46%", glow: "25 92% 55%", bg: "35 50% 97%", fg: "25 28% 10%", card: "0 0% 100%", secondary: "35 40% 92%", muted: "35 35% 90%", mutedFg: "25 14% 40%", accent: "20 65% 88%", accentFg: "20 90% 35%", border: "35 28% 86%" },
    { primary: "22 88% 52%", glow: "25 85% 60%", bg: "25 24% 7%", fg: "35 20% 96%", card: "25 22% 10%", secondary: "25 20% 14%", muted: "25 18% 12%", mutedFg: "35 12% 60%", accent: "20 32% 15%", accentFg: "22 88% 62%", border: "25 17% 15%" }),
  theme("moss", "Moss", ["#f0fdf4", "#15803d"],
    { primary: "142 72% 32%", glow: "142 65% 42%", bg: "138 42% 96%", fg: "150 28% 10%", card: "0 0% 100%", secondary: "138 32% 91%", muted: "138 28% 89%", mutedFg: "150 12% 38%", accent: "142 48% 86%", accentFg: "142 72% 24%", border: "138 24% 84%" },
    { primary: "142 68% 40%", glow: "142 62% 48%", bg: "150 26% 6%", fg: "138 18% 94%", card: "150 24% 8%", secondary: "150 20% 13%", muted: "150 18% 11%", mutedFg: "138 12% 58%", accent: "142 30% 14%", accentFg: "142 68% 55%", border: "150 17% 14%" }),
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
