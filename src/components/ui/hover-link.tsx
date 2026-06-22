import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Coords {
  x: number;
  y: number;
}

function getRelativeCoords(e: React.MouseEvent<HTMLElement>, el: HTMLElement): Coords {
  const rect = el.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

export interface HoverLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "inline";
  size?: "default" | "sm" | "lg" | "icon" | "inline";
}

export const HoverLink = React.forwardRef<HTMLAnchorElement, HoverLinkProps>(
  ({ className, to, variant = "primary", size = "default", children, ...props }, ref) => {
    const linkRef = React.useRef<HTMLAnchorElement | null>(null);
    const [coords, setCoords] = React.useState<Coords>({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (linkRef.current) {
        setCoords(getRelativeCoords(e, linkRef.current));
      }
    };

    const variantClasses = {
      primary: "border-primary/40 text-primary hover:text-[#050816] bg-transparent",
      secondary: "border-white/15 text-[#B8C0D4] hover:text-white bg-transparent",
      outline: "border-white/15 text-[#B8C0D4] hover:border-primary hover:text-white bg-transparent",
      ghost: "border-transparent text-muted-foreground hover:text-white bg-transparent",
      inline: "border-transparent text-[#B8C0D4] hover:text-primary bg-transparent p-0 border-0 hover:scale-100",
    };

    const sizeClasses = {
      default: "h-11 px-5 py-2.5 rounded-2xl text-sm font-semibold inline-flex items-center justify-center gap-2",
      sm: "h-9 px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-2",
      lg: "h-12 px-7 py-3 rounded-2xl text-base font-bold inline-flex items-center justify-center gap-2",
      icon: "h-11 w-11 rounded-2xl flex items-center justify-center p-0 shrink-0",
      inline: "inline-flex items-center gap-1",
    };

    const commonClasses = cn(
      "group relative overflow-hidden transition-all duration-300 ease-in-out text-center select-none will-change-transform",
      variant !== "inline" && "border active:scale-[0.97] hover:scale-[1.02] hover:-translate-y-[4px] hover:shadow-[0_0_20px_rgba(244,197,66,0.25)] hover:border-[#F4C542]",
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    const rippleElement = variant !== "inline" ? (
      <span
        className={cn(
          "absolute rounded-full pointer-events-none bg-primary transition-transform duration-500 ease-out -translate-x-1/2 -translate-y-1/2 scale-0 z-0",
          isHovered && "scale-[3.5]"
        )}
        style={{
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          width: "120px",
          height: "120px",
        }}
      />
    ) : null;

    const content = (
      <>
        {rippleElement}
        <span className="relative z-10 flex items-center justify-center gap-2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 transition-colors duration-300">
          {children}
        </span>
      </>
    );

    const handleRef = (node: HTMLAnchorElement | null) => {
      linkRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    if (to) {
      const isExternal = to.startsWith("http") || to.startsWith("mailto:");
      if (isExternal) {
        return (
          <a
            ref={handleRef}
            href={to}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={commonClasses}
            {...props}
          >
            {content}
          </a>
        );
      }
      return (
        <Link
          ref={handleRef}
          to={to}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={commonClasses}
          {...(props as any)}
        >
          {content}
        </Link>
      );
    }

    return (
      <a
        ref={handleRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={commonClasses}
        {...props}
      >
        {content}
      </a>
    );
  }
);
HoverLink.displayName = "HoverLink";
