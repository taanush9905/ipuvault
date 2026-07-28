import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { EXAM_TYPES, SEMESTERS, YEARS, BRANCHES } from "@/lib/constants";
import { useBranches } from "@/lib/use-branches";
import { usePaperStars } from "@/lib/use-paper-stars";
import { HeroSection } from "@/components/hero-section";
import { StatsBar } from "@/components/stats-bar";
import { FeatureCards } from "@/components/feature-cards";
import { RepeatedHighlight } from "@/components/repeated-highlight";
import { useSubjects } from "@/lib/use-subjects";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PaperCard, type Paper } from "@/components/paper-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BranchMultiPicker } from "@/components/branch-multi-picker";
import { FeedbackForm } from "@/components/feedback-form";
import { ContactSection } from "@/components/about-section";
import { HoverButton } from "@/components/ui/hover-button";
import { HoverLink } from "@/components/ui/hover-link";
import { motion } from "framer-motion";
import {
  Search,
  Inbox,
  ChevronRight,
  CalendarDays,
  MapPin,
  ChevronDown,
  ChevronUp,
  Flame,
  Plus,
  ArrowLeft,
  BookOpen,
  Eye,
  Trash2,
  Bookmark,
  Share2,
  FileText,
  BarChart3,
  CloudUpload
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { countdown } from "@/lib/format";
import { cn } from "@/lib/utils";
import { formatDatesheetBranches } from "@/lib/datesheet-label";
import { toast } from "sonner";

const PaperViewer = lazy(() => import("@/components/paper-viewer").then((m) => ({ default: m.PaperViewer })));
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

type Unit = { unit_number: number; unit_name: string };

type RQ = {
  id: string;
  branch: string;
  branches?: string[] | null;
  semester: number;
  subject: string;
  unit_number: number | null;
  question: string;
  years: number[];
  marks: number | null;
  notes: string | null;
  contributor_id: string | null;
  contributor_name: string;
  upvotes: number;
  created_at: string;
};

function heat(n: number) {
  if (n >= 5) return "heat-5";
  if (n === 4) return "heat-4";
  if (n === 3) return "heat-3";
  if (n === 2) return "heat-2";
  return "heat-1";
}

export default function Browse() {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL-driven states
  const semester = searchParams.get("semester") || "";
  const branch = searchParams.get("branch") || "";
  const chosenSubject = searchParams.get("subject") || null;

  // Local state managers
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [subjectQuery, setSubjectQuery] = useState("");
  const [year, setYear] = useState<string>("all");
  const [examType, setExamType] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");
  const [search, setSearch] = useState("");

  // API and Details state
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [upcoming, setUpcoming] = useState<Datesheet[]>([]);
  const [open, setOpen] = useState<Paper | null>(null);
  const [starOverrides, setStarOverrides] = useState<Record<string, boolean>>({});

  // Subject details states (units & repeated questions)
  const [units, setUnits] = useState<Unit[]>([]);
  const [repeatedQuestions, setRepeatedQuestions] = useState<RQ[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState<Record<number, boolean>>({ 1: true });
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [addTopicOpen, setAddTopicOpen] = useState(false);
  const [detailTopic, setDetailTopic] = useState<RQ | null>(null);

  const { branches } = useBranches();
  const { subjects } = useSubjects(branch, semester ? Number(semester) : null);
  const paperIds = useMemo(() => papers.map((p) => p.id), [papers]);
  const starredSet = usePaperStars(paperIds, user?.id);

  // Set updates via searchParams
  const setSemester = (val: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) next.set("semester", val);
      else next.delete("semester");
      next.delete("subject");
      return next;
    });
  };

  const setBranch = (val: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) next.set("branch", val);
      else next.delete("branch");
      next.delete("subject");
      return next;
    });
  };

  const setChosenSubject = (val: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) next.set("subject", val);
      else next.delete("subject");
      return next;
    });
  };

  // Fetch upcoming exams
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

  // Fetch papers when subject is chosen
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

  // Fetch subject details: units, repeated questions, and user votes
  const loadSubjectDetails = useCallback(async () => {
    if (!chosenSubject || !branch || !semester) return;
    setLoadingDetails(true);

    const [{ data: rq }, { data: u }] = await Promise.all([
      supabase.from("repeated_questions").select("*")
        .eq("semester", Number(semester)).eq("subject", chosenSubject),
      supabase.from("subject_units").select("unit_number, unit_name")
        .eq("branch", branch).eq("semester", Number(semester)).eq("subject", chosenSubject)
        .order("unit_number"),
    ]);

    const list = ((rq as RQ[]) || []).filter(
      (r) => r.branch === branch || (r.branches || []).includes(branch)
    );
    setRepeatedQuestions(list);
    setUnits((u as Unit[]) || []);

    if (user) {
      const { data: v } = await supabase.from("repeated_question_votes").select("question_id").eq("user_id", user.id);
      setMyVotes(new Set((v || []).map((x: any) => x.question_id)));
    } else setMyVotes(new Set());

    setLoadingDetails(false);
  }, [chosenSubject, branch, semester, user]);

  useEffect(() => {
    void loadSubjectDetails();
  }, [loadSubjectDetails]);

  // Upvote repeated question handler
  const handleVote = async (q: RQ) => {
    if (!user) {
      toast.error("Sign in to upvote topics");
      navigate("/auth");
      return;
    }
    const hasVoted = myVotes.has(q.id);
    if (hasVoted) {
      const { error } = await supabase.from("repeated_question_votes").delete().eq("question_id", q.id).eq("user_id", user.id);
      if (error) return toast.error(error.message);
      setMyVotes((s) => {
        const n = new Set(s);
        n.delete(q.id);
        return n;
      });
      setRepeatedQuestions((prev) =>
        prev.map((x) => (x.id === q.id ? { ...x, upvotes: Math.max(0, x.upvotes - 1) } : x))
      );
    } else {
      const { error } = await supabase.from("repeated_question_votes").insert({ question_id: q.id, user_id: user.id });
      if (error) return toast.error(error.message);
      setMyVotes((s) => new Set(s).add(q.id));
      setRepeatedQuestions((prev) =>
        prev.map((x) => (x.id === q.id ? { ...x, upvotes: x.upvotes + 1 } : x))
      );
    }
  };

  // Remove topic handler (admin or contributor)
  const handleRemoveTopic = async (q: RQ) => {
    if (!confirm("Delete this topic?")) return;
    const { error } = await supabase.from("repeated_questions").delete().eq("id", q.id);
    if (error) return toast.error(error.message);
    setRepeatedQuestions((prev) => prev.filter((x) => x.id !== q.id));
    toast.success("Topic deleted");
  };

  // Filter papers based on search query
  const filteredPapers = useMemo(() => {
    let list = [...papers];

    // Search filter
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.subject.toLowerCase().includes(s) ||
          (p.title || "").toLowerCase().includes(s) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(s)) ||
          p.uploader_name.toLowerCase().includes(s)
      );
    }
    return list;
  }, [papers, search]);

  const visibleSubjects = useMemo(
    () => subjects.filter((s) => s.toLowerCase().includes(subjectQuery.toLowerCase())),
    [subjects, subjectQuery]
  );

  const isStarred = useCallback(
    (id: string) => (id in starOverrides ? starOverrides[id] : starredSet.has(id)),
    [starOverrides, starredSet]
  );

  const handleStarChange = useCallback((paperId: string, starred: boolean) => {
    setStarOverrides((o) => ({ ...o, [paperId]: starred }));
  }, []);

  const toggleUnitAccordion = (num: number) => {
    setExpandedUnits((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  // SUBJECT PAGE VIEW (Dashboard Overhaul)
  if (chosenSubject) {
    const totalViews = papers.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalDownloads = papers.reduce((acc, curr) => acc + curr.downloads, 0);

    return (
      <div className="space-y-6">
        
        {/* 1. Subject Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
                {branch}
              </Badge>
              <span className="text-xs text-muted-foreground font-semibold">Semester {semester}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {chosenSubject}
            </h2>
            <p className="text-xs text-muted-foreground">
              Dashboard catalog containing previous year question papers and syllabus guidelines.
            </p>
          </div>
          
          <HoverButton
            variant="outline"
            onClick={() => {
              setChosenSubject(null);
              setSubjectsOpen(true);
            }}
            className="rounded-xl shrink-0 self-start sm:self-center bg-card/60"
          >
            <ArrowLeft className="h-4 w-4" /> Change Subject
          </HoverButton>
        </motion.div>

        {/* 2. Previous Year Question Papers (PYQs) Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-panel rounded-3xl p-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold flex items-center gap-2 tracking-tight">
                <FileText className="h-5 w-5 text-primary" /> Previous Year Question Papers (PYQs)
              </h3>
              <p className="text-xs text-muted-foreground">
                Browse semester-wise and subject-wise PYQs for your branch.
              </p>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/80" />
                <Input
                  placeholder="Search PYQs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10 rounded-xl text-xs"
                />
              </div>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-full sm:w-28 h-10 rounded-xl text-xs bg-card"><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All years</SelectItem>
                  {YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full sm:w-36 h-10 rounded-xl text-xs bg-card"><SelectValue placeholder="Sort" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="views">Views</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                  <SelectItem value="starred">Starred</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
            </div>
          ) : filteredPapers.length === 0 ? (
            <EmptyState text="No PYQ papers found yet. Feel free to contribute or check back later!" />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredPapers.map((p) => (
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
        </motion.div>

        {/* 3. Units & Syllabus Accordion Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel rounded-3xl p-6 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold flex items-center gap-2 tracking-tight">
                <Bookmark className="h-4 w-4 text-primary" /> Units & Repeated Topics
              </h3>
              <p className="text-xs text-muted-foreground">
                Accordion syllabus cards tracking the most repeated examination questions.
              </p>
            </div>
            {isAdmin && (
              <HoverLink to={`/repeated?branch=${branch}&semester=${semester}&subject=${encodeURIComponent(chosenSubject)}`} variant="outline" size="sm" className="rounded-xl">
                Manage Syllabus Units
              </HoverLink>
            )}
          </div>

          {loadingDetails ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl animate-pulse" />)}
            </div>
          ) : units.length === 0 ? (
            <div className="text-center py-10 border border-dashed rounded-2xl bg-muted/20">
              <Inbox className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
              <p className="text-xs text-muted-foreground">Syllabus units not configured yet. Add them to configure accordions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {units.map((u) => {
                const isExpanded = !!expandedUnits[u.unit_number];
                const unitTopics = repeatedQuestions.filter((t) => t.unit_number === u.unit_number);

                return (
                  <div
                    key={u.unit_number}
                    className="border border-border/60 bg-background/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                  >
                    {/* Accordion Trigger Header */}
                    <button
                      type="button"
                      onClick={() => toggleUnitAccordion(u.unit_number)}
                      className="w-full flex items-center justify-between p-4 bg-muted/10 hover:bg-muted/30 transition-colors text-left"
                    >
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 border border-primary/20 rounded">
                          Unit {u.unit_number}
                        </span>
                        <h4 className="font-bold text-sm text-foreground mt-2 truncate">
                          {u.unit_name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] rounded-lg">
                          {unitTopics.length} topic{unitTopics.length !== 1 && "s"}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Accordion Expandable Content */}
                    {isExpanded && (
                      <div className="p-4 border-t border-border/50 bg-card/10 divide-y divide-border/40 animate-fade-in">
                        {unitTopics.length === 0 ? (
                          <div className="py-6 text-center text-xs text-muted-foreground italic">
                            No high-frequency questions tracked for this unit yet.
                          </div>
                        ) : (
                          <ul className="divide-y divide-border/45">
                            {unitTopics.map((q) => {
                              const reps = q.years?.length || 0;
                              const voted = myVotes.has(q.id);
                              const canDelete = isAdmin || (user && q.contributor_id === user.id);

                              return (
                                <li key={q.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {q.marks && (
                                        <Badge variant="outline" className="text-[10px] font-semibold">
                                          {q.marks} marks
                                        </Badge>
                                      )}
                                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold", heat(reps))}>
                                        {reps >= 4 && <Flame className="h-3 w-3" />}
                                        {reps}× repeated
                                      </span>
                                    </div>
                                    
                                    <button
                                      type="button"
                                      onClick={() => setDetailTopic(q)}
                                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors text-left leading-snug block w-full truncate"
                                    >
                                      {q.question}
                                    </button>
                                    <p className="text-[10px] text-muted-foreground">
                                      By {q.contributor_name}
                                    </p>
                                  </div>

                                  {/* Right side voting and detail triggers */}
                                  <div className="flex items-center gap-2 justify-end">
                                    <button
                                      onClick={() => handleVote(q)}
                                      className={cn(
                                        "flex items-center gap-1 rounded-xl px-3 py-1.5 border transition-all text-xs font-semibold hover:scale-[1.02]",
                                        voted
                                          ? "bg-primary/10 border-primary/30 text-primary"
                                          : "bg-background hover:bg-secondary text-muted-foreground hover:text-foreground"
                                      )}
                                      title="Upvote topic"
                                    >
                                      <ChevronUp className="h-4 w-4" />
                                      <span>{q.upvotes}</span>
                                    </button>
                                    <HoverButton
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setDetailTopic(q)}
                                      className="h-8 rounded-xl text-xs"
                                    >
                                      <Eye className="h-3.5 w-3.5" /> View
                                    </HoverButton>
                                    {canDelete && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveTopic(q)}
                                        className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* 4. Subject Information Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden bg-gradient-to-tr from-card to-primary/5"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" /> Subject Information & Stats
              </h3>
              <p className="text-sm text-muted-foreground max-w-xl">
                Review aggregated statistics for {chosenSubject} PYQs. Help keep materials up-to-date by submitting question papers.
              </p>
            </div>
            
            {/* Call to actions */}
            <div className="flex flex-wrap gap-3">
              <HoverButton
                onClick={() => setAddTopicOpen(true)}
                variant="outline"
                className="rounded-xl bg-card/50"
              >
                <Plus className="h-4 w-4" /> Add Syllabus Topic
              </HoverButton>
              <HoverLink
                to={isAdmin ? "/upload" : "/contribute"}
                variant="primary"
                className="rounded-xl"
              >
                <CloudUpload className="h-4 w-4" /> Submit PYQ PDF
              </HoverLink>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/40">
            <div className="bg-background/40 border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground font-semibold">Total PYQs</p>
              <p className="text-2xl font-black mt-1 text-foreground">{papers.length}</p>
            </div>
            <div className="bg-background/40 border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground font-semibold">Views</p>
              <p className="text-2xl font-black mt-1 text-foreground">{totalViews}</p>
            </div>
            <div className="bg-background/40 border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground font-semibold">Downloads</p>
              <p className="text-2xl font-black mt-1 text-foreground">{totalDownloads}</p>
            </div>
            <div className="bg-background/40 border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground font-semibold">Repeated Topics</p>
              <p className="text-2xl font-black mt-1 text-foreground">{repeatedQuestions.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Paper dialog triggers */}
        <Suspense fallback={null}>
          <PaperViewer paper={open} onClose={() => setOpen(null)} />
        </Suspense>

        {/* Repeated topic details and create dialogs */}
        <TopicDetailDialog topic={detailTopic} units={units} onClose={() => setDetailTopic(null)} />
        
        <Dialog open={addTopicOpen} onOpenChange={setAddTopicOpen}>
          <AddDialog
            branch={branch}
            semester={Number(semester)}
            subject={chosenSubject}
            units={units}
            user={user}
            contributorName={profile?.display_name || "Anonymous"}
            onSaved={() => {
              setAddTopicOpen(false);
              void loadSubjectDetails();
            }}
          />
        </Dialog>
      </div>
    );
  }

  // DEFAULT BROWSE LANDING VIEW (Container cards consistency redesign)
  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      
      {/* Notifications Announcement banner */}
      <Suspense fallback={null}>
        <AnnouncementBanners />
      </Suspense>

      {/* Hero Section */}
      <HeroSection />

      {/* Floating Statistics Bar */}
      <StatsBar />

      {/* Feature Cards Grid */}
      <FeatureCards />

      {/* Main Catalog selectors & Upcoming list Cards */}
      <motion.section 
        id="catalog-finder" 
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="grid lg:grid-cols-2 gap-6 items-start scroll-mt-24"
      >
        
        {/* Semester / Branch selection container card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              BTech PYQ Finder
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Select your academic semester and branch code to unlock exam PYQs.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Select Semester
              </label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="h-12 rounded-2xl text-xs bg-[#0B1220] border-white/10 text-white focus:ring-primary"><SelectValue placeholder="Semester" /></SelectTrigger>
                <SelectContent className="bg-[#0B1220] border-white/10 text-white">
                  {SEMESTERS.map((s) => <SelectItem key={s} value={String(s)} className="focus:bg-primary/20 focus:text-white">{ordinal(s)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Select Branch Code
              </label>
              <Select value={branch} onValueChange={setBranch} disabled={!semester}>
                <SelectTrigger className="h-12 rounded-2xl text-xs bg-[#0B1220] border-white/10 text-white focus:ring-primary"><SelectValue placeholder="Branch" /></SelectTrigger>
                <SelectContent className="bg-[#0B1220] border-white/10 text-white">
                  {branches.map((b) => <SelectItem key={b.code} value={b.code} className="focus:bg-primary/20 focus:text-white">{b.code}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <HoverButton
              className="w-full h-12 rounded-2xl text-xs font-semibold shadow-soft"
              disabled={!semester || !branch}
              onClick={() => {
                setSubjectQuery("");
                setSubjectsOpen(true);
              }}
            >
              View Subjects <ChevronRight className="h-4 w-4 ml-1" />
            </HoverButton>
          </div>
        </div>

        {/* Datesheets & Upcoming examination schedule card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2 tracking-tight text-white">
                <CalendarDays className="h-5 w-5 text-primary shrink-0 animate-pulse" /> Upcoming exams
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Countdown timer synced with official date sheets.</p>
            </div>
            <HoverLink to="/datesheet" variant="outline" size="sm" className="rounded-xl text-xs bg-white/5 border-white/10 text-white">
              View All
            </HoverLink>
          </div>

          {upcoming.length === 0 ? (
            <div className="text-xs text-muted-foreground py-10 text-center border border-dashed rounded-2xl border-white/10 bg-white/5">
              No upcoming exams posted yet.
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {upcoming.map((d) => {
                const cd = countdown(d.exam_date);
                return (
                  <li key={d.id} className="py-3 flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 px-2 py-1.5 text-center min-w-[54px] bg-white/5 shadow-xs">
                      <div className="text-base font-black leading-none text-white">{new Date(d.exam_date).getDate()}</div>
                      <div className="text-[9px] uppercase tracking-wide font-semibold text-muted-foreground mt-0.5">
                        {new Date(d.exam_date).toLocaleString("en-US", { month: "short" })}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate text-white">{d.subject}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{formatDatesheetBranches(d.branch, d.branches)} · Sem {d.semester}</span>
                        {d.exam_time && <span>· {d.exam_time}</span>}
                        {d.venue && <span className="hidden sm:inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" />{d.venue}</span>}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-lg border",
                        cd.status === "today" ? "bg-warning/15 text-warning border-warning/30"
                          : cd.days <= 7 ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-white/5 text-muted-foreground border-white/10"
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
      </motion.section>

      {/* SECTION 1: Anonymous Feedback — compact card */}
      <motion.section 
        id="feedback" 
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full flex justify-center"
      >
        <div className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-5 relative overflow-hidden"
          style={{ 
            background: "rgba(11, 18, 32, 0.35)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 12px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)"
          }}
        >
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 h-40 w-40 bg-primary/8 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="space-y-1 relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Anonymous Feedback</p>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1 text-white">Send us your thoughts</h2>
            <p className="text-xs text-muted-foreground">Share recommendations, suggest features, or report issues. No registration required.</p>
          </div>
          <FeedbackForm id="home-feedback" className="pt-1" />
        </div>
      </motion.section>

      {/* SECTION 2: Contact Us — compact card */}
      <motion.section 
        id="contact" 
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
        transition={{ duration: 0.8, delay: 0.1 }}
        viewport={{ once: true }}
        className="w-full flex justify-center"
      >
        <div className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-5 relative overflow-hidden"
          style={{ 
            background: "rgba(11, 18, 32, 0.3)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)"
          }}
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Contact Us</p>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1 text-white">Get In Touch</h2>
            <p className="text-xs text-muted-foreground">Have suggestions or want to connect with our team?</p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            {/* LinkedIn Action Card */}
            <a 
              href="https://www.linkedin.com/in/taanush9905" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <motion.div 
                whileHover={{ y: -6, scale: 1.01 }}
                className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 cursor-pointer"
                style={{ 
                  background: "rgba(11, 18, 32, 0.4)",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)"
                }}
              >
                <div className="h-12 w-12 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center" style={{ boxShadow: "0 4px 16px rgba(10,102,194,0.3)" }}>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">LinkedIn</p>
                  <p className="text-xs text-muted-foreground">Connect with Founders & Maintainers</p>
                </div>
              </motion.div>
            </a>

            {/* Email Action Card */}
            <a 
              href="mailto:taanush09905@gmail.com"
              className="group"
            >
              <motion.div 
                whileHover={{ y: -6, scale: 1.01 }}
                className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 cursor-pointer"
                style={{ 
                  background: "rgba(11, 18, 32, 0.4)",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)"
                }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center" style={{ boxShadow: "0 4px 16px rgba(244,197,66,0.2)" }}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">Email Support</p>
                  <p className="text-xs text-muted-foreground">taanush09905@gmail.com</p>
                </div>
              </motion.div>
            </a>
          </div>
        </div>
      </motion.section>

      {/* Subject Choose Dialog */}
      <Dialog open={subjectsOpen} onOpenChange={setSubjectsOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl border shadow-elegant bg-card/95 backdrop-blur-md">
          <DialogHeader className="p-5 border-b bg-muted/20">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" /> Choose subject
            </DialogTitle>
            <p className="text-[11px] text-muted-foreground">
              Select a subject configured for {branch} · Semester {semester || "—"} to view PYQ papers.
            </p>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                autoFocus
                value={subjectQuery}
                onChange={(e) => setSubjectQuery(e.target.value)}
                placeholder="Search subject lists..."
                className="pl-9 h-11 rounded-2xl border-border bg-background"
              />
            </div>
            
            <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
              {visibleSubjects.length === 0 ? (
                <EmptyState text="No subjects configured for this branch + semester yet." />
              ) : (
                visibleSubjects.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setChosenSubject(s);
                      setSubjectsOpen(false);
                    }}
                    className="w-full flex items-center justify-between rounded-2xl border bg-background hover:bg-accent/40 hover:border-primary/20 transition-all duration-200 px-4 py-3 text-left group"
                  >
                    <span className="font-semibold text-sm group-hover:text-primary transition-colors">{s}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
    <div className="rounded-2xl border border-dashed bg-card/50 p-10 text-center">
      <div className="mx-auto h-11 w-11 rounded-xl bg-accent text-accent-foreground grid place-items-center mb-3">
        <Inbox className="h-5 w-5" />
      </div>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">{text}</p>
    </div>
  );
}

// Topic detail view popup
function TopicDetailDialog({
  topic,
  units,
  onClose,
}: {
  topic: RQ | null;
  units: Unit[];
  onClose: () => void;
}) {
  if (!topic) return null;
  const unitName = units.find((u) => u.unit_number === topic.unit_number)?.unit_name;
  const sortedYears = [...(topic.years || [])].sort((a, b) => b - a);

  return (
    <Dialog open={!!topic} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border shadow-elegant bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-left pr-8 text-lg font-bold">{topic.question}</DialogTitle>
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {topic.unit_number != null && (
              <Badge variant="secondary" className="text-[10px] rounded-lg">
                Unit {topic.unit_number}{unitName ? ` · ${unitName}` : ""}
              </Badge>
            )}
            {topic.marks && <Badge variant="outline" className="text-[10px] rounded-lg">{topic.marks} marks</Badge>}
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              Appearances (Previous years)
            </h4>
            {sortedYears.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No appearances recorded yet.</p>
            ) : (
              <ul className="space-y-2">
                {sortedYears.map((y, i) => (
                  <li key={y} className="flex items-start gap-3 rounded-2xl border bg-muted/20 px-3.5 py-3">
                    <span className="text-xs font-bold text-primary shrink-0 bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center">Q{i + 1}</span>
                    <div>
                      <span className="font-bold text-sm text-foreground">{y}</span>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{topic.question}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {topic.notes && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Notes & Syllabus Description
              </h4>
              <div className="rounded-2xl border bg-accent/15 p-4 text-xs whitespace-pre-wrap leading-relaxed text-foreground">
                {topic.notes}
              </div>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground">Contributed by {topic.contributor_name}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Add Topic dialog form
function AddDialog({
  branch, semester, subject, units, user, contributorName, onSaved,
}: {
  branch: string; semester: number; subject: string; units: Unit[];
  user: any; contributorName: string; onSaved: () => void;
}) {
  const navigate = useNavigate();
  const { branches: branchOptions } = useBranches();
  const [selectedBranches, setSelectedBranches] = useState<string[]>([branch]);
  const [question, setQuestion] = useState("");
  const [unit, setUnit] = useState<string>("");
  const [marks, setMarks] = useState("");
  const [years, setYears] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to contribute");
      navigate("/auth");
      return;
    }
    if (!question.trim()) return toast.error("Enter the topic / question");
    if (!selectedBranches.length) return toast.error("Select at least one branch");
    
    setBusy(true);
    const yrs = years.split(",").map((y) => Number(y.trim())).filter((n) => !isNaN(n) && n > 1900);
    const primary = selectedBranches[0];
    
    const { error } = await supabase.from("repeated_questions").insert({
      branch: primary,
      branches: selectedBranches,
      semester,
      subject,
      unit_number: unit ? Number(unit) : null,
      question: question.trim(),
      marks: marks ? Number(marks) : null,
      years: yrs,
      notes: notes.trim() || null,
      contributor_id: user.id,
      contributor_name: contributorName,
    });
    
    setBusy(false);
    if (error) {
      return toast.error(error.message.includes("branches") ? "Run setup-premium.sql for multi-branch topics" : error.message);
    }
    
    toast.success(
      selectedBranches.length > 1
        ? `Topic added across ${selectedBranches.length} branches`
        : "Topic added successfully"
    );
    onSaved();
  }

  return (
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border shadow-elegant bg-card/95 backdrop-blur-md">
      <DialogHeader>
        <DialogTitle className="text-base font-bold">Add dynamic topic</DialogTitle>
      </DialogHeader>
      <form onSubmit={save} className="space-y-4 mt-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Branches (multi-select)</Label>
          <BranchMultiPicker branches={branchOptions} selected={selectedBranches} onChange={setSelectedBranches} />
        </div>
        
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topic / Question text</Label>
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder="e.g. Explain SQL Join operations (Inner, Left, Right)"
            className="rounded-2xl text-xs"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="h-10 rounded-xl text-xs"><SelectValue placeholder={units.length ? "Select unit" : "None"} /></SelectTrigger>
              <SelectContent>
                {units.map((u) => (
                  <SelectItem key={u.unit_number} value={String(u.unit_number)}>
                    Unit {u.unit_number} — {u.unit_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Marks (optional)</Label>
            <Input
              type="number"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              placeholder="e.g. 10"
              className="rounded-xl text-xs h-10"
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Years it appeared (comma separated)</Label>
          <Input
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="2021, 2023, 2024"
            className="rounded-xl text-xs h-10"
          />
        </div>
        
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details (PYQs, explanations, subquestions)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder={"e.g.:\n- Often asked as a 10 marks question.\n- Explain DBMS joins with neat Venn diagrams."}
            className="rounded-2xl text-xs"
          />
        </div>
        
        <Button type="submit" disabled={busy} className="w-full h-11 rounded-2xl text-xs font-semibold mt-2 shadow-soft">
          {busy ? "Saving topic..." : "Submit Topic"}
        </Button>
      </form>
    </DialogContent>
  );
}
