import { Link } from "react-router-dom";
import { GraduationCap, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const TEAM = [
  {
    name: "VaultAdmin",
    role: "Founder & Maintainer",
    linkedin: "https://www.linkedin.com/in/taanush9905",
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-card/40 backdrop-blur-xl">
      <div className="container py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-foreground text-background grid place-items-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-lg tracking-tight">IPU Vault</p>
                <p className="text-sm text-muted-foreground">VaultTeam · Student-first academics</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              A premium academic platform for PYQs, repeated topics, and exam resources — built to help students learn faster with less friction.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Platform</p>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/#about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="/#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              <li><Link to="/contribute" className="text-muted-foreground hover:text-foreground transition-colors">Contribute</Link></li>
              <li><a href="/#feedback" className="text-muted-foreground hover:text-foreground transition-colors">Feedback</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Legal</p>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-muted-foreground">Privacy Policy</span></li>
              <li><span className="text-muted-foreground">Terms of Use</span></li>
              <li><span className="text-muted-foreground">Team</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/60">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">VaultTeam</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {TEAM.map((m) => (
              <div key={m.name} className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.role}</p>
                </div>
                <Button asChild variant="outline" size="icon" className="rounded-xl shrink-0">
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          © {new Date().getFullYear()} IPU Vault · VaultTeam. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
