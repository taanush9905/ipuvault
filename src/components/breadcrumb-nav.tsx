import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Crumb = { label: string; onClick?: () => void };

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <div className="flex items-center gap-1 flex-wrap text-sm">
      {crumbs.map((c, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          {c.onClick && i < crumbs.length - 1 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={c.onClick}
              className="h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              {i === 0 && <Home className="h-3.5 w-3.5 mr-1" />}
              {c.label}
            </Button>
          ) : (
            <span className="px-2 py-1 font-medium text-foreground">{c.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
