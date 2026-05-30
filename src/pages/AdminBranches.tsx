import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Row = {
  code: string;
  name: string;
  icon: string;
  enabled: boolean;
  visible: boolean;
  uploads_enabled: boolean;
};

export default function AdminBranches() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const { data, error } = await supabase.from("branch_settings").select("*").order("code");
      if (error) toast.error(error.message);
      setRows((data as Row[]) || []);
      setLoading(false);
    })();
  }, [isAdmin]);

  if (authLoading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  async function patch(code: string, patch: Partial<Row>) {
    const { error } = await supabase.from("branch_settings").update({ ...patch, updated_at: new Date().toISOString() }).eq("code", code);
    if (error) return toast.error(error.message);
    setRows((prev) => prev.map((r) => (r.code === code ? { ...r, ...patch } : r)));
    toast.success("Branch updated");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Branch management</h1>
        <p className="text-muted-foreground mt-1">Enable, hide, or disable uploads per branch. Changes apply immediately for all users.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {rows.map((b) => (
            <div key={b.code} className="glass-panel rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <p className="font-semibold">{b.code} · {b.name}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <Badge variant={b.enabled ? "default" : "secondary"}>{b.enabled ? "Enabled" : "Disabled"}</Badge>
                      <Badge variant={b.visible ? "outline" : "secondary"}>{b.visible ? "Visible" : "Hidden"}</Badge>
                      <Badge variant={b.uploads_enabled ? "outline" : "destructive"}>
                        {b.uploads_enabled ? "Uploads on" : "Uploads off"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <label className="flex items-center justify-between gap-2 rounded-xl border px-3 py-2">
                  Enabled
                  <Switch checked={b.enabled} onCheckedChange={(v) => patch(b.code, { enabled: v })} />
                </label>
                <label className="flex items-center justify-between gap-2 rounded-xl border px-3 py-2">
                  Visible
                  <Switch checked={b.visible} onCheckedChange={(v) => patch(b.code, { visible: v })} />
                </label>
                <label className="flex items-center justify-between gap-2 rounded-xl border px-3 py-2">
                  Uploads
                  <Switch checked={b.uploads_enabled} onCheckedChange={(v) => patch(b.code, { uploads_enabled: v })} />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
