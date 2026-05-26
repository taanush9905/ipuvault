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
import { ArrowLeft, ChevronUp, Flame, Loader2, Plus, Repeat2, Trash2, Filter, BookOpen, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type RQ = {
  id: string;
  branch: string;
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
  const nav = useNavigate();
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

  async function load() {
    setLoading(true);
    const [{ data: rq }, { data: u }] = await Promise.all([
      supabase.from("repeated_questions").select("*")
        .eq("branch", branch).eq("semester", semester).eq("subject", subject),
      supabase.from("subject_units").select("unit_number, unit_name")
        .eq("branch", branch).eq("semester", semester).eq("subject", subject)
        .order("unit_number"),
    ]);
    setItems((rq as RQ[]) || []);
    setUnits((u as Unit[]) || []);
    if (user) {
      const { data: v } = await supabase.from("repeated_question_votes").select("question_id").eq("user_id", user.id);
      setMyVotes(new Set((v || []).map((x: any) => x.question_id)));
    } else setMyVotes(new Set());
    setLoading(false);
  }

  useEffect(() => {
    if (!branch || !semester || !subject) { nav("/"); return; }
    load();
    // eslint-disable-next-line
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
    if (!user) { toast.error("Sign in to vote"); nav("/auth"); return; }
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Hero */}
      <div className="rounded-3xl gradient-mesh border p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" onClick={() => nav(-1)} className="rounded-full"><ArrowLeft className="h-4 w-4" /></Button>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{branch} · Sem {semester}</div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mt-1">
              <BookOpen className="h-6 w-6 text-primary shrink-0" />
              <span className="truncate">{subject}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Topic pad · which questions keep coming back, year after year.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full shadow-soft"><Plus className="h-4 w-4 mr-1" />Add topic</Button>
            </DialogTrigger>
            <AddDialog
              branch={branch} semester={semester} subject={subject} units={units}
              user={user} contributorName={profile?.display_name || "Anonymous"}
              onSaved={() => { setOpen(false); load(); }}
            />
          </Dialog>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6">
          <Stat icon={<Repeat2 className="h-4 w-4" />} label="Topics" value={stats.total} />
          <Stat icon={<Flame className="h-4 w-4" />} label="Hottest" value={`${stats.hottest}×`} highlight />
          <Stat icon={<Filter className="h-4 w-4" />} label="Years tracked" value={stats.years} />
        </div>
      </div>

      {isAdmin && (
        <div className="rounded-2xl border bg-card p-4 animate-pop">
          <UnitsManager branch={branch} semester={semester} subject={subject} units={units} onChange={load} />
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border bg-card p-3 flex flex-col sm:flex-row gap-2 sticky top-16 z-20 backdrop-blur-lg bg-card/90">
        <Input placeholder="Search topics…" value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl" />
        <Select value={unitFilter} onValueChange={setUnitFilter}>
          <SelectTrigger className="sm:w-44 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All units</SelectItem>
            {units.map((u) => (
              <SelectItem key={u.unit_number} value={String(u.unit_number)}>Unit {u.unit_number} — {u.unit_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="sm:w-44 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="repeats">Most repeated</SelectItem>
            <SelectItem value="recent">Most recent year</SelectItem>
            <SelectItem value="upvoted">Most upvoted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pad */}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
          <Repeat2 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No topics yet. Tap <b>Add topic</b> to start the pad.</p>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card overflow-hidden shadow-soft">
          {/* Table head */}
          <div className="hidden md:grid grid-cols-[1fr_220px_110px_60px_120px_56px] gap-3 px-4 py-3 border-b bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            <div>Topic</div><div>Years it came</div><div className="text-center">Repeats</div><div className="text-center">Votes</div><div className="text-center">Details</div><div></div>
          </div>
          <ul className="divide-y">
            {visible.map((q, idx) => {
              const unitName = units.find((u) => u.unit_number === q.unit_number)?.unit_name;
              const voted = myVotes.has(q.id);
              const canDelete = isAdmin || (user && q.contributor_id === user.id);
              const reps = q.years?.length || 0;
              return (
                <li
                  key={q.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_220px_110px_60px_120px_56px] gap-3 px-4 py-4 hover:bg-accent/30 transition-colors"
                  style={{ animation: "pop .35s ease-out", animationDelay: `${idx * 25}ms` }}
                >
                  {/* topic */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {q.unit_number && <Badge variant="secondary" className="text-[10px]">U{q.unit_number}{unitName && ` · ${unitName}`}</Badge>}
                      {q.marks && <Badge variant="outline" className="text-[10px]">{q.marks} marks</Badge>}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDetailTopic(q)}
                      className="text-sm font-medium leading-snug whitespace-pre-wrap text-left hover:text-primary transition-colors"
                    >
                      {q.question}
                    </button>
                    {q.notes && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{q.notes}</p>}
                    <div className="text-[11px] text-muted-foreground mt-1.5">By {q.contributor_name}</div>
                  </div>
                  {/* years */}
                  <div className="flex flex-wrap gap-1 items-start content-start">
                    {q.years?.length ? [...q.years].sort((a, b) => b - a).map((y) => (
                      <span key={y} className="text-[11px] font-medium px-1.5 py-0.5 rounded-md border bg-muted">{y}</span>
                    )) : <span className="text-[11px] text-muted-foreground italic">—</span>}
                  </div>
                  {/* repeats */}
                  <div className="md:flex items-center justify-center hidden">
                    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold", heat(reps))}>
                      {reps >= 4 && <Flame className="h-3 w-3" />}
                      {reps}×
                    </span>
                  </div>
                  {/* votes */}
                  <div className="md:flex items-center justify-center hidden">
                    <button
                      onClick={() => vote(q)}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-lg px-2 py-1 min-w-[44px] border transition-all hover:scale-105",
                        voted ? "bg-primary/10 border-primary/30 text-primary" : "hover:bg-secondary"
                      )}
                      aria-label="Upvote"
                    >
                      <ChevronUp className="h-4 w-4" />
                      <span className="text-xs font-semibold">{q.upvotes}</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-end md:justify-center">
                    <Button variant="outline" size="sm" className="rounded-lg text-xs gap-1" onClick={() => setDetailTopic(q)}>
                      <Eye className="h-3.5 w-3.5" /> View questions
                    </Button>
                  </div>
                  {/* delete */}
                  <div className="flex md:items-center md:justify-center justify-end gap-2">
                    <span className={cn("md:hidden inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold", heat(reps))}>
                      {reps}× repeats
                    </span>
                    {canDelete && (
                      <Button variant="ghost" size="icon" onClick={() => remove(q)} aria-label="Delete" className="rounded-full">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

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
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left pr-8">{topic.question}</DialogTitle>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {topic.unit_number != null && (
              <Badge variant="secondary" className="text-[10px]">
                Unit {topic.unit_number}{unitName ? ` · ${unitName}` : ""}
              </Badge>
            )}
            {topic.marks && <Badge variant="outline" className="text-[10px]">{topic.marks} marks</Badge>}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Previous year appearances
            </h4>
            {sortedYears.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No years recorded yet.</p>
            ) : (
              <ul className="space-y-2">
                {sortedYears.map((y, i) => (
                  <li key={y} className="flex items-start gap-3 rounded-xl border bg-muted/40 px-3 py-2.5">
                    <span className="text-xs font-bold text-primary shrink-0">Q{i + 1}</span>
                    <div>
                      <span className="font-semibold text-sm">{y}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{topic.question}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {topic.notes && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Notes & PYQ details
              </h4>
              <div className="rounded-xl border bg-accent/30 p-4 text-sm whitespace-pre-wrap leading-relaxed">
                {topic.notes}
              </div>
            </div>
          )}

          <p className="text-[11px] text-muted-foreground">Contributed by {topic.contributor_name}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl border p-3 backdrop-blur bg-background/60",
      highlight && "border-primary/30 bg-primary/5"
    )}>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">{icon}{label}</div>
      <div className={cn("text-2xl font-bold mt-0.5", highlight && "text-primary")}>{value}</div>
    </div>
  );
}

function AddDialog({
  branch, semester, subject, units, user, contributorName, onSaved,
}: {
  branch: string; semester: number; subject: string; units: Unit[];
  user: any; contributorName: string; onSaved: () => void;
}) {
  const nav = useNavigate();
  const [question, setQuestion] = useState("");
  const [unit, setUnit] = useState<string>("");
  const [marks, setMarks] = useState("");
  const [years, setYears] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { toast.error("Sign in to contribute"); nav("/auth"); return; }
    if (!question.trim()) return toast.error("Enter the topic / question");
    setBusy(true);
    const yrs = years.split(",").map((y) => Number(y.trim())).filter((n) => !isNaN(n) && n > 1900);
    const { error } = await supabase.from("repeated_questions").insert({
      branch, semester, subject,
      unit_number: unit ? Number(unit) : null,
      question: question.trim(),
      marks: marks ? Number(marks) : null,
      years: yrs, notes: notes.trim() || null,
      contributor_id: user.id, contributor_name: contributorName,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Topic added to the pad");
    onSaved();
  }

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Add a topic</DialogTitle></DialogHeader>
      <form onSubmit={save} className="space-y-3">
        <div><Label className="text-xs">Topic / Question</Label>
          <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={4} placeholder="e.g. Explain normalization with examples" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger><SelectValue placeholder={units.length ? "Select unit" : "No units defined"} /></SelectTrigger>
              <SelectContent>
                {units.map((u) => <SelectItem key={u.unit_number} value={String(u.unit_number)}>Unit {u.unit_number} — {u.unit_name}</SelectItem>)}
              </SelectContent>
            </Select></div>
          <div><Label className="text-xs">Marks (optional)</Label>
            <Input type="number" value={marks} onChange={(e) => setMarks(e.target.value)} placeholder="e.g. 10" /></div>
        </div>
        <div><Label className="text-xs">Years it appeared (comma separated)</Label>
          <Input value={years} onChange={(e) => setYears(e.target.value)} placeholder="2021, 2022, 2024" /></div>
        <div><Label className="text-xs">Details — PYQs, sub-questions, explanations (optional)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            placeholder={"Add question-wise PYQ references, e.g.:\nQ1 (2023) — Explain 3NF with example\nQ2 (2022) — BCNF decomposition\nImportant: frequently 8–10 marks"}
            className="min-h-[160px]"
          /></div>
        <Button type="submit" disabled={busy} className="w-full">
          {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Submit
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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">Admin</Badge>
        <h3 className="font-semibold text-sm">Manage units for this subject</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {units.map((u) => (
          <Badge key={u.unit_number} variant="secondary" className="gap-1">
            Unit {u.unit_number}: {u.unit_name}
            <button onClick={() => del(u.unit_number)} className="ml-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input className="w-20" placeholder="#" type="number" value={num} onChange={(e) => setNum(e.target.value)} />
        <Input placeholder="Unit name (e.g. Relational Model)" value={nm} onChange={(e) => setNm(e.target.value)} />
        <Button onClick={add} disabled={busy} variant="outline">Add</Button>
      </div>
    </div>
  );
}
