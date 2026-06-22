import { GraduationCap, Linkedin, Mail, HeartHandshake, ShieldCheck, BookOpen, MessageSquare, Terminal } from "lucide-react";
import { HoverLink } from "@/components/ui/hover-link";

const TEAM = [
  {
    name: "VaultAdmin",
    role: "Founder & Maintainer",
    linkedin: "https://www.linkedin.com/in/taanush9905",
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/40 bg-card/30 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 py-16">
        {/* Main Columns Grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6 relative z-10">
          
          {/* Brand Column */}
          <div className="space-y-5 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-foreground text-background grid place-items-center shadow-elegant">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  IPU Vault
                </p>
                <p className="text-xs text-muted-foreground">Student-First Academics Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              A premium, distraction-free repository for Previous Year Questions (PYQs) and repeated syllabus topics — helping students learn faster.
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.linkedin.com/in/taanush9905"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-xl border border-border bg-card/60 grid place-items-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:taanush09905@gmail.com"
                className="h-9 w-9 rounded-xl border border-border bg-card/60 grid place-items-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" /> Product
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <HoverLink to="/" variant="inline" size="inline">
                  Browse PYQs
                </HoverLink>
              </li>
              <li>
                <HoverLink to="/datesheet" variant="inline" size="inline">
                  Exam Datesheets
                </HoverLink>
              </li>
              <li>
                <HoverLink to="/repeated" variant="inline" size="inline">
                  Repeated Topics
                </HoverLink>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <HeartHandshake className="h-3.5 w-3.5 text-primary" /> Resources
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <HoverLink to="/contribute" variant="inline" size="inline">
                  Contribute PYQs
                </HoverLink>
              </li>
              <li>
                <HoverLink to="/#feedback" variant="inline" size="inline">
                  Send Feedback
                </HoverLink>
              </li>
              <li>
                <HoverLink to="/upload" variant="inline" size="inline">
                  Admin Upload
                </HoverLink>
              </li>
            </ul>
          </div>

          {/* Column 3: Community */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-primary" /> Community
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <HoverLink to="/about" variant="inline" size="inline">
                  About Us
                </HoverLink>
              </li>
              <li>
                <HoverLink to="mailto:taanush9905@gmail.com" variant="inline" size="inline">
                  Contact Us
                </HoverLink>
              </li>
              <li>
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <Terminal className="h-3 w-3" /> active community
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Legal
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <HoverLink to="/privacy-policy" variant="inline" size="inline">
                  Privacy Policy
                </HoverLink>
              </li>
              <li>
                <HoverLink to="/terms-of-service" variant="inline" size="inline">
                  Terms of Service
                </HoverLink>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-12 border-border/40" />

        {/* Bottom Section: Team and Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Team profiles */}
          <div className="w-full md:w-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Maintainers</p>
            <div className="flex flex-wrap gap-3">
              {TEAM.map((m) => (
                <div key={m.name} className="glass-panel rounded-2xl p-3 flex items-center justify-between gap-4 bg-card/60 hover:border-primary/30 transition-all duration-300">
                  <div>
                    <p className="text-xs font-semibold">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.role}</p>
                  </div>
                  <HoverLink
                    to={m.linkedin}
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 rounded-lg text-xs"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                  </HoverLink>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright text */}
          <div className="text-center md:text-right space-y-1 md:self-end">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} IPU Vault · Dedicated to Student Academics.
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              Not affiliated with GGSIPU. Created by students, for students.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
