import { Link } from "react-router-dom";
import { Repeat2, Flame, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  branch: string;
  semester: string;
  subject?: string;
  className?: string;
};

export function RepeatedHighlight({ branch, semester, subject, className }: Props) {
  const href = subject
    ? `/repeated?branch=${branch}&semester=${semester}&subject=${encodeURIComponent(subject)}`
    : `/repeated?branch=${branch}&semester=${semester}`;

  return (
    <Link
      to={href}
      className={cn(
        "group block rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-5 sm:p-6",
        "shadow-[0_0_40px_-12px_hsl(var(--primary)/0.55)] hover:shadow-[0_0_50px_-8px_hsl(var(--primary)/0.7)]",
        "transition-all duration-300 hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/20 text-primary grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
            <Repeat2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Premium feature</p>
            <h3 className="text-lg sm:text-xl font-bold">Most Repeated Topics</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Track high-frequency questions — see how many times topics appeared and which years they repeated in.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/25">
                <Flame className="h-3 w-3" /> Asked 5+ times
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted border">
                Repeated in 2022, 2023, 2025
              </span>
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
