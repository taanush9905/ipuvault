import { useEffect, useState } from "react";
import { SelectionCard } from "@/components/selection-card";
import { BRANCHES, EXAM_TYPES, SEMESTERS, YEARS } from "@/lib/constants";
import { AboutSection, ContactSection } from "@/components/about-section";
import { FeedbackForm } from "@/components/feedback-form";
import { ColorThemePicker } from "@/components/color-theme-picker";
import { useTheme } from "@/components/theme-provider";
import { useSubjects } from "@/lib/use-subjects";
import { supabase } from "@/integrations/supabase/client";
import { PaperCard, type Paper } from "@/components/paper-card";
import { PaperViewer } from "@/components/paper-viewer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Sparkles, Inbox, Repeat2, ChevronRight, CalendarDays, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { countdown } from "@/lib/format";
import { cn } from "@/lib/utils";
type Datesheet = {
  id: string; branch: string; semester: number; subject: string;
  exam_type: string; exam_date: string; exam_time: string | null; venue: string | null;
};

export default function Browse() {
  const { colorTheme, setColorTheme } = useTheme();
  const [semester, setSemester] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [subjectQuery, setSubjectQuery] = useState("");
  const [chosenSubject, setChosenSubject] = useState<string | null>(null);

  const [year, setYear] = useState<string>("all");
  const [examType, setExamType] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");
  const [search, setSearch] = useState("");

  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [upcoming, setUpcoming] = useState<Datesheet[]>([]);
  const [open, setOpen] = useState<Paper | null>(null);

  // homepage data
  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data: ds } = await supabase.from("datesheets").select("*").gte("exam_date", today).order("exam_date", { ascending: true }).limit(5);
      setUpcoming((ds as Datesheet[]) || []);
    })();
  }, []);

  // load papers when subject chosen
  useEffect(() => {
    if (!chosenSubject || !branch || !semester) return;
    setLoading(true);
    (async () => {
      let q = supabase.from("papers").select("*")
        .eq("branch", branch).eq("semester", Number(semester)).eq("subject", chosenSubject);
      if (year !== "all") q = q.eq("year", Number(year));
      if (examType !== "all") q = q.eq("exam_type", examType);
      switch (sort) {
        case "upvoted": q = q.order("upvotes", { ascending: false }); break;
        case "downloads": q = q.order("downloads", { ascending: false }); break;
        case "starred": q = q.order("stars", { ascending: false }); break;
        default: q = q.order("created_at", { ascending: false });
      }
      const { data } = await q;
      setPapers((data as Paper[]) || []);
      setLoading(false);
    })();
  }, [chosenSubject, branch, semester, year, examType, sort]);

  const { subjects } = useSubjects(branch, semester ? Number(semester) : null);
  const visibleSubjects = subjects.filter((s) => s.toLowerCase().includes(subjectQuery.toLowerCase()));

  const visiblePapers = papers.filter((p) =>
    !search.trim() ||
    p.subject.toLowerCase().includes(search.toLowerCase()) ||
    (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
    p.uploader_name.toLowerCase().includes(search.toLowerCase())
  );

  // SUBJECT SELECTED → show papers
  if (chosenSubject) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{chosenSubject}</h2>
            <p className="text-sm text-muted-foreground">{branch} · Sem {semester}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/repeated?branch=${branch}&semester=${semester}&subject=${encodeURIComponent(chosenSubject)}`}>
                <Repeat2 className="h-4 w-4 mr-2" />Most repeated
              </Link>
            </Button>
            <Button variant="outline" onClick={() => { setChosenSubject(null); setSubjectsOpen(true); }}>
              Change subject
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by title, tag, uploader…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={examType} onValueChange={setExamType}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Exam type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {EXAM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="upvoted">Most upvoted</SelectItem>
              <SelectItem value="downloads">Most downloaded</SelectItem>
              <SelectItem value="starred">Most starred</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
          </div>
        ) : visiblePapers.length === 0 ? (
          <EmptyState text="No papers yet for this subject. Be the first to upload one!" />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {visiblePapers.map((p) => <PaperCard key={p.id} paper={p} onOpen={setOpen} />)}
          </div>
        )}

        <PaperViewer paper={open} onClose={() => setOpen(null)} />
      </div>
    );
  }

  // HOMEPAGE
  return (
    <div className="space-y-10">
      <section className="rounded-3xl gradient-primary p-8 sm:p-12 text-primary-foreground shadow-elegant">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Student-built · Always free
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance">
            Every previous year paper, in one clean vault.
          </h1>
          <p className="mt-3 text-primary-foreground/85 text-base sm:text-lg">
            Pick your semester and branch — get straight to the papers, datesheets and most-repeated questions.
          </p>
        </div>
      </section>

      {/* Btech selector card */}
      <section className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-3xl border bg-card p-6 sm:p-8 shadow-soft">
          <h2 className="text-2xl font-bold">BTech</h2>
          <p className="text-sm text-muted-foreground mt-1">Who needs sleep when you can engineer dreams?</p>

          <div className="mt-6 space-y-3">
            <Select value={semester} onValueChange={(v) => { setSemester(v); }}>
              <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Semester" /></SelectTrigger>
              <SelectContent>
                {SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>{ordinal(s)}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={branch} onValueChange={(v) => { setBranch(v); }} disabled={!semester}>
              <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Branch" /></SelectTrigger>
              <SelectContent>
                {BRANCHES.map((b) => <SelectItem key={b.code} value={b.code}>{b.code}</SelectItem>)}
              </SelectContent>
            </Select>

            <Button
              className="w-full h-12 rounded-2xl"
              disabled={!semester || !branch}
              onClick={() => { setSubjectQuery(""); setSubjectsOpen(true); }}
            >
              View subjects <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Upcoming exams — minimal */}
        <div className="rounded-3xl border bg-card p-6 sm:p-8 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" /> Upcoming exams
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Stay aware of what's around the corner</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/datesheet">All <ChevronRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>

          {upcoming.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">No upcoming exams posted yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((d) => {
                const cd = countdown(d.exam_date);
                return (
                  <li key={d.id} className="py-3 flex items-center gap-3">
                    <div className="rounded-xl border px-2.5 py-1.5 text-center min-w-[52px] bg-muted">
                      <div className="text-lg font-bold leading-none">{new Date(d.exam_date).getDate()}</div>
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {new Date(d.exam_date).toLocaleString("en-US", { month: "short" })}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{d.subject}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{d.branch} · Sem {d.semester}</span>
                        {d.exam_time && <span>· {d.exam_time}</span>}
                        {d.venue && <span className="hidden sm:inline-flex items-center gap-1">· <MapPin className="h-3 w-3" />{d.venue}</span>}
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-lg border",
                      cd.status === "today" ? "bg-warning/15 text-warning border-warning/30"
                        : cd.days <= 7 ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-border"
                    )}>
                      {cd.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Quick branch grid (kept for fast pick) */}
      <section>
        <h2 className="text-xl font-bold mb-4">Or jump straight to a branch</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BRANCHES.map((b) => (
            <SelectionCard
              key={b.code}
              title={b.code}
              subtitle={b.name}
              icon={b.icon}
              onClick={() => { setBranch(b.code); if (!semester) setSemester("1"); setSubjectsOpen(true); }}
            />
          ))}
        </div>
      </section>


      {/* Subjects sheet */}
      <Dialog open={subjectsOpen} onOpenChange={setSubjectsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose subject</DialogTitle>
            <p className="text-xs text-muted-foreground">{branch} · Sem {semester || "—"} · Tap one to view papers</p>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              value={subjectQuery}
              onChange={(e) => setSubjectQuery(e.target.value)}
              placeholder="Search subjects…"
              className="pl-10 h-11 rounded-xl"
            />
          </div>
          <div className="max-h-[55vh] overflow-y-auto -mx-6 px-6 space-y-2">
            {visibleSubjects.length === 0 ? (
              <EmptyState text="No subjects configured for this branch + semester yet." />
            ) : visibleSubjects.map((s) => (
              <button
                key={s}
                onClick={() => { setChosenSubject(s); setSubjectsOpen(false); }}
                className="w-full flex items-center justify-between rounded-xl border bg-card hover:bg-accent transition-colors px-4 py-3 text-left"
              >
                <span className="font-medium">{s}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <PaperViewer paper={open} onClose={() => setOpen(null)} />

      <section className="pt-8 space-y-8 border-t">
        <ColorThemePicker value={colorTheme} onChange={setColorTheme} />
        <AboutSection />
        <section id="feedback" className="scroll-mt-24">
          <div className="rounded-3xl border bg-card/80 backdrop-blur-sm p-8 sm:p-10 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Feedback</p>
            <h2 className="text-2xl font-bold mb-2">Send us your thoughts</h2>
            <p className="text-sm text-muted-foreground mb-6">No login required — your message goes straight to the admin.</p>
            <FeedbackForm />
          </div>
        </section>
        <ContactSection />
      </section>
    </div>
  );
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-card p-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-accent text-accent-foreground grid place-items-center mb-3">
        <Inbox className="h-5 w-5" />
      </div>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">{text}</p>
    </div>
  );
}
