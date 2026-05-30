import { useEffect, useState } from "react";
import { Bell, X, Plus, Loader2, Megaphone, FileUp, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Announcement = {
  id: string;
  message: string;
  announcement_type: string;
  active: boolean;
  created_at: string;
};

const TYPE_ICON: Record<string, typeof Megaphone> = {
  info: Megaphone,
  upload: FileUp,
  success: Sparkles,
};

export function SiteNotifications() {
  const { isAdmin, user } = useAuth();
  const [items, setItems] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [type, setType] = useState("info");
  const [posting, setPosting] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("pyq:dismissed-announcements");
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  });

  async function load() {
    const { data } = await supabase
      .from("site_announcements")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(20);
    setItems((data as Announcement[]) || []);
  }

  useEffect(() => {
    const t = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const visible = items.filter((a) => !dismissed.has(a.id));
  const unread = visible.length;

  function dismiss(id: string) {
    const next = new Set(dismissed).add(id);
    setDismissed(next);
    localStorage.setItem("pyq:dismissed-announcements", JSON.stringify([...next]));
  }

  async function post() {
    if (!draft.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("site_announcements").insert({
      message: draft.trim(),
      announcement_type: type,
      created_by: user?.id ?? null,
    });
    setPosting(false);
    if (error) {
      toast.error(error.message.includes("site_announcements") ? "Run setup-browse-features.sql in Supabase" : error.message);
      return;
    }
    toast.success("Announcement posted");
    setDraft("");
    load();
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-xl relative h-9 w-9 shrink-0">
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-primary text-[10px] font-bold text-primary-foreground grid place-items-center animate-pulse">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[min(100vw-2rem,380px)] p-0 rounded-2xl overflow-hidden">
          <div className="p-4 border-b bg-muted/30">
            <p className="font-semibold text-sm">Updates from VaultTeam</p>
            <p className="text-xs text-muted-foreground">New papers, notes & alerts</p>
          </div>
          <div className="max-h-[50vh] overflow-y-auto p-2 space-y-2">
            {visible.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No new updates</p>
            ) : (
              visible.map((a) => {
                const Icon = TYPE_ICON[a.announcement_type] || Megaphone;
                return (
                  <div key={a.id} className="rounded-xl border bg-card p-3 flex gap-2 animate-fade-in">
                    <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed">{a.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(a.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button type="button" onClick={() => dismiss(a.id)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
          {isAdmin && (
            <div className="p-3 border-t bg-muted/20 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Admin — post update</p>
              <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="e.g. New DBMS papers uploaded for CSE Sem 4" className="rounded-xl text-sm" />
              <div className="flex gap-2">
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="rounded-xl h-9 flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="upload">Upload</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" className="rounded-xl" onClick={post} disabled={posting}>
                  {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** Floating banners on browse — smooth slide-in */
export function AnnouncementBanners() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_announcements")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(3);
      setItems((data as Announcement[]) || []);
    })();
  }, []);

  const shown = items.filter((a) => !hidden.has(a.id)).slice(0, 2);
  if (!shown.length) return null;

  return (
    <div className="space-y-2 animate-fade-in">
      {shown.map((a) => {
        const Icon = TYPE_ICON[a.announcement_type] || Megaphone;
        return (
          <div
            key={a.id}
            className={cn(
              "rounded-2xl border px-4 py-3 flex items-start gap-3 transition-all",
              a.announcement_type === "upload" && "border-primary/40 bg-primary/10",
              a.announcement_type === "success" && "border-primary/30 bg-primary/5",
              a.announcement_type === "info" && "bg-card"
            )}
          >
            <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm flex-1 leading-relaxed">{a.message}</p>
            <button type="button" onClick={() => setHidden((s) => new Set(s).add(a.id))} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
