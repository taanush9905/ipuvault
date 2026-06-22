import * as React from "react";
import { cn } from "@/lib/utils";

// Coordinate state interface
interface Coords {
  x: number;
  y: number;
}

// Utility to calculate position relative to element
function getRelativeCoords(e: React.MouseEvent<HTMLElement>, el: HTMLElement): Coords {
  const rect = el.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

export interface HoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
    const btnRef = React.useRef<HTMLButtonElement | null>(null);
    const [coords, setCoords] = React.useState<Coords>({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (btnRef.current) {
        setCoords(getRelativeCoords(e, btnRef.current));
      }
    };

    const variantClasses = {
      primary: "border-primary/40 text-primary hover:text-[#050816] bg-transparent",
      secondary: "border-white/15 text-[#B8C0D4] hover:text-white bg-transparent",
      outline: "border-white/15 text-[#B8C0D4] hover:border-primary hover:text-white bg-transparent",
      ghost: "border-transparent text-muted-foreground hover:text-white bg-transparent",
    };

    const sizeClasses = {
      default: "h-11 px-5 py-2.5 rounded-2xl text-sm font-semibold",
      sm: "h-9 px-3.5 py-1.5 rounded-xl text-xs font-semibold",
      lg: "h-12 px-7 py-3 rounded-2xl text-base font-bold",
      icon: "h-11 w-11 rounded-2xl flex items-center justify-center p-0 shrink-0",
    };

    return (
      <button
        ref={(node) => {
          btnRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "group relative overflow-hidden transition-all duration-300 ease-in-out border text-center flex items-center justify-center gap-2 select-none active:scale-[0.97] will-change-transform",
          variantClasses[variant],
          sizeClasses[size],
          isHovered && "scale-[1.02] -translate-y-[4px] shadow-[0_0_20px_rgba(244,197,66,0.25)] border-[#F4C542]",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "absolute rounded-full pointer-events-none bg-primary transition-transform duration-300 ease-out -translate-x-1/2 -translate-y-1/2 scale-0 z-0",
            isHovered && "scale-[3.5]"
          )}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            width: "120px",
            height: "120px",
          }}
        />
        <span className="relative z-10 flex items-center justify-center gap-2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 transition-colors duration-300">
          {children}
        </span>
      </button>
    );
  }
);
HoverButton.displayName = "HoverButton";
