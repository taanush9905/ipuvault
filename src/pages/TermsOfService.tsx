import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Scale, Info, FileText, Globe, Key, BookOpen, AlertTriangle, XOctagon, RefreshCw, Mail, Lock } from "lucide-react";

export default function TermsOfService() {
  // SEO Requirements: Set document title and update meta description
  useEffect(() => {
    document.title = "Terms of Service | IPU Vault";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionText = "Read the Terms of Service governing the use of IPU Vault and its educational resources.";
    
    if (metaDescription) {
      metaDescription.setAttribute("content", descriptionText);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = descriptionText;
      document.head.appendChild(meta);
    }
    
    // Scroll to top on load
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: Scale,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          By accessing, browsing, or using IPU Vault, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These terms form a legally binding agreement between you and IPU Vault. If you do not agree to these terms, please do not access or use the platform.
        </p>
      ),
    },
    {
      id: "eligibility",
      title: "2. Eligibility and Accounts",
      icon: Key,
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>
            IPU Vault is primarily designed for university and college students (specifically those pursuing engineering and higher education degrees). 
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account Creation:</strong> You can access basic features without registering. However, to submit content, track stars, or personalize options, you must authenticate using Google or other supported third-party providers.
            </li>
            <li>
              <strong>Account Security:</strong> You are responsible for keeping your login credentials confidential and for all academic or uploads activities that occur under your account session.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "use-services",
      title: "3. Use of Services",
      icon: Globe,
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>We grant you a personal, limited, non-transferable, and revocable license to access and use IPU Vault under these conditions:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You may browse and download academic papers, syllabus details, datesheets, and study notes solely for your personal, non-commercial education and exam preparation.</li>
            <li>You may not use scripts, bots, scrapers, or other automated methods to crawl or extract bulk data from IPU Vault.</li>
            <li>Any attempt to disrupt the performance, layout, or security infrastructure of the platform is strictly prohibited.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "contributions",
      title: "4. User Contributions and Content",
      icon: FileText,
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>
            IPU Vault allows students and educators to contribute academic resources such as past-year question papers (PYQs), repeated questions lists, and syllabus guides:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Ownership:</strong> You retain any copyright you own in the academic files you upload. By uploading content, you grant IPU Vault a non-exclusive, worldwide, royalty-free license to display, host, and distribute that material to other users.
            </li>
            <li>
              <strong>Prohibited Content:</strong> You must not upload any files, answers, or documents that contain copyrighted books, proprietary answer keys, trade secrets, private university metadata, or offensive materials.
            </li>
            <li>
              <strong>Responsibility:</strong> You represent that you have all necessary rights to share the documents you contribute. IPU Vault does not guarantee the accuracy, completeness, or legitimacy of user-contributed files.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "intellectual-property",
      title: "5. Intellectual Property Rights",
      icon: BookOpen,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          The code, structure, UI/UX designs, trademarks, logos, system databases, and unique branding of IPU Vault are the exclusive property of VaultTeam and are protected by intellectual property laws. You may not copy, reproduce, modify, or distribute any part of the site architecture or designs without our prior written authorization.
        </p>
      ),
    },
    {
      id: "conduct",
      title: "6. Code of Conduct",
      icon: XOctagon,
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>
            To keep IPU Vault a clean and premium resource center for all engineering students, you agree not to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Submit false, misleading, or spam feedback forms.</li>
            <li>Impersonate other students, faculty, or system administrators.</li>
            <li>Upload malware, viruses, or code designed to interfere with user accounts or server systems.</li>
            <li>Engage in harassment, abusive behavior, or post inappropriate comments during resource contributions.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "disclaimers",
      title: "7. Disclaimers & Limitation of Liability",
      icon: AlertTriangle,
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
          <p>
            <strong>PROVIDED &ldquo;AS-IS&rdquo;:</strong> IPU Vault and all materials, question papers, date updates, and notes are provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis. We make no warranties of any kind, express or implied, regarding the accuracy, completeness, or reliability of any question papers or datesheet timings.
          </p>
          <p>
            <strong>EXAM ACCURACY WARNING:</strong> Datesheets and academic notices are posted for convenience. Always verify exam schedules, venues, and timings with your official university portal or department. IPU Vault is not responsible for any exam scheduling conflicts, incorrect syllabus details, or academic outcomes.
          </p>
          <p>
            <strong>LIMITATION:</strong> Under no circumstances shall VaultTeam be liable for direct, indirect, incidental, special, or consequential damages resulting from your use of, or inability to use, this platform.
          </p>
        </div>
      ),
    },
    {
      id: "termination",
      title: "8. Suspension & Termination",
      icon: XOctagon,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We reserve the right, without notice and at our sole discretion, to suspend or terminate your account access, delete your user profile, or remove/modify any academic documents you have uploaded if we believe you have violated these Terms of Service or engaged in behavior harmful to our community.
        </p>
      ),
    },
    {
      id: "changes",
      title: "9. Changes to Terms",
      icon: RefreshCw,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We reserve the right to revise or update these Terms of Service at any time. When updates are published, we will refresh the &ldquo;Last Updated&rdquo; date at the top of this page. Your continued use of IPU Vault following the publication of changes signifies your acceptance of the updated terms.
        </p>
      ),
    },
    {
      id: "governing-law",
      title: "10. Governing Law",
      icon: Scale,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          These Terms of Service shall be governed by, and construed in accordance with, the laws applicable to user registrations, without regard to conflicts of law principles. Any legal actions or proceedings arising out of these terms shall be subject to the exclusive jurisdiction of the appropriate local courts.
        </p>
      ),
    },
    {
      id: "contact",
      title: "11. Contact Us",
      icon: Mail,
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>
            If you have any questions, feedback, or need clarification regarding these Terms of Service, please contact the VaultTeam:
          </p>
          <div className="mt-3 p-4 glass-panel rounded-2xl inline-flex items-center gap-3 bg-secondary/30">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">VaultTeam Support</p>
              <a href="mailto:taanush9905@gmail.com" className="text-sm font-semibold text-primary hover:underline transition-colors">
                taanush9905@gmail.com
              </a>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-8 animate-fade-in pb-16">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group px-3 py-1.5 rounded-xl hover:bg-secondary/60"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>

      {/* Header panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-36 w-36 bg-primary-glow/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium">
            <Lock className="h-3 w-3" /> Standard Licensing & Guidelines
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Terms of Service
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>IPU Vault</span>
          </div>
          <span>•</span>
          <span>Last Updated: June 17, 2026</span>
        </div>
        
        <hr className="border-border/60" />
        
        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
          These Terms of Service govern your access and use of the IPU Vault academic portal. By using this website, you agree to respect academic integrity and follow these community guidelines.
        </p>
      </div>

      {/* Quick Navigation Panel */}
      <div className="glass-panel rounded-3xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Table of Contents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="px-3 py-2 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all duration-200 truncate flex items-center gap-2 border border-transparent hover:border-border/60"
            >
              <section.icon className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{section.title.split(". ")[1]}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Policy Sections */}
      <div className="space-y-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 glass-panel rounded-3xl p-6 sm:p-8 space-y-4 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{section.title}</h2>
              </div>
              <hr className="border-border/50" />
              <div className="text-sm sm:text-base">
                {section.content}
              </div>
            </section>
          );
        })}
      </div>

      {/* Final note */}
      <div className="text-center text-xs text-muted-foreground pt-4">
        <p>© {new Date().getFullYear()} IPU Vault · Dedicated to Student Academics</p>
      </div>
    </div>
  );
}
