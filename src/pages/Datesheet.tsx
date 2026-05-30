import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Datesheet</h1>
          <p className="text-muted-foreground mt-1">Exam schedule — branch is optional; leave empty for all branches.</p>
        </div>
        {isAdmin ? (
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Post datesheet</Button>
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
            {branches.map((b) => <SelectItem key={b.code} value={b.code}>{b.code}</SelectItem>)}
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
          {filtered.map((d) => <DatesheetRow key={d.id} d={d} canEdit={isAdmin} branches={branches} onChange={load} />)}
        </div>
      )}
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
            {allBranches ? (
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">All branches</Badge>
            ) : (d.branches?.length ?? 0) > 1 ? (
              <Badge variant="outline" className="text-[10px]">Shared · {d.branches!.length} branches</Badge>
            ) : null}
            {d.pinned && <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline"><Pin className="h-3 w-3 mr-1" />Pinned</Badge>}
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
            <span>{branchLabel} · Sem {d.semester}</span>
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
              <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)} aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{editRecord ? "Edit datesheet" : "Post exam date"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={save} className="space-y-4">
        <div>
          <Label className="text-xs">Branch (optional)</Label>
          <p className="text-[11px] text-muted-foreground mt-0.5 mb-2">
            Leave empty — applies to <strong className="text-foreground">all branches</strong>. Select later when you need branch-specific exams.
          </p>
          <BranchMultiPicker branches={branches} selected={selectedBranches} onChange={setSelectedBranches} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Semester</Label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>Sem {s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Exam type</Label>
            <Select value={examType} onValueChange={setExamType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{EXAM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-xs">Subject</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. DBMS" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div>
          <Label className="text-xs">Venue (optional)</Label>
          <Input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Hall / room" />
        </div>
        <Button type="submit" disabled={saving} className="w-full rounded-xl">
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {editRecord ? "Save changes" : "Post"}
        </Button>
      </form>
    </DialogContent>
  );
}
