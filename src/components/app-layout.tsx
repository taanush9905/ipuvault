import * as React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, CalendarDays, HeartHandshake, User, GraduationCap, ShieldCheck, ListChecks, GitBranch, Upload, Search, Menu, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { AppearancePanel } from "@/components/appearance-panel";
import { SiteNotifications } from "@/components/site-notifications";
import { SiteFooter } from "@/components/site-footer";
import { HoverLink } from "@/components/ui/hover-link";
import { HoverButton } from "@/components/ui/hover-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { SUBJECTS_BY_BRANCH_SEM } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";

const baseNav = [
  { to: "/", label: "Browse", icon: BookOpen },
  { to: "/datesheet", label: "Datesheet", icon: CalendarDays },
  { to: "/contribute", label: "Contribute", icon: HeartHandshake },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();

  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dbSubjects, setDbSubjects] = React.useState<{ name: string; branch: string; semester: number }[]>([]);

  // Listen to Cmd+K or Ctrl+K shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load custom database subjects when search is active
  React.useEffect(() => {
    if (searchOpen) {
      void supabase
        .from("subjects")
        .select("name, branch, semester, hidden")
        .eq("hidden", false)
        .then(({ data }) => {
          if (data) {
            setDbSubjects(data as { name: string; branch: string; semester: number }[]);
          }
        });
    }
  }, [searchOpen]);

  // Flatten static subjects
  const staticSubjects = React.useMemo(() => {
    const list: { name: string; branch: string; semester: number }[] = [];
    for (const [branch, sems] of Object.entries(SUBJECTS_BY_BRANCH_SEM)) {
      for (const [semStr, subjects] of Object.entries(sems)) {
        const semester = Number(semStr);
        for (const name of subjects) {
          if (!list.some((item) => item.name === name && item.branch === branch && item.semester === semester)) {
            list.push({ name, branch, semester });
          }
        }
      }
    }
    return list;
  }, []);

  // Merge static & db subjects
  const allSubjects = React.useMemo(() => {
    const list = [...staticSubjects];
    for (const sub of dbSubjects) {
      if (!list.some((item) => item.name === sub.name && item.branch === sub.branch && item.semester === sub.semester)) {
        list.push(sub);
      }
    }
    return list;
  }, [staticSubjects, dbSubjects]);

  // Filter based on search query
  const filteredSubjects = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allSubjects
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.branch.toLowerCase().includes(q) ||
          `sem ${item.semester}`.includes(q) ||
          `semester ${item.semester}`.includes(q)
      )
      .slice(0, 8);
  }, [allSubjects, searchQuery]);

  const handleSelectSubject = (branch: string, semester: number, subjectName: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/?branch=${branch}&semester=${semester}&subject=${encodeURIComponent(subjectName)}`);
  };

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
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Sticky Header */}
      <header className="sticky top-4 z-40 mx-auto w-full max-w-6xl px-4 transition-all duration-300 overflow-hidden">
        <div className="liquid-glass rounded-2xl px-4 sm:px-6 flex h-16 items-center justify-between gap-3 bg-[#0B1220]/75 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          
          {/* Logo & Notifications */}
          <div className="flex items-center gap-3 shrink-0">
            {pathname === "/" && <SiteNotifications />}
            <NavLink to="/" className="flex items-center gap-2.5 font-bold">
              <motion.div 
                whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 10px rgba(244,197,66,0.6))" }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                className="flex items-center gap-2.5"
              >
                <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-[0_0_15px_rgba(244,197,66,0.35)]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-lg tracking-tight text-white hover:text-primary transition-colors hidden sm:inline">
                  IPU Vault
                </span>
              </motion.div>
            </NavLink>
          </div>

          {/* Search Trigger (Elegantly integrated in center/right navbar) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex min-w-0 flex-1 max-w-[220px] md:max-w-[300px] items-center justify-between gap-2 rounded-xl px-3 py-2 bg-white/5 text-muted-foreground hover:bg-white/10 transition-all duration-300 cursor-pointer text-left group focus:outline-none focus:ring-1 focus:ring-primary/50"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
            title="Search subjects... (Ctrl+K)"
          >
            <span className="flex items-center gap-2 text-xs truncate">
              <Search className="h-4 w-4 text-muted-foreground/80 group-hover:text-primary transition-colors shrink-0" />
              <span className="truncate">Search subjects…</span>
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-background border border-white/10 rounded font-mono text-muted-foreground select-none pointer-events-none shadow-xs shrink-0">
              ⌘K
            </kbd>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "group relative px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap",
                    active ? "text-primary font-bold" : "text-muted-foreground hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                  {active ? (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(244,197,66,0.6)]"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  ) : (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300 rounded-full" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile / Auth Action & Color Scheme */}
          <div className="flex items-center gap-2 shrink-0">
            <AppearancePanel />

            {/* Profile Route or Login CTA */}
            {user ? (
              <NavLink
                to="/profile"
                className="hidden sm:flex items-center gap-2 rounded-xl pl-1.5 pr-3.5 py-1.5 hover:bg-white/10 transition-all hover:scale-[1.02] bg-white/5"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-7 w-7 rounded-lg object-cover" />
                ) : (
                  <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground grid place-items-center text-xs font-bold shadow-[0_0_8px_rgba(244,197,66,0.3)]">
                    {(profile?.display_name || profile?.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold max-w-[90px] truncate text-white">
                  {profile?.display_name || profile?.email?.split("@")[0]}
                </span>
              </NavLink>
            ) : (
              <HoverLink
                to="/auth"
                variant="outline"
                size="sm"
                className="hidden sm:flex rounded-xl border-white/10 hover:border-primary text-white"
              >
                <LogIn className="h-4 w-4" /> Login
              </HoverLink>
            )}

            {/* Mobile Sheet Burger Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] rounded-l-3xl border-l p-6 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Brand logo in menu */}
                  <div className="flex items-center gap-2.5 font-bold pb-4 border-b">
                    <div className="h-9 w-9 rounded-xl bg-foreground text-background grid place-items-center">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <span className="text-base tracking-tight text-foreground">IPU Vault</span>
                  </div>

                  {/* Nav items */}
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                      const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
                      return (
                        <SheetClose asChild key={item.to}>
                          <NavLink
                            to={item.to}
                            className={cn(
                              "px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-3 transition-colors border border-transparent",
                              active
                                ? "bg-accent text-accent-foreground border-accent-foreground/5"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                          </NavLink>
                        </SheetClose>
                      );
                    })}
                  </nav>
                </div>

                {/* Profile in menu bottom */}
                <div className="pt-6 border-t">
                  {user ? (
                    <SheetClose asChild>
                      <NavLink
                        to="/profile"
                        className="flex items-center gap-3 p-2.5 rounded-2xl border hover:bg-secondary transition-colors"
                      >
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="" className="h-9 w-9 rounded-xl object-cover" />
                        ) : (
                          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center text-sm font-bold">
                            {(profile?.display_name || profile?.email || "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-foreground truncate">{profile?.display_name || profile?.email}</p>
                          <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                        </div>
                      </NavLink>
                    </SheetClose>
                  ) : (
                    <SheetClose asChild>
                      <HoverLink
                        to="/auth"
                        variant="primary"
                        className="w-full rounded-2xl"
                      >
                        <LogIn className="h-4 w-4 mr-2" /> Sign In
                      </HoverLink>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </header>

      {/* Main View Container */}
      <main className="flex-1 container mx-auto px-4 py-8 pb-20 animate-fade-in">
        {children}
      </main>

      {/* Global SaaS Footer */}
      <SiteFooter />

      {/* Global Subject Search Command Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl border shadow-elegant bg-card/95 backdrop-blur-md">
          <DialogHeader className="p-5 border-b bg-muted/20">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" /> Find Subject resources
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Search by name, branch code, or semester (e.g., CSE sem 4).
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search subjects..."
                className="pl-10 h-12 rounded-2xl border-border bg-background focus-visible:ring-primary shadow-inner text-sm"
              />
            </div>
            
            {/* Search Results */}
            <div className="max-h-[320px] overflow-y-auto space-y-1.5 pr-1">
              {searchQuery.trim().length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Type a subject name (e.g. Database Management Systems, Networks)
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground italic">
                  No subjects match your query.
                </div>
              ) : (
                filteredSubjects.map((item) => (
                  <button
                    key={`${item.branch}-${item.semester}-${item.name}`}
                    type="button"
                    onClick={() => handleSelectSubject(item.branch, item.semester, item.name)}
                    className="w-full flex items-center justify-between rounded-2xl border bg-background hover:bg-accent/40 hover:border-primary/20 transition-all duration-200 px-4 py-3.5 text-left group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                        <span className="font-bold text-primary bg-primary/10 border border-primary/20 rounded px-1.5 py-0.5">
                          {item.branch}
                        </span>
                        <span>·</span>
                        <span>Semester {item.semester}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-primary group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center gap-1">
                      View catalog →
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

