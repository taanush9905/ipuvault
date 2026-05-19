import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BRANCHES, SEMESTERS } from "@/lib/constants";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PaperCard, type Paper } from "@/components/paper-card";
import { PaperViewer } from "@/components/paper-viewer";
import { initials } from "@/lib/format";
import { toast } from "sonner";
import { Star, Upload as UploadIcon, LogOut, ShieldCheck } from "lucide-react";

export default function Profile() {
  const { user, profile, isAdmin, loading, signOut, refreshProfile } = useAuth();
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [saving, setSaving] = useState(false);

  const [starred, setStarred] = useState<Paper[]>([]);
  const [uploads, setUploads] = useState<Paper[]>([]);
  const [open, setOpen] = useState<Paper | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.display_name || "");
      setBranch(profile.branch || "");
      setSemester(profile.semester ? String(profile.semester) : "");
    }
  }, [profile]);

  async function load() {
    if (!user) return;
    const [{ data: starRows }, { data: myData }] = await Promise.all([
      supabase.from("paper_stars").select("paper_id, papers(*)").eq("user_id", user.id),
      supabase.from("papers").select("*").eq("uploader_id", user.id).order("created_at", { ascending: false }),
    ]);
    const starredPapers = (starRows || [])
      .map((r) => (r as { papers: Paper | null }).papers)
      .filter((p): p is Paper => !!p);
    setStarred(starredPapers);
    setUploads((myData as Paper[]) || []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: name.trim() || null,
      branch: branch || null,
      semester: semester ? Number(semester) : null,
    }).eq("user_id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    await refreshProfile();
    toast.success("Profile saved — branch can be changed anytime");
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <section className="rounded-2xl border bg-card p-6 sm:p-8 flex items-center gap-5">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="h-20 w-20 rounded-full gradient-primary text-primary-foreground grid place-items-center text-2xl font-bold shadow-soft">
            {initials(name || profile?.email || "S")}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold truncate">{name || profile?.email || "Student"}</h1>
            {isAdmin && <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline"><ShieldCheck className="h-3 w-3 mr-1" />Admin</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {branch ? branch : "No branch set"} {semester && `· Sem ${semester}`}
          </p>
          <div className="flex gap-4 mt-3 text-sm">
            <span><b>{uploads.length}</b> <span className="text-muted-foreground">uploads</span></span>
            <span><b>{starred.length}</b> <span className="text-muted-foreground">starred</span></span>
          </div>
        </div>
        <Button variant="outline" onClick={signOut}><LogOut className="h-4 w-4 mr-2" />Sign out</Button>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-1">Your details</h2>
        <p className="text-xs text-muted-foreground mb-4">Branch and semester can be changed anytime.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3"><Label className="text-xs">Display name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label className="text-xs">Branch</Label>
            <Select value={branch} onValueChange={setBranch}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{BRANCHES.map((b) => <SelectItem key={b.code} value={b.code}>{b.code} — {b.name}</SelectItem>)}</SelectContent>
            </Select></div>
          <div><Label className="text-xs">Semester</Label>
            <Select value={semester} onValueChange={setSemester}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>Sem {s}</SelectItem>)}</SelectContent>
            </Select></div>
        </div>
        <Button onClick={save} disabled={saving} className="mt-4">Save profile</Button>
      </section>

      <section>
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Star className="h-4 w-4 text-warning" /> Starred papers</h2>
        {starred.length === 0 ? (
          <p className="text-sm text-muted-foreground rounded-xl border border-dashed p-8 text-center">Tap the star on any paper to save it here.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">{starred.map((p) => <PaperCard key={p.id} paper={p} onOpen={setOpen} />)}</div>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-4 flex items-center gap-2"><UploadIcon className="h-4 w-4 text-primary" /> Your uploads</h2>
        {uploads.length === 0 ? (
          <p className="text-sm text-muted-foreground rounded-xl border border-dashed p-8 text-center">Nothing uploaded yet. Share a paper from the Upload tab.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">{uploads.map((p) => <PaperCard key={p.id} paper={p} onOpen={setOpen} />)}</div>
        )}
      </section>

      <PaperViewer paper={open} onClose={() => setOpen(null)} />
    </div>
  );
}
