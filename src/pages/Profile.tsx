import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
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
import { Star, Upload as UploadIcon, LogOut, ShieldCheck, User } from "lucide-react";
import { HoverButton } from "@/components/ui/hover-button";

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
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, [user?.id]);

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
      
      {/* 1. Header user banner card */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="h-20 w-20 rounded-2xl object-cover border shrink-0" />
        ) : (
          <div className="h-20 w-20 rounded-2xl gradient-primary text-primary-foreground grid place-items-center text-2xl font-black shadow-soft shrink-0">
            {initials(name || profile?.email || "S")}
          </div>
        )}
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold text-foreground truncate">{name || profile?.email?.split("@")[0] || "Student"}</h1>
            {isAdmin && (
              <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
                <ShieldCheck className="h-3 w-3 mr-1" />Admin
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
          <p className="text-xs text-muted-foreground font-semibold">
            {branch ? branch : "Branch not set"} {semester && `· Semester ${semester}`}
          </p>
          <div className="flex gap-4 mt-2 text-xs font-semibold">
            <span>{uploads.length} <span className="text-muted-foreground">uploads</span></span>
            <span>{starred.length} <span className="text-muted-foreground">starred</span></span>
          </div>
        </div>

        <HoverButton
          variant="outline"
          size="sm"
          onClick={signOut}
          className="rounded-xl shrink-0 self-start sm:self-center bg-card/60"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </HoverButton>
      </section>

      {/* 2. Details Card */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Profile Settings
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Customize your name and default academic filters.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div className="sm:col-span-3 space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl h-11 text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Branch</Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="rounded-xl h-11 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {BRANCHES.map((b) => <SelectItem key={b.code} value={b.code}>{b.code} — {b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Semester</Label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger className="rounded-xl h-11 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <HoverButton
          onClick={save}
          disabled={saving}
          variant="primary"
          className="rounded-xl mt-2"
        >
          {saving ? "Saving settings..." : "Save profile"}
        </HoverButton>
      </section>

      {/* 3. Starred papers section card */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Star className="h-4 w-4 text-warning fill-current" /> Starred resources
        </h2>
        <p className="text-xs text-muted-foreground">Your bookmarked and saved question papers.</p>
        
        {starred.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-2xl bg-muted/20">
            <Star className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
            <p className="text-xs text-muted-foreground">No starred papers yet. Star papers during browsing to view them here.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {starred.map((p) => <PaperCard key={p.id} paper={p} onOpen={setOpen} />)}
          </div>
        )}
      </section>

      {/* 4. Contributions section card */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <UploadIcon className="h-4 w-4 text-primary" /> Contributed uploads
        </h2>
        <p className="text-xs text-muted-foreground">Files you have submitted that are approved by VaultTeam.</p>
        
        {uploads.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-2xl bg-muted/20">
            <UploadIcon className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
            <p className="text-xs text-muted-foreground">No uploads contributed yet. Help the student community by posting a resource.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {uploads.map((p) => <PaperCard key={p.id} paper={p} onOpen={setOpen} />)}
          </div>
        )}
      </section>

      <PaperViewer paper={open} onClose={() => setOpen(null)} />
    </div>
  );
}
