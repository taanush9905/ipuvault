import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, CalendarDays, HeartHandshake, User, GraduationCap, ShieldCheck, ListChecks, GitBranch, Upload } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { AppearancePanel } from "@/components/appearance-panel";
import { SiteNotifications } from "@/components/site-notifications";

const baseNav = [
  { to: "/", label: "Browse", icon: BookOpen },
  { to: "/datesheet", label: "Datesheet", icon: CalendarDays },
  { to: "/contribute", label: "Contribute", icon: HeartHandshake },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user, profile, isAdmin } = useAuth();

  const navItems = isAdmin
    ? [
        ...baseNav,
        { to: "/upload", label: "Upload", icon: Upload },
        { to: "/admin/approvals", label: "Approvals", icon: ShieldCheck },
        { to: "/admin/subjects", label: "Subjects", icon: ListChecks },
        { to: "/admin/branches", label: "Branches", icon: GitBranch },
      ]
    : baseNav;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {pathname === "/" && <SiteNotifications />}
          <NavLink to="/" className="flex items-center gap-2.5 font-semibold">
            <div className="h-9 w-9 rounded-xl bg-foreground text-background grid place-items-center shadow-soft">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline text-base tracking-tight">IPU Vault</span>
          </NavLink>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2",
                    active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <AppearancePanel />
            {user && (
              <NavLink to="/profile" className="hidden sm:flex items-center gap-2 rounded-full border pl-1 pr-3 py-1 hover:bg-secondary/80 transition-colors">
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

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl">
        <div style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }} className="grid">
          {navItems.map((item) => {
            const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
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
