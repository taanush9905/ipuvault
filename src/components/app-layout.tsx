import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, CalendarDays, Upload, User, Moon, Sun, GraduationCap, ShieldCheck, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";


const baseNav = [
  { to: "/", label: "Browse", icon: BookOpen },
  { to: "/datesheet", label: "Datesheet", icon: CalendarDays },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const { user, profile, isAdmin } = useAuth();
  
  const navItems = isAdmin
    ? [...baseNav, { to: "/admin/approvals", label: "Approvals", icon: ShieldCheck }, { to: "/admin/subjects", label: "Subjects", icon: ListChecks }]
    : baseNav;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <div className="h-9 w-9 rounded-lg gradient-primary grid place-items-center text-primary-foreground shadow-soft">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-base">PYQ Vault</span>
              <span className="text-[11px] text-muted-foreground font-normal">BTech papers & datesheets</span>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                    active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="rounded-full"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {user && (
              <NavLink to="/profile" className="hidden sm:flex items-center gap-2 rounded-full border pl-1 pr-3 py-1 hover:bg-secondary">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-semibold">
                    {(profile?.display_name || profile?.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium max-w-[120px] truncate">{profile?.display_name || profile?.email}</span>
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6 pb-24 md:pb-10 animate-fade-in">{children}</main>



      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-lg">
        <div className={cn("grid", navItems.length >= 6 ? "grid-cols-6" : navItems.length === 5 ? "grid-cols-5" : "grid-cols-4")}>
          {navItems.map((item) => {
            const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
            return (
              <NavLink key={item.to} to={item.to}
                className={cn("flex flex-col items-center justify-center gap-1 py-3 text-xs",
                  active ? "text-primary" : "text-muted-foreground")}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
