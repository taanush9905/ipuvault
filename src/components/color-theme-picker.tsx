import { Palette, Moon, Sun } from "lucide-react";
import { COLOR_THEMES, type ColorThemeId } from "@/lib/color-themes";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = { value: ColorThemeId; onChange: (id: ColorThemeId) => void };

export function ColorThemePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(true);
  const { theme, toggle } = useTheme();

  return (
    <div className="rounded-2xl border bg-card/80 backdrop-blur-sm p-5 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold text-sm">Appearance</p>
            <p className="text-xs text-muted-foreground">Theme & accent colors — saved on this device</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={toggle}
          className="rounded-xl gap-2 shrink-0"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </Button>
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 text-left text-sm text-muted-foreground hover:text-foreground"
      >
        <span>
          Accent: <strong className="text-foreground">{COLOR_THEMES.find((t) => t.id === value)?.name ?? "Fresh Green"}</strong>
        </span>
        <span>{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 mt-4 max-h-[320px] overflow-y-auto pr-1">
          {COLOR_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={cn(
                "rounded-xl border p-3 text-left transition-all hover:scale-[1.02] hover:shadow-md",
                value === t.id && "ring-2 ring-primary border-primary"
              )}
            >
              <div className="flex gap-1 mb-2 h-6 rounded-md overflow-hidden">
                <span className="flex-1" style={{ background: t.preview[0] }} />
                <span className="flex-1" style={{ background: t.preview[1] }} />
              </div>
              <span className="text-xs font-medium">{t.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
