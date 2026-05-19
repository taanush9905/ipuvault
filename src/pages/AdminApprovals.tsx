import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Check, X, FileText, ShieldCheck, Loader2 } from "lucide-react";


type Paper = {
  id: string;
  branch: string;
  semester: number;
  subject: string;
  year: number;
  exam_type: string;
  title: string | null;
  uploader_name: string;
  file_path: string;
  created_at: string;
};

export default function AdminApprovals() {
  const { user, isAdmin, loading } = useAuth();
  const [items, setItems] = useState<Paper[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  async function load() {
    setFetching(true);
    const { data } = await supabase
      .from("papers")
      .select("*")
      .eq("approved", false)
      .order("created_at", { ascending: false });
    setItems((data as Paper[]) || []);
    setFetching(false);
  }

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  async function approve(id: string) {
    setBusy(id);
    const { error } = await supabase.from("papers").update({
      approved: true, reviewed_at: new Date().toISOString(), reviewed_by: user?.id,
    }).eq("id", id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Approved & published");
    setItems((p) => p.filter((x) => x.id !== id));
  }

  async function reject(p: Paper) {
    if (!confirm(`Reject and delete "${p.title || p.subject}"?`)) return;
    setBusy(p.id);
    await supabase.storage.from("papers").remove([p.file_path]);
    const { error } = await supabase.from("papers").delete().eq("id", p.id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Rejected & removed");
    setItems((prev) => prev.filter((x) => x.id !== p.id));
  }

  async function preview(path: string) {
    const { data } = await supabase.storage.from("papers").createSignedUrl(path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return (
    <div className="rounded-2xl border bg-card p-12 text-center">
      <p className="text-sm text-muted-foreground">Admins only.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">Pending approvals</h1>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">Review uploads before they go live.</p>
      </div>

      {fetching ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">All caught up — no pending uploads.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="rounded-2xl border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-accent grid place-items-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.title || `${p.subject} · ${p.year}`}</div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-0.5">
                    <Badge variant="secondary">{p.branch} · Sem {p.semester}</Badge>
                    <span>{p.subject} · {p.exam_type} · {p.year}</span>
                    <span>by {p.uploader_name}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => preview(p.file_path)}>Preview</Button>
                <Button size="sm" onClick={() => approve(p.id)} disabled={busy === p.id}>
                  {busy === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => reject(p)} disabled={busy === p.id}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
