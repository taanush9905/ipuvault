import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Info, FileText, Server, Users, UserCheck, ShieldAlert, RefreshCw, Mail, Cookie, Lock } from "lucide-react";

export default function PrivacyPolicy() {
  // SEO Requirements: Set document title and update meta description
  useEffect(() => {
    document.title = "Privacy Policy | IPU Vault";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionText = "IPU Vault is committed to protecting your privacy and academic data. Read our complete Privacy Policy to understand how we collect, use, and secure your information.";
    
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
      id: "introduction",
      title: "Introduction",
      icon: Info,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          Welcome to IPU Vault. IPU Vault (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is dedicated to protecting your privacy and providing a safe academic resource platform. This Privacy Policy describes how we collect, use, store, and protect your personal information when you use our website, services, and academic portal. By accessing or using IPU Vault, you agree to the terms outlined in this policy.
        </p>
      ),
    },
    {
      id: "info-collect",
      title: "Information We Collect",
      icon: FileText,
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>
            We only collect information that is necessary to provide you with the best possible academic resources. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account Information:</strong> When you register or authenticate (e.g., using Google Sign-In), we receive and store your email address, display name, and profile picture url.
            </li>
            <li>
              <strong>User Contributions:</strong> Any study materials, question papers (PYQs), repeated questions, or metadata you upload or post to the platform are stored and attributed to your user profile.
            </li>
            <li>
              <strong>Feedback and Communication:</strong> When you submit feedback or contact support, we store the content of your message, email, and any attachment details you provide.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "how-use",
      title: "How We Use Information",
      icon: ShieldCheck,
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>We use the data we collect for the following academic and administrative purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To manage your account, authenticate sessions, and customize your profile preferences.</li>
            <li>To publish and display your uploaded academic contributions (such as PYQs) with proper attribution.</li>
            <li>To review, moderate, and approve student-contributed academic resources.</li>
            <li>To improve platform usability, fix bugs, optimize page loading times, and enhance security.</li>
            <li>To respond to comments, issues, and feedback queries you submit.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "cookies",
      title: "Analytics and Cookies",
      icon: Cookie,
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>
            We use cookies and similar storage technologies (such as local storage) to provide essential website functions:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Authentication:</strong> Keeping you logged in across pages and browser sessions securely.
            </li>
            <li>
              <strong>Preferences:</strong> Remembering layout options, preferred branch/semester filters, and light/dark theme choices.
            </li>
            <li>
              <strong>Performance & Analytics:</strong> We use lightweight analytics tools (like Vercel Analytics) to track page visits and loading performance. These tools assist us in scaling infrastructure and do not track your activity across unrelated sites.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "security",
      title: "Data Security",
      icon: Lock,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We take the protection of your personal information seriously. IPU Vault implements industry-standard technical and organizational security measures, including HTTPS encryption for all data transfers and secure authentication powered by Supabase. While we strive to protect your data, please note that no method of transmission or electronic storage is completely secure, and we cannot guarantee absolute security.
        </p>
      ),
    },
    {
      id: "third-party",
      title: "Third-Party Services",
      icon: Server,
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>
            IPU Vault relies on trusted third-party providers to power specific functions of the platform:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Supabase:</strong> For backend database services, storage of uploads, and secure authentication.
            </li>
            <li>
              <strong>Vercel:</strong> For fast front-end hosting, content delivery networks (CDN), and anonymous performance analytics.
            </li>
          </ul>
          <p>
            These external services operate under their own privacy policies. We encourage you to review their policies directly to understand their data processing practices.
          </p>
        </div>
      ),
    },
    {
      id: "sharing",
      title: "Data Sharing",
      icon: Users,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We do not sell, trade, rent, or monetize your personal information or academic records under any circumstances. We do not share your private data with advertisers or third parties, except when required to satisfy legal compliance, enforce site guidelines, or protect the rights, property, and safety of IPU Vault and its student users.
        </p>
      ),
    },
    {
      id: "rights",
      title: "User Rights",
      icon: UserCheck,
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>
            As a student user of IPU Vault, you retain control over your academic account and data:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You can view and edit your profile details (display name, branch, semester) inside your Profile tab.</li>
            <li>You have the right to request deletion of your account, profile data, or question papers you have previously uploaded.</li>
            <li>To submit a data removal, export, or deletion request, please reach out to us using the contact details below.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "children",
      title: "Children's Privacy",
      icon: ShieldAlert,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          IPU Vault is designed for university students, educators, and academic users (primarily BTech and college courses). We do not knowingly collect or solicit personal information from children under the age of 13. If we discover that a child under 13 has registered or provided personal information, we will take immediate steps to delete that data from our database servers.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      icon: RefreshCw,
      content: (
        <p className="text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time to align with changing platform features, security updates, or regulatory standards. If we make material changes, we will post the revised policy on this page and update the &ldquo;Last Updated&rdquo; date at the top. We encourage you to review this policy periodically to stay informed.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: Mail,
      content: (
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>
            If you have questions, feedback, or data removal requests regarding this Privacy Policy, please feel free to reach out:
          </p>
          <div className="mt-3 p-4 glass-panel rounded-2xl inline-flex items-center gap-3 bg-secondary/30">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">VaultTeam Contact</p>
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
            <Lock className="h-3 w-3" /> Data Security & Transparency
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Privacy Policy
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
          This Privacy Policy details our approach to personal data protection. We make it a priority to maintain the confidentiality of our users and explain transparently how your academic activity and files are handled.
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
              <span>{section.title}</span>
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
