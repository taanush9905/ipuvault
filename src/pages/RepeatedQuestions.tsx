import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { ArrowLeft, ChevronUp, ChevronDown, Flame, Loader2, Plus, Repeat2, Trash2, Filter, BookOpen, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { BranchMultiPicker } from "@/components/branch-multi-picker";
import { useBranches } from "@/lib/use-branches";
import { HoverButton } from "@/components/ui/hover-button";

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

type Unit = { unit_number: number; unit_name: string };

function heat(n: number) {
  if (n >= 5) return "heat-5";
  if (n === 4) return "heat-4";
  if (n === 3) return "heat-3";
  if (n === 2) return "heat-2";
  return "heat-1";
}

export default function RepeatedQuestions() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const branch = params.get("branch") || "";
  const semester = Number(params.get("semester") || 0);
  const subject = params.get("subject") || "";

  const { user, profile, isAdmin } = useAuth();
  const [items, setItems] = useState<RQ[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [unitFilter, setUnitFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("repeats");
  const [search, setSearch] = useState("");
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [detailTopic, setDetailTopic] = useState<RQ | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: true });

  async function load() {
    setLoading(true);
    const [{ data: rq }, { data: u }] = await Promise.all([
      supabase.from("repeated_questions").select("*")
        .eq("semester", semester).eq("subject", subject),
      supabase.from("subject_units").select("unit_number, unit_name")
        .eq("branch", branch).eq("semester", semester).eq("subject", subject)
        .order("unit_number"),
    ]);
    const list = ((rq as RQ[]) || []).filter(
      (r) => r.branch === branch || (r.branches || []).includes(branch)
    );
    setItems(list);
    setUnits((u as Unit[]) || []);
    if (user) {
      const { data: v } = await supabase.from("repeated_question_votes").select("question_id").eq("user_id", user.id);
      setMyVotes(new Set((v || []).map((x: any) => x.question_id)));
    } else setMyVotes(new Set());
    setLoading(false);
  }

  useEffect(() => {
    if (!branch || !semester || !subject) { navigate("/"); return; }
    void load();
  }, [branch, semester, subject, user?.id]);

  const visible = useMemo(() => {
    let arr = [...items];
    if (unitFilter !== "all") arr = arr.filter((i) => String(i.unit_number ?? "0") === unitFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      arr = arr.filter((i) => i.question.toLowerCase().includes(s) || (i.notes || "").toLowerCase().includes(s));
    }
    if (sort === "repeats") arr.sort((a, b) => (b.years?.length || 0) - (a.years?.length || 0));
    else if (sort === "recent") arr.sort((a, b) => Number(Math.max(...(b.years || [0]))) - Number(Math.max(...(a.years || [0]))));
    else arr.sort((a, b) => b.upvotes - a.upvotes);
    return arr;
  }, [items, unitFilter, search, sort]);

  const stats = useMemo(() => {
    const total = items.length;
    const allYears = new Set<number>();
    let max = 0;
    items.forEach((i) => { (i.years || []).forEach((y) => allYears.add(y)); max = Math.max(max, i.years?.length || 0); });
    return { total, years: allYears.size, hottest: max };
  }, [items]);

  async function vote(q: RQ) {
    if (!user) { toast.error("Sign in to vote"); navigate("/auth"); return; }
    const has = myVotes.has(q.id);
    if (has) {
      await supabase.from("repeated_question_votes").delete().eq("question_id", q.id).eq("user_id", user.id);
      setMyVotes((s) => { const n = new Set(s); n.delete(q.id); return n; });
      setItems((arr) => arr.map((x) => x.id === q.id ? { ...x, upvotes: Math.max(0, x.upvotes - 1) } : x));
    } else {
      const { error } = await supabase.from("repeated_question_votes").insert({ question_id: q.id, user_id: user.id });
      if (error) return toast.error(error.message);
      setMyVotes((s) => new Set(s).add(q.id));
      setItems((arr) => arr.map((x) => x.id === q.id ? { ...x, upvotes: x.upvotes + 1 } : x));
    }
  }

  async function remove(q: RQ) {
    if (!confirm("Delete this topic?")) return;
    const { error } = await supabase.from("repeated_questions").delete().eq("id", q.id);
    if (error) return toast.error(error.message);
    setItems((arr) => arr.filter((x) => x.id !== q.id));
    toast.success("Topic deleted");
  }

  const toggleUnitAccordion = (num: number) => {
    setExpandedUnits((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Subject Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <HoverButton variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </HoverButton>
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
                {branch}
              </Badge>
              <span className="text-xs text-muted-foreground font-semibold">Semester {semester}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2 mt-1 truncate">
              <BookOpen className="h-5 w-5 text-primary shrink-0" /> {subject}
            </h1>
            <p className="text-xs text-muted-foreground">Topic pad — recurring syllabus questions, upvoted by students.</p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <HoverButton variant="primary" className="rounded-xl shrink-0 self-start sm:self-center shadow-soft">
              <Plus className="h-4 w-4" /> Add Topic
            </HoverButton>
          </DialogTrigger>
          <AddDialog
            branch={branch} semester={semester} subject={subject} units={units}
            user={user} contributorName={profile?.display_name || "Anonymous"}
            onSaved={() => { setOpen(false); void load(); }}
          />
        </Dialog>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-panel rounded-2xl p-4 bg-background/50 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Topics</p>
          <p className="text-2xl font-black mt-1 text-foreground">{stats.total}</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 bg-background/50 text-center border-primary/25">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Hottest</p>
          <p className="text-2xl font-black mt-1 text-primary">{stats.hottest}×</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 bg-background/50 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Years Tracked</p>
          <p className="text-2xl font-black mt-1 text-foreground">{stats.years}</p>
        </div>
      </div>

      {/* Admin units manager card */}
      {isAdmin && (
        <div className="glass-panel rounded-2xl p-6">
          <UnitsManager branch={branch} semester={semester} subject={subject} units={units} onChange={load} />
        </div>
      )}

      {/* Search & filters sticky row */}
      <div className="glass-panel rounded-2xl p-3 flex flex-col sm:flex-row gap-2 sticky top-16 z-20 backdrop-blur-lg bg-card/90">
        <Input placeholder="Search syllabus topics..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl h-11 text-xs" />
        <Select value={unitFilter} onValueChange={setUnitFilter}>
          <SelectTrigger className="sm:w-44 rounded-xl h-11 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All units</SelectItem>
            {units.map((u) => (
              <SelectItem key={u.unit_number} value={String(u.unit_number)}>Unit {u.unit_number} — {u.unit_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="sm:w-44 rounded-xl h-11 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="repeats">Most repeated</SelectItem>
            <SelectItem value="recent">Most recent year</SelectItem>
            <SelectItem value="upvoted">Most upvoted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Units accordions list container */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Repeat2 className="h-4 w-4 text-primary" /> Syllabus Accordions
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Syllabus topics cataloged by unit number.</p>

        {loading ? (
          <div className="space-y-3 pt-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-2xl" />)}
          </div>
        ) : units.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card/50 p-12 text-center">
            <Repeat2 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No units configured. Add units as Admin to start the syllabus pad.</p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {units.map((u) => {
              const isExpanded = !!expandedUnits[u.unit_number];
              const unitTopics = visible.filter((t) => t.unit_number === u.unit_number);

              if (unitFilter !== "all" && String(u.unit_number) !== unitFilter) return null;

              return (
                <div key={u.unit_number} className="border border-border/60 bg-background/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm">
                  {/* Accordion trigger */}
                  <button
                    type="button"
                    onClick={() => toggleUnitAccordion(u.unit_number)}
                    className="w-full flex items-center justify-between p-4 bg-muted/10 hover:bg-muted/30 transition-colors text-left"
                  >
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 border border-primary/20 rounded">
                        Unit {u.unit_number}
                      </span>
                      <h4 className="font-bold text-sm text-foreground mt-2 truncate">{u.unit_name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] rounded-lg">
                        {unitTopics.length} topic{unitTopics.length !== 1 && "s"}
                      </Badge>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Accordion body */}
                  {isExpanded && (
                    <div className="p-4 border-t border-border/50 bg-card/10 divide-y divide-border/40 animate-fade-in">
                      {unitTopics.length === 0 ? (
                        <div className="py-6 text-center text-xs text-muted-foreground italic">
                          No topics matched search/filters for this unit.
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
                                    {q.marks && <Badge variant="outline" className="text-[10px] font-semibold">{q.marks} marks</Badge>}
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
                                  <p className="text-[10px] text-muted-foreground">Contributed by {q.contributor_name}</p>
                                </div>

                                <div className="flex items-center gap-2 justify-end">
                                  <button
                                    onClick={() => vote(q)}
                                    className={cn(
                                      "flex items-center gap-1 rounded-xl px-3 py-1.5 border transition-all text-xs font-semibold hover:scale-[1.02]",
                                      voted
                                        ? "bg-primary/10 border-primary/30 text-primary"
                                        : "bg-background hover:bg-secondary text-muted-foreground hover:text-foreground"
                                    )}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                    <span>{q.upvotes}</span>
                                  </button>
                                  <HoverButton variant="outline" size="sm" onClick={() => setDetailTopic(q)} className="h-8 rounded-xl text-xs">
                                    <Eye className="h-3.5 w-3.5" /> View
                                  </HoverButton>
                                  {canDelete && (
                                    <Button variant="ghost" size="icon" onClick={() => remove(q)} className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10">
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
      </div>

      <TopicDetailDialog topic={detailTopic} units={units} onClose={() => setDetailTopic(null)} />
    </div>
  );
}

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
    if (!user) { toast.error("Sign in to contribute"); navigate("/auth"); return; }
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
        <DialogTitle className="text-base font-bold">Add syllabus topic</DialogTitle>
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
            placeholder="e.g. Explain SQL Join operations"
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
            placeholder="e.g. Explain DBMS joins with neat Venn diagrams."
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

function UnitsManager({
  branch, semester, subject, units, onChange,
}: { branch: string; semester: number; subject: string; units: Unit[]; onChange: () => void }) {
  const [num, setNum] = useState("");
  const [nm, setNm] = useState("");
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!num || !nm.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("subject_units").insert({
      branch, semester, subject, unit_number: Number(num), unit_name: nm.trim(),
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setNum(""); setNm(""); onChange();
  }
  async function del(unit_number: number) {
    const { error } = await supabase.from("subject_units").delete()
      .eq("branch", branch).eq("semester", semester).eq("subject", subject).eq("unit_number", unit_number);
    if (error) return toast.error(error.message);
    onChange();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">Admin Config</Badge>
        <h3 className="font-extrabold text-sm text-foreground">Configure syllabus units</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {units.map((u) => (
          <Badge key={u.unit_number} variant="secondary" className="gap-1.5 pl-2.5 py-1 text-[11px] rounded-lg">
            Unit {u.unit_number}: {u.unit_name}
            <button onClick={() => del(u.unit_number)} className="ml-1 hover:text-destructive transition-colors"><Trash2 className="h-3 w-3" /></button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
        <Input className="w-20 rounded-xl h-10 text-xs" placeholder="Unit #" type="number" value={num} onChange={(e) => setNum(e.target.value)} />
        <Input placeholder="Unit name (e.g. Relational Query Languages)" value={nm} onChange={(e) => setNm(e.target.value)} className="rounded-xl h-10 text-xs" />
        <Button onClick={add} disabled={busy} variant="outline" className="rounded-xl h-10 text-xs font-semibold px-4">Add Unit</Button>
      </div>
    </div>
  );
}
