import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { EXAM_TYPES, SEMESTERS, YEARS } from "@/lib/constants";
import { useBranches } from "@/lib/use-branches";
import { usePaperStars } from "@/lib/use-paper-stars";
import { HeroSection } from "@/components/hero-section";
import { RepeatedHighlight } from "@/components/repeated-highlight";
import { useSubjects } from "@/lib/use-subjects";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PaperCard, type Paper } from "@/components/paper-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Inbox, ChevronRight, CalendarDays, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { countdown } from "@/lib/format";
import { cn } from "@/lib/utils";
import { formatDatesheetBranches } from "@/lib/datesheet-label";

const PaperViewer = lazy(() => import("@/components/paper-viewer").then((m) => ({ default: m.PaperViewer })));
const BrowseFooter = lazy(() => import("@/components/browse-footer").then((m) => ({ default: m.BrowseFooter })));
const AnnouncementBanners = lazy(() => import("@/components/site-notifications").then((m) => ({ default: m.AnnouncementBanners })));

const PAPER_COLS =
  "id,branch,semester,subject,exam_type,year,title,description,tags,file_path,uploader_name,views,downloads,stars,created_at,uploader_id,publish_group_id,approved";

type Datesheet = {
  id: string;
  branch: string;
  semester: number;
  subject: string;
  exam_date: string;
  exam_time: string | null;
  venue: string | null;
  publish_group_id?: string | null;
  branches?: string[] | null;
};

export default function Browse() {
  const { user } = useAuth();
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
  const [starOverrides, setStarOverrides] = useState<Record<string, boolean>>({});

  const { branches } = useBranches();
  const { subjects } = useSubjects(branch, semester ? Number(semester) : null);
  const paperIds = useMemo(() => papers.map((p) => p.id), [papers]);
  const starredSet = usePaperStars(paperIds, user?.id);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    void supabase
      .from("datesheets")
      .select("id,branch,branches,semester,subject,exam_date,exam_time,venue,publish_group_id")
      .gte("exam_date", today)
      .order("exam_date", { ascending: true })
      .limit(12)
      .then(({ data }) => {
        const list = (data as Datesheet[]) || [];
        const seen = new Set<string>();
        const deduped: Datesheet[] = [];
        for (const d of list) {
          const key = `${d.publish_group_id || d.id}-${d.subject}-${d.exam_date}`;
          if (seen.has(key)) continue;
          seen.add(key);
          deduped.push(d);
          if (deduped.length >= 5) break;
        }
        setUpcoming(deduped);
      });
  }, []);

  useEffect(() => {
    if (!chosenSubject || !branch || !semester) return;
    let cancelled = false;
    setLoading(true);

    (async () => {
      let q = supabase
        .from("papers")
        .select(PAPER_COLS)
        .eq("branch", branch)
        .eq("semester", Number(semester))
        .eq("subject", chosenSubject);

      if (year !== "all") q = q.eq("year", Number(year));
      if (examType !== "all") q = q.eq("exam_type", examType);

      switch (sort) {
        case "views":
          q = q.order("views", { ascending: false });
          break;
        case "downloads":
          q = q.order("downloads", { ascending: false });
          break;
        case "starred":
          q = q.order("stars", { ascending: false });
          break;
        default:
          q = q.order("created_at", { ascending: false });
      }

      const { data } = await q;
      if (cancelled) return;

      const list = ((data as Paper[]) || []).filter((p) => p.approved !== false && p.file_path);
      const byPath = new Map<string, Paper>();
      for (const p of list) {
        const key = p.publish_group_id || p.file_path || p.id;
        if (!byPath.has(key)) byPath.set(key, p);
      }
      setPapers([...byPath.values()]);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [chosenSubject, branch, semester, year, examType, sort]);

  const visibleSubjects = useMemo(
    () => subjects.filter((s) => s.toLowerCase().includes(subjectQuery.toLowerCase())),
    [subjects, subjectQuery]
  );

  const visiblePapers = useMemo(() => {
    if (!search.trim()) return papers;
    const s = search.toLowerCase();
    return papers.filter(
      (p) =>
        p.subject.toLowerCase().includes(s) ||
        (p.title || "").toLowerCase().includes(s) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(s)) ||
        p.uploader_name.toLowerCase().includes(s)
    );
  }, [papers, search]);

  const isStarred = useCallback(
    (id: string) => (id in starOverrides ? starOverrides[id] : starredSet.has(id)),
    [starOverrides, starredSet]
  );

  const handleStarChange = useCallback((paperId: string, starred: boolean) => {
    setStarOverrides((o) => ({ ...o, [paperId]: starred }));
  }, []);

  if (chosenSubject) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{chosenSubject}</h2>
            <p className="text-sm text-muted-foreground">{branch} · Sem {semester}</p>
          </div>
          <Button variant="outline" onClick={() => { setChosenSubject(null); setSubjectsOpen(true); }}>
            Change subject
          </Button>
        </div>

        <RepeatedHighlight branch={branch} semester={semester} subject={chosenSubject} />

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
              <SelectItem value="views">Most viewed</SelectItem>
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
          <EmptyState text="No papers yet for this subject. Be the first to contribute one!" />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {visiblePapers.map((p) => (
              <PaperCard
                key={p.id}
                paper={p}
                onOpen={setOpen}
                starred={isStarred(p.id)}
                onStarChange={handleStarChange}
              />
            ))}
          </div>
        )}

        <Suspense fallback={null}>
          <PaperViewer paper={open} onClose={() => setOpen(null)} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Suspense fallback={null}>
        <AnnouncementBanners />
      </Suspense>
      <HeroSection />

      <section className="grid lg:grid-cols-2 gap-5">
        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold">BTech</h2>
          <p className="text-sm text-muted-foreground mt-1">Who needs sleep when you can engineer dreams?</p>

          <div className="mt-6 space-y-3">
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Semester" /></SelectTrigger>
              <SelectContent>
                {SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>{ordinal(s)}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={branch} onValueChange={setBranch} disabled={!semester}>
              <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Branch" /></SelectTrigger>
              <SelectContent>
                {branches.map((b) => <SelectItem key={b.code} value={b.code}>{b.code}</SelectItem>)}
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

        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" /> Upcoming exams
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Stay aware of what&apos;s around the corner</p>
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
                        <span>{formatDatesheetBranches(d.branch, d.branches)} · Sem {d.semester}</span>
                        {d.exam_time && <span>· {d.exam_time}</span>}
                        {d.venue && <span className="hidden sm:inline-flex items-center gap-1">· <MapPin className="h-3 w-3" />{d.venue}</span>}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-lg border",
                        cd.status === "today" ? "bg-warning/15 text-warning border-warning/30"
                          : cd.days <= 7 ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {cd.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

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
            ) : (
              visibleSubjects.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setChosenSubject(s); setSubjectsOpen(false); }}
                  className="w-full flex items-center justify-between rounded-xl border bg-card hover:bg-accent transition-colors px-4 py-3 text-left"
                >
                  <span className="font-medium">{s}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Suspense fallback={null}>
        <PaperViewer paper={open} onClose={() => setOpen(null)} />
        <BrowseFooter />
      </Suspense>
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
