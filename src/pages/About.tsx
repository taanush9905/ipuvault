import { useEffect } from "react";
import { ArrowLeft, BookOpen, GraduationCap, HeartHandshake, Linkedin, Mail, Sparkles, Trophy } from "lucide-react";
import { HoverLink } from "@/components/ui/hover-link";

const TEAM = [
  {
    name: "VaultAdmin",
    role: "Founder & Lead Maintainer",
    bio: "Focused on building performant, clean utility products that solve real student pain points.",
    linkedin: "https://www.linkedin.com/in/taanush9905",
  },
];

export default function About() {
  // SEO title and description update
  useEffect(() => {
    document.title = "About Us | IPU Vault";
    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionText = "Learn about the mission, values, and team behind IPU Vault — a premium, student-first academics platform designed to simplify your engineering prep.";
    
    if (metaDescription) {
      metaDescription.setAttribute("content", descriptionText);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = descriptionText;
      document.head.appendChild(meta);
    }
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-8 animate-fade-in pb-16">
      {/* Back button */}
      <div>
        <HoverLink
          to="/"
          variant="ghost"
          size="sm"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group px-3 py-1.5 rounded-xl hover:bg-secondary/60"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </HoverLink>
      </div>

      {/* Hero Header panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-36 w-36 bg-primary-glow/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium">
            <GraduationCap className="h-3.5 w-3.5" /> Student-First Academics
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            About IPU Vault
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>VaultTeam Project</span>
          </div>
          <span>•</span>
          <span>Version 2.0</span>
        </div>
        
        <hr className="border-border/60" />
        
        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
          IPU Vault is a premium academic cataloging platform built for BTech students. We index previous-year question papers, exam datesheets, and recurring exam syllabus topics — helping students prepare efficiently without the clutter.
        </p>
      </div>

      {/* Grid: Mission and Platform */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-2">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">Our Mission</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Academics shouldn't feel like a navigation puzzle. Our goal is to catalog high-yield materials in an ultra-clean, ad-free environment. By combining premium design with robust database indexing, we offer students the resources they need exactly when they need them.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-2">
            <Trophy className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">Why IPU Vault?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Most college repositories suffer from heavy layout shifts, spam advertisements, and outdated links. IPU Vault fixes this by leveraging premium modern front-end technologies, robust Supabase authentication, and a peer-reviewed contribution pipeline.
          </p>
        </div>
      </div>

      {/* Features Overview */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" /> Key Core Modules
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="border border-border/50 rounded-2xl p-4 bg-secondary/10 space-y-1">
            <div className="text-xs font-semibold uppercase text-primary tracking-wider">PYQ Vault</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Carefully organized question paper bank by branch, year, semester, and subject.
            </p>
          </div>
          <div className="border border-border/50 rounded-2xl p-4 bg-secondary/10 space-y-1">
            <div className="text-xs font-semibold uppercase text-primary tracking-wider">Repeated Pad</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Track recurrence patterns of high-yield questions, upvoted by actual students.
            </p>
          </div>
          <div className="border border-border/50 rounded-2xl p-4 bg-secondary/10 space-y-1">
            <div className="text-xs font-semibold uppercase text-primary tracking-wider">Live Datesheets</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real-time countdown schedules and examination venues synced with official records.
            </p>
          </div>
        </div>
      </div>

      {/* Team Profile */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" /> The VaultTeam
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Building digital utility experiences for the developer & student communities.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-1">
          {TEAM.map((m) => (
            <div key={m.name} className="border border-border/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-secondary/10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg">{m.name}</p>
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 font-medium">{m.role}</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">{m.bio}</p>
              </div>
              <HoverLink
                to={m.linkedin}
                variant="outline"
                size="sm"
                className="rounded-xl shrink-0"
              >
                <Linkedin className="h-4 w-4 mr-1" /> Connect
              </HoverLink>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Contact section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" /> Get in Touch
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Have feedback, found a bug, or want to contribute a batch of question papers? Reach out to VaultTeam. We respond to student emails and suggestions promptly.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <HoverLink
            to="mailto:taanush9905@gmail.com"
            variant="primary"
            className="rounded-xl"
          >
            <Mail className="h-4 w-4 mr-1.5" /> Email Support
          </HoverLink>
          <HoverLink
            to="https://www.linkedin.com/in/taanush9905"
            variant="outline"
            className="rounded-xl"
          >
            <Linkedin className="h-4 w-4 mr-1.5" /> LinkedIn
          </HoverLink>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-muted-foreground pt-4">
        <p>© {new Date().getFullYear()} IPU Vault · Built for Engineering Excellence</p>
      </div>
    </div>
  );
}
