import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKEDIN_URL = "https://www.linkedin.com/in/taanush9905";
const GMAIL_URL = "mailto:taanush09905@gmail.com";

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4caf50" d="M45 16.18v17.64c0 1.24-1 2.18-2.18 2.18H5.18C3.94 36 3 35.06 3 33.82V16.18l21 16.34L45 16.18z" />
      <path fill="#1e88e5" d="M45 14.82L24 31.16 3 14.82V14c0-1.24 1-2.18 2.18-2.18h37.64C44 11.82 45 12.76 45 14v.82z" />
      <path fill="#e53935" d="M3 14v19.82V14zm0 0V14l10.67 8.26L3 14z" />
      <path fill="#c62828" d="M3 14l10.67 8.26L21 31.16 3 14z" />
      <path fill="#fbc02d" d="M24 31.16L45 14.82V14c0-1.24-1-2.18-2.18-2.18H24v19.34z" />
    </svg>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24">
      <div className="rounded-3xl border bg-card/80 backdrop-blur-sm p-8 sm:p-10 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">About us</p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">IPU Vault</h2>
        <p className="text-muted-foreground leading-relaxed max-w-3xl">
          IPU Vault helps BTech students browse previous-year question papers, exam datesheets, and
          most-repeated topics — organized by branch, semester, and subject in one premium, distraction-free place.
        </p>
        <p className="text-muted-foreground leading-relaxed max-w-3xl mt-4">
          Maintained by <strong className="text-foreground">VaultTeam</strong> with a mission to simplify access to PYQs,
          important topics, and preparation material for every branch.
        </p>
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="rounded-xl gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A66C2] text-white shadow-inner">
                <Linkedin className="h-5 w-5" strokeWidth={2.25} />
              </span>
              Connect on LinkedIn
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24">
      <div className="rounded-3xl border bg-card/80 backdrop-blur-sm p-8 sm:p-10 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Contact us</p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Get in touch</h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-xl">
          Questions, ideas, or feedback — reach out anytime.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            asChild
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-xl border-border hover:scale-105 transition-transform shadow-sm"
            aria-label="Email VaultTeam"
          >
            <a href={GMAIL_URL}>
              <GmailIcon className="h-7 w-7" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-xl gap-2"
          >
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A66C2] text-white">
                <Linkedin className="h-5 w-5" strokeWidth={2.25} />
              </span>
              Connect on LinkedIn
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
