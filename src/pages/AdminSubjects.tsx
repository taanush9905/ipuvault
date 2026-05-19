import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { BRANCHES, SEMESTERS, getSubjects } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, EyeOff, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";


type Row = { id: string; name: string; hidden: boolean; isDefault: boolean };

export default function AdminSubjects() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [branch, setBranch] = useState("CSE");
  const [semester, setSemester] = useState("1");
  const [rows, setRows] = useState<Row[]>([]);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    const sem = Number(semester);
    const { data } = await supabase
      .from("subjects")
      .select("id, name, hidden")
      .eq("branch", branch)
      .eq("semester", sem);
    const dbRows = (data || []) as { id: string; name: string; hidden: boolean }[];
    const dbByName = new Map(dbRows.map((r) => [r.name, r]));
    const defaults = getSubjects(branch, sem);
    const out: Row[] = [];
    for (const name of defaults) {
      const r = dbByName.get(name);
      out.push({ id: r?.id ?? `default:${name}`, name, hidden: !!r?.hidden, isDefault: true });
      if (r) dbByName.delete(name);
    }
    for (const r of dbByName.values()) {
      out.push({ id: r.id, name: r.name, hidden: r.hidden, isDefault: false });
    }
    setRows(out);
    setBusy(false);
  }

  useEffect(() => { if (isAdmin) load(); /* eslint-disable-next-line */ }, [branch, semester, isAdmin]);

  async function add() {
    const name = newName.trim();
    if (!name) return;
    const { error } = await supabase.from("subjects").insert({
      branch, semester: Number(semester), name, hidden: false,
    });
    if (error) return toast.error(error.message);
    setNewName("");
    toast.success("Subject added");
    load();
  }

  async function cascadeWipe(name: string) {
    const sem = Number(semester);
    await Promise.all([
      supabase.from("papers").delete().eq("branch", branch).eq("semester", sem).eq("subject", name),
      supabase.from("repeated_questions").delete().eq("branch", branch).eq("semester", sem).eq("subject", name),
      supabase.from("subject_units").delete().eq("branch", branch).eq("semester", sem).eq("subject", name),
    ]);
  }

  async function toggleHide(row: Row) {
    const willHide = !row.hidden;
    if (willHide && !confirm(`Hide "${row.name}"? All its papers, topics and units will be removed.`)) return;
    if (row.isDefault && row.id.startsWith("default:")) {
      const { error } = await supabase.from("subjects").insert({
        branch, semester: Number(semester), name: row.name, hidden: true,
      });
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("subjects").update({ hidden: willHide }).eq("id", row.id);
      if (error) return toast.error(error.message);
    }
    if (willHide) await cascadeWipe(row.name);
    toast.success(willHide ? "Subject hidden & cleaned up" : "Subject restored");
    load();
  }

  async function remove(row: Row) {
    if (row.isDefault) {
      toast.error("Default subjects can only be hidden, not deleted.");
      return;
    }
    if (!confirm(`Delete "${row.name}" and ALL its papers, topics and units?`)) return;
    await cascadeWipe(row.name);
    const { error } = await supabase.from("subjects").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Subject removed");
    load();
  }

  if (authLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Manage subjects</h1>
        <p className="text-muted-foreground mt-1">Add new subjects or hide defaults per branch & semester.</p>
      </div>

      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground">Branch</Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{BRANCHES.map((b) => <SelectItem key={b.code} value={b.code}>{b.code} — {b.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase text-muted-foreground">Semester</Label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder="Add a new subject…"
          />
          <Button onClick={add} disabled={!newName.trim()}><Plus className="h-4 w-4 mr-1" />Add</Button>
        </div>

        {busy ? (
          <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No subjects yet for this branch & semester.</p>
        ) : (
          <ul className="divide-y">
            {rows.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-2.5 gap-2">
                <div className="min-w-0 flex items-center gap-2">
                  <span className={`truncate text-sm ${r.hidden ? "text-muted-foreground line-through" : ""}`}>{r.name}</span>
                  {r.isDefault && <Badge variant="secondary" className="text-[10px]">default</Badge>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => toggleHide(r)} title={r.hidden ? "Show" : "Hide"}>
                    {r.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  {!r.isDefault && (
                    <Button variant="ghost" size="icon" onClick={() => remove(r)} title="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
