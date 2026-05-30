import { SelectionCard } from "@/components/selection-card";
import { useBranches } from "@/lib/use-branches";
import { Zap, Layers, Repeat2, Users, Sparkles } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Fast access to PYQs", desc: "Find papers in seconds, not hours." },
  { icon: Layers, title: "Branch-wise organization", desc: "Structured by branch, semester, and subject." },
  { icon: Repeat2, title: "Most repeated topics", desc: "See what keeps coming back in exams." },
  { icon: Users, title: "Community contributions", desc: "Students help grow the vault for everyone." },
  { icon: Sparkles, title: "Distraction-free UI", desc: "Clean, focused, premium study flow." },
];

type Props = {
  onBranchPick: (code: string) => void;
};

export function LandingAbout({ onBranchPick }: Props) {
  const { branches } = useBranches();

  return (
    <section id="about" className="scroll-mt-24 space-y-8">
      <div className="glass-panel rounded-3xl p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">About IPU Vault</p>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-balance">
          Built by students, for students.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-3xl">
          IPU Vault is a student-first academic platform built to make exam resources accessible to everyone.
          We believe students should spend less time searching for papers and more time actually learning.
        </p>
        <p className="mt-3 text-muted-foreground leading-relaxed max-w-3xl">
          Our mission is to simplify access to PYQs, most repeated topics, important resources, exam material, and branch-wise academic content.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="glass-panel rounded-2xl p-5 hover-lift group">
            <f.icon className="h-5 w-5 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold">{f.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Browse by branch</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {branches.map((b) => (
            <SelectionCard
              key={b.code}
              title={b.code}
              subtitle={b.name}
              icon={b.icon}
              onClick={() => onBranchPick(b.code)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
