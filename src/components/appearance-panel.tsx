import { useState } from "react";
import { Palette, Moon, Sun, Type, SlidersHorizontal } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { COLOR_THEMES, type ColorThemeId } from "@/lib/color-themes";
import { FONT_THEMES, type FontThemeId } from "@/lib/font-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function AppearancePanel() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"colors" | "fonts">("colors");
  const { theme, toggle, colorTheme, setColorTheme, fontTheme, setFontTheme } = useTheme();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl gap-1.5 h-9">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Appearance
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant={tab === "colors" ? "default" : "outline"}
            size="sm"
            className="rounded-xl flex-1"
            onClick={() => setTab("colors")}
          >
            <Palette className="h-3.5 w-3.5 mr-1" />
            Colors ({COLOR_THEMES.length})
          </Button>
          <Button
            type="button"
            variant={tab === "fonts" ? "default" : "outline"}
            size="sm"
            className="rounded-xl flex-1"
            onClick={() => setTab("fonts")}
          >
            <Type className="h-3.5 w-3.5 mr-1" />
            Fonts ({FONT_THEMES.length})
          </Button>
        </div>

        <Button type="button" variant="outline" onClick={toggle} className="w-full mt-4 rounded-xl gap-2">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        </Button>

        {tab === "colors" ? (
          <div className="grid grid-cols-2 gap-2 mt-4 max-h-[65vh] overflow-y-auto pr-1">
            {COLOR_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setColorTheme(t.id as ColorThemeId)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-all hover:scale-[1.02]",
                  colorTheme === t.id && "ring-2 ring-primary border-primary"
                )}
              >
                <div className="flex gap-1 mb-2 h-5 rounded-md overflow-hidden">
                  <span className="flex-1" style={{ background: t.preview[0] }} />
                  <span className="flex-1" style={{ background: t.preview[1] }} />
                </div>
                <span className="text-xs font-medium leading-tight">{t.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-1 mt-4 max-h-[65vh] overflow-y-auto pr-1">
            {FONT_THEMES.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFontTheme(f.id as FontThemeId)}
                className={cn(
                  "w-full rounded-xl border px-3 py-2.5 text-left transition-all hover:bg-muted/50",
                  fontTheme === f.id && "ring-2 ring-primary border-primary bg-primary/5"
                )}
                style={{ fontFamily: f.stack }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{f.name}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{f.category}</span>
                </div>
                <span className="text-lg font-semibold block mt-1 leading-snug" style={{ fontFamily: f.stack }}>
                  Aa Bb 123
                </span>
                <span className="text-[11px] text-muted-foreground block">The quick brown fox</span>
              </button>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
