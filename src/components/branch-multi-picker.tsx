import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { BranchOption } from "@/lib/use-branches";

type Props = {
  branches: BranchOption[];
  selected: string[];
  onChange: (codes: string[]) => void;
};

export function BranchMultiPicker({ branches, selected, onChange }: Props) {
  function toggle(code: string) {
    onChange(
      selected.includes(code) ? selected.filter((c) => c !== code) : [...selected, code]
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {branches.map((b) => {
        const checked = selected.includes(b.code);
        return (
          <label
            key={b.code}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer transition-all",
              checked ? "border-primary bg-primary/10 shadow-[0_0_20px_-8px_hsl(var(--primary)/0.5)]" : "hover:bg-muted/50"
            )}
          >
            <Checkbox checked={checked} onCheckedChange={() => toggle(b.code)} />
            <span className="text-sm font-medium">{b.code}</span>
          </label>
        );
      })}
    </div>
  );
}
