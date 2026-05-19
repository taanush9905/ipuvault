import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  selected?: boolean;
  className?: string;
};

export function SelectionCard({ title, subtitle, icon, onClick, selected, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative text-left rounded-xl border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-soft hover:-translate-y-0.5",
        selected && "border-primary bg-accent",
        className
      )}
    >
      {icon && (
        <div className="h-10 w-10 rounded-lg bg-accent text-accent-foreground grid place-items-center text-xl mb-3 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      )}
      <div className="font-semibold text-foreground">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </button>
  );
}
