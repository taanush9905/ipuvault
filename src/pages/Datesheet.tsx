import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EXAM_TYPES, SEMESTERS } from "@/lib/constants";
import { useBranches } from "@/lib/use-branches";
import { BranchMultiPicker } from "@/components/branch-multi-picker";
import { insertDatesheetMulti, updateDatesheetGroup } from "@/lib/datesheet-publish";
import { ALL_BRANCHES_CODE, formatDatesheetBranches, isAllBranchesEntry } from "@/lib/datesheet-label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Plus, MapPin, Clock, Pin, Loader2, CalendarDays, ShieldAlert, Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { countdown } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { HoverButton } from "@/components/ui/hover-button";
import { Button } from "@/components/ui/button";

type Datesheet = {
  id: string;
  branch: string;
  branches?: string[] | null;
  publish_group_id?: string | null;
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
  const { branches } = useBranches();

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
    return items.filter((d) => {
      const branchOk =
        filterBranch === "all" ||
        isAllBranchesEntry(d.branch, d.branches) ||
        d.branch === filterBranch ||
        (d.branches || []).includes(filterBranch);
      const semOk = filterSem === "all" || d.semester === Number(filterSem);
      return branchOk && semOk;
    }).sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.exam_date.localeCompare(b.exam_date);
    });
  }, [items, filterBranch, filterSem]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Datesheet Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium">
            <CalendarDays className="h-3.5 w-3.5" /> Official Schedules
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Examination Datesheets
          </h1>
          <p className="text-xs text-muted-foreground">
            View countdowns and venues of exam schedules. Filter by your branch and semester.
          </p>
        </div>

        {isAdmin ? (
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <HoverButton variant="primary" className="rounded-xl shrink-0 self-start sm:self-center shadow-soft">
                <Plus className="h-4 w-4" /> Post Datesheet
              </HoverButton>
            </DialogTrigger>
            <DatesheetFormDialog
              branches={branches}
              defaultBranch={profile?.branch || ""}
              defaultSemester={profile?.semester || 0}
              createdByName={profile?.display_name || "Admin"}
              onSaved={() => { setOpenAdd(false); load(); }}
            />
          </Dialog>
        ) : (
          <div className="text-xs text-muted-foreground flex items-center gap-2 rounded-xl border bg-secondary/30 px-3.5 py-2 shrink-0 self-start sm:self-center">
            <ShieldAlert className="h-4 w-4 text-primary" /> Admins posting only
          </div>
        )}
      </div>

      {/* Glass filters card */}
      <div className="glass-panel rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Branch Filter</span>
          <Select value={filterBranch} onValueChange={setFilterBranch}>
            <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All branches</SelectItem>
              {branches.map((b) => <SelectItem key={b.code} value={b.code}>{b.code}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Semester Filter</span>
          <Select value={filterSem} onValueChange={setFilterSem}>
            <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All semesters</SelectItem>
              {SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main schedule card */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" /> Exam Timelines
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Sorted by pinned status and soonest dates.
        </p>

        {loading ? (
          <div className="space-y-3 pt-2">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card/50 p-12 text-center">
            <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No exams scheduled for this branch or semester.</p>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {filtered.map((d) => (
              <DatesheetRow key={d.id} d={d} canEdit={isAdmin} branches={branches} onChange={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DatesheetRow({
  d, canEdit, branches, onChange,
}: { d: Datesheet; canEdit: boolean; branches: ReturnType<typeof useBranches>["branches"]; onChange: () => void }) {
  const cd = countdown(d.exam_date);
  const [editOpen, setEditOpen] = useState(false);
  const allBranches = isAllBranchesEntry(d.branch, d.branches);
  const branchLabel = formatDatesheetBranches(d.branch, d.branches);
  const colors = {
    past: "bg-muted text-muted-foreground border-border",
    today: "bg-warning/15 text-warning border-warning/30",
    upcoming: "bg-primary/10 text-primary border-primary/20",
  } as const;

  async function togglePin() {
    if (!canEdit) return toast.error("Admins only");
    await supabase.from("datesheets").update({ pinned: !d.pinned }).eq("id", d.id);
    onChange();
  }

  async function remove() {
    if (!canEdit) return;
    if (!confirm(`Remove "${d.subject}" from datesheet?`)) return;
    if (d.publish_group_id) {
      await supabase.from("datesheets").delete().eq("publish_group_id", d.publish_group_id);
    } else {
      await supabase.from("datesheets").delete().eq("id", d.id);
    }
    toast.success("Datesheet entry removed");
    onChange();
  }

  return (
    <>
      <div className={cn("rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors bg-card hover:border-primary/30 shadow-sm", cd.status === "past" && "opacity-60")}>
        <div className={cn("rounded-xl border px-3 py-2.5 text-center min-w-[90px] shadow-xs", colors[cd.status])}>
          <div className="text-2xl font-black leading-none">{new Date(d.exam_date).getDate()}</div>
          <div className="text-[10px] font-bold uppercase tracking-wide mt-1">
            {new Date(d.exam_date).toLocaleString("en-US", { month: "short", year: "numeric" })}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-foreground text-base leading-snug">{d.subject}</h3>
            <Badge variant="secondary" className="font-semibold text-[10px]">{d.exam_type}</Badge>
            {allBranches ? (
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary font-bold">All branches</Badge>
            ) : (d.branches?.length ?? 0) > 1 ? (
              <Badge variant="outline" className="text-[10px]">Shared · {d.branches!.length} branches</Badge>
            ) : null}
            {d.pinned && <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline"><Pin className="h-3 w-3 mr-1" />Pinned</Badge>}
          </div>
          <div className="text-xs text-muted-foreground mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-medium">
            <span>{branchLabel} · Sem {d.semester}</span>
            {d.exam_time && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-muted-foreground/80" />{d.exam_time}</span>}
            {d.venue && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground/80" />{d.venue}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end sm:justify-center">
          <Badge variant="outline" className={cn("font-bold text-[10px] px-2.5 py-1", cd.status === "today" && "bg-warning/15 text-warning border-warning/30")}>
            {cd.label}
          </Badge>
          {canEdit && (
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)} aria-label="Edit" className="h-9 w-9 rounded-full">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={togglePin} aria-label="Pin" className="h-9 w-9 rounded-full">
                <Pin className={cn("h-4 w-4", d.pinned && "fill-primary text-primary")} />
              </Button>
              <Button variant="ghost" size="icon" onClick={remove} aria-label="Remove" className="h-9 w-9 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DatesheetFormDialog
          branches={branches}
          editRecord={d}
          createdByName={d.created_by_name}
          onSaved={() => { setEditOpen(false); onChange(); }}
        />
      </Dialog>
    </>
  );
}

function DatesheetFormDialog({
  branches,
  defaultBranch = "",
  defaultSemester = 0,
  createdByName,
  editRecord,
  onSaved,
}: {
  branches: ReturnType<typeof useBranches>["branches"];
  defaultBranch?: string;
  defaultSemester?: number;
  createdByName: string;
  editRecord?: Datesheet;
  onSaved: () => void;
}) {
  const initialBranches = editRecord
    ? isAllBranchesEntry(editRecord.branch, editRecord.branches)
      ? []
      : (editRecord.branches?.filter((b) => b && b !== ALL_BRANCHES_CODE) ||
          [editRecord.branch].filter((b) => b && b !== ALL_BRANCHES_CODE))
    : [];
  const [selectedBranches, setSelectedBranches] = useState<string[]>(initialBranches);
  const [semester, setSemester] = useState(editRecord ? String(editRecord.semester) : defaultSemester ? String(defaultSemester) : "");
  const [examType, setExamType] = useState(editRecord?.exam_type || "End Term");
  const [subject, setSubject] = useState(editRecord?.subject || "");
  const [date, setDate] = useState(editRecord?.exam_date || "");
  const [time, setTime] = useState(editRecord?.exam_time || "");
  const [venue, setVenue] = useState(editRecord?.venue || "");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!semester || !subject || !date) return toast.error("Fill semester, subject, and date");
    setSaving(true);
    try {
      const payload = {
        branch: selectedBranches[0] || ALL_BRANCHES_CODE,
        branches: selectedBranches,
        semester: Number(semester),
        exam_type: examType,
        subject,
        exam_date: date,
        exam_time: time || null,
        venue: venue || null,
        created_by_name: createdByName,
        pinned: editRecord?.pinned ?? false,
      };
      if (editRecord) {
        await updateDatesheetGroup(editRecord.id, editRecord, payload);
        toast.success("Datesheet updated");
      } else {
        const n = await insertDatesheetMulti(payload);
        toast.success(
          selectedBranches.length === 0
            ? "Datesheet posted (all branches)"
            : n > 1
              ? `Posted to ${n} branches`
              : "Datesheet posted"
        );
      }
      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed";
      toast.error(msg.includes("branches") ? "Run setup-browse-features.sql in Supabase" : msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <DialogContent className="max-w-lg rounded-3xl border shadow-elegant bg-card/95 backdrop-blur-md">
      <DialogHeader>
        <DialogTitle className="text-base font-bold">{editRecord ? "Edit Datesheet entry" : "Post new examination"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={save} className="space-y-4 mt-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Branch selector (optional)</Label>
          <p className="text-[10px] text-muted-foreground leading-normal mb-1">
            Leave unselected to apply to <strong className="text-foreground">all branches</strong>.
          </p>
          <BranchMultiPicker branches={branches} selected={selectedBranches} onChange={setSelectedBranches} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Semester</Label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger className="h-10 rounded-xl text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exam type</Label>
            <Select value={examType} onValueChange={setExamType}>
              <SelectTrigger className="h-10 rounded-xl text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{EXAM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Operating Systems" className="rounded-xl h-10 text-xs" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl h-10 text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-xl h-10 text-xs" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Venue (optional)</Label>
          <Input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Hall 2A / Room 104" className="rounded-xl h-10 text-xs" />
        </div>
        <Button type="submit" disabled={saving} className="w-full h-11 rounded-2xl text-xs font-semibold mt-2 shadow-soft">
          {saving ? "Saving entry..." : editRecord ? "Save changes" : "Publish Schedule"}
        </Button>
      </form>
    </DialogContent>
  );
}
