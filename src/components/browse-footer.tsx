import { AboutSection, ContactSection } from "@/components/about-section";
import { FeedbackForm } from "@/components/feedback-form";
import { GraduationCap, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TEAM = [
  { name: "VaultAdmin", role: "Founder & Maintainer", linkedin: "https://www.linkedin.com/in/taanush9905" },
];

export function BrowseFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-card/40 backdrop-blur-xl">
      <div className="container py-14 sm:py-16 space-y-12">
        <AboutSection />
        <section id="feedback" className="scroll-mt-24">
          <div className="glass-panel rounded-3xl p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Feedback</p>
            <h2 className="text-2xl font-bold mb-2">Send us your thoughts</h2>
            <p className="text-sm text-muted-foreground mb-6">No login required.</p>
            <FeedbackForm />
          </div>
        </section>
        <ContactSection />

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 pt-8 border-t border-border/60">
          <div className="space-y-3 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-foreground text-background grid place-items-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <p className="font-semibold text-lg">IPU Vault</p>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">PYQs, repeated topics, and exam resources for every branch.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Links</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#about" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="/#contact" className="hover:text-foreground transition-colors">Contact Us</a></li>
              <li><Link to="/contribute" className="hover:text-foreground transition-colors">Contribute</Link></li>
              <li><a href="/#feedback" className="hover:text-foreground transition-colors">Feedback</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Legal</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">VaultTeam</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {TEAM.map((m) => (
              <div key={m.name} className="glass-panel rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
                <Button asChild variant="outline" size="icon" className="rounded-xl">
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /></a>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">© {new Date().getFullYear()} IPU Vault</p>
      </div>
    </footer>
  );
}
