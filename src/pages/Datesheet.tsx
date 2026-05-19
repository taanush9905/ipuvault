import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BRANCHES, EXAM_TYPES, SEMESTERS } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Plus, MapPin, Clock, Pin, Loader2, CalendarDays, ShieldAlert, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { countdown } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Datesheet = {
  id: string;
  branch: string;
  semester: number;
  section: string;
  exam_type: string;
  subject: string;
  exam_date: string;
  exam_time: string | null;
  venue: string | null;
  pinned: boolean;
  created_by_name: string;
};

export default function Datesheet() {
  const { profile, isAdmin } = useAuth();
  const [items, setItems] = useState<Datesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBranch, setFilterBranch] = useState(profile?.branch || "all");
  const [filterSem, setFilterSem] = useState(profile?.semester ? String(profile.semester) : "all");
  const [openAdd, setOpenAdd] = useState(false);

  // Sync filter to profile branch when it loads / changes
  useEffect(() => {
    if (profile?.branch) setFilterBranch(profile.branch);
    if (profile?.semester) setFilterSem(String(profile.semester));
  }, [profile?.branch, profile?.semester]);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("datesheets").select("*").order("exam_date", { ascending: true });
    setItems((data as Datesheet[]) || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return items.filter((d) =>
      (filterBranch === "all" || d.branch === filterBranch) &&
      (filterSem === "all" || d.semester === Number(filterSem))
    ).sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.exam_date.localeCompare(b.exam_date);
    });
  }, [items, filterBranch, filterSem]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Datesheet</h1>
          <p className="text-muted-foreground mt-1">
            {profile?.branch ? `Defaulting to your branch (${profile.branch}). Change anytime in Profile.` : "Set your branch in Profile to see relevant exams first."}
          </p>
        </div>
        {isAdmin ? (
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Post datesheet</Button>
            </DialogTrigger>
            <AddDatesheetDialog
              defaultBranch={profile?.branch || ""}
              defaultSemester={profile?.semester || 0}
              createdByName={profile?.display_name || "Admin"}
              onSaved={() => { setOpenAdd(false); load(); }}
            />
          </Dialog>
        ) : (
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 rounded-lg border bg-muted px-3 py-2">
            <ShieldAlert className="h-3.5 w-3.5" /> Only admins can post datesheets
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-card p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select value={filterBranch} onValueChange={setFilterBranch}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All branches</SelectItem>
            {BRANCHES.map((b) => <SelectItem key={b.code} value={b.code}>{b.code}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterSem} onValueChange={setFilterSem}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All semesters</SelectItem>
            {SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>Sem {s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No exams scheduled for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => <DatesheetRow key={d.id} d={d} canEdit={isAdmin} onChange={load} />)}
        </div>
      )}
    </div>
  );
}

function DatesheetRow({ d, canEdit, onChange }: { d: Datesheet; canEdit: boolean; onChange: () => void }) {
  const cd = countdown(d.exam_date);
  const colors = {
    past: "bg-muted text-muted-foreground border-border",
    today: "bg-warning/15 text-warning border-warning/30",
    upcoming: "bg-accent text-accent-foreground border-primary/20",
  } as const;

  async function togglePin() {
    if (!canEdit) return toast.error("Admins only");
    await supabase.from("datesheets").update({ pinned: !d.pinned }).eq("id", d.id);
    onChange();
  }

  async function remove() {
    if (!canEdit) return;
    if (!confirm(`Remove "${d.subject}" from datesheet?`)) return;
    const { error } = await supabase.from("datesheets").delete().eq("id", d.id);
    if (error) return toast.error(error.message);
    toast.success("Datesheet entry removed");
    onChange();
  }

  return (
    <div className={cn("rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors bg-card", cd.status === "past" && "opacity-60")}>
      <div className={cn("rounded-xl border px-3 py-2 text-center min-w-[88px]", colors[cd.status])}>
        <div className="text-2xl font-bold leading-none">{new Date(d.exam_date).getDate()}</div>
        <div className="text-[10px] uppercase tracking-wide mt-0.5">
          {new Date(d.exam_date).toLocaleString("en-US", { month: "short", year: "numeric" })}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold">{d.subject}</h3>
          <Badge variant="secondary">{d.exam_type}</Badge>
          {d.pinned && <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline"><Pin className="h-3 w-3 mr-1" />Pinned</Badge>}
        </div>
        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
          <span>{d.branch} · Sem {d.semester}</span>
          {d.exam_time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{d.exam_time}</span>}
          {d.venue && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{d.venue}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className={cn("font-medium", cd.status === "today" && "bg-warning/15 text-warning border-warning/30")}>
          {cd.label}
        </Badge>
        {canEdit && (
          <>
            <Button variant="ghost" size="icon" onClick={togglePin} aria-label="Pin">
              <Pin className={cn("h-4 w-4", d.pinned && "fill-primary text-primary")} />
            </Button>
            <Button variant="ghost" size="icon" onClick={remove} aria-label="Remove" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function AddDatesheetDialog({
  defaultBranch, defaultSemester, createdByName, onSaved,
}: { defaultBranch: string; defaultSemester: number; createdByName: string; onSaved: () => void }) {
  const [branch, setBranch] = useState(defaultBranch);
  const [semester, setSemester] = useState(defaultSemester ? String(defaultSemester) : "");
  
  const [examType, setExamType] = useState("End Term");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!branch || !semester || !subject || !date) return toast.error("Fill required fields");
    setSaving(true);
    const { error } = await supabase.from("datesheets").insert({
      branch, semester: Number(semester), section: "-", exam_type: examType,
      subject, exam_date: date, exam_time: time || null, venue: venue || null,
      created_by_name: createdByName,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Datesheet posted");
    onSaved();
  }

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Post exam date for a branch</DialogTitle></DialogHeader>
      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Branch</Label>
            <Select value={branch} onValueChange={setBranch}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{BRANCHES.map((b) => <SelectItem key={b.code} value={b.code}>{b.code}</SelectItem>)}</SelectContent>
            </Select></div>
          <div><Label className="text-xs">Semester</Label>
            <Select value={semester} onValueChange={setSemester}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>Sem {s}</SelectItem>)}</SelectContent>
            </Select></div>
          <div><Label className="text-xs">Exam type</Label>
            <Select value={examType} onValueChange={setExamType}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{EXAM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select></div>
        </div>
        <div><Label className="text-xs">Subject</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. DBMS" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div><Label className="text-xs">Time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
        </div>
        <div><Label className="text-xs">Venue / Room (optional)</Label>
          <Input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. Hall 3, Block A" /></div>
        <Button type="submit" disabled={saving} className="w-full">
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Post
        </Button>
      </form>
    </DialogContent>
  );
}
