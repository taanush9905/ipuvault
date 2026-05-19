import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThumbsUp, Star, Download, FileText, Eye, Calendar, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { initials, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

export type Paper = {
  id: string;
  subject: string;
  exam_type: string;
  year: number;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  file_path: string;
  uploader_name: string;
  upvotes: number;
  downloads: number;
  stars: number;
  created_at: string;
  uploader_id?: string | null;
  file_size?: number | null;
};

export function PaperCard({ paper, onOpen, onDeleted }: { paper: Paper; onOpen: (p: Paper) => void; onDeleted?: (id: string) => void }) {
  const nav = useNavigate();
  const { user, isAdmin } = useAuth();
  const [up, setUp] = useState({ on: false, count: paper.upvotes });
  const [st, setSt] = useState({ on: false, count: paper.stars });
  const canDelete = !!(isAdmin || (user && paper.uploader_id && user.id === paper.uploader_id));

  useEffect(() => {
    setUp((s) => ({ ...s, count: paper.upvotes }));
    setSt((s) => ({ ...s, count: paper.stars }));
  }, [paper.upvotes, paper.stars]);

  useEffect(() => {
    if (!user) {
      setUp((s) => ({ ...s, on: false }));
      setSt((s) => ({ ...s, on: false }));
      return;
    }
    (async () => {
      const [{ data: ups }, { data: sts }] = await Promise.all([
        supabase.from("paper_upvotes").select("paper_id").eq("user_id", user.id).eq("paper_id", paper.id),
        supabase.from("paper_stars").select("paper_id").eq("user_id", user.id).eq("paper_id", paper.id),
      ]);
      setUp((s) => ({ ...s, on: (ups?.length ?? 0) > 0 }));
      setSt((s) => ({ ...s, on: (sts?.length ?? 0) > 0 }));
    })();
  }, [user, paper.id]);

  async function toggleUpvote(e: React.MouseEvent) {
    e.stopPropagation();
    if (!user) { toast.error("Sign in to upvote"); nav("/auth"); return; }
    const has = up.on;
    if (has) {
      const { error } = await supabase.from("paper_upvotes").delete().eq("paper_id", paper.id).eq("user_id", user.id);
      if (error) return toast.error(error.message);
      setUp({ on: false, count: Math.max(0, up.count - 1) });
    } else {
      const { error } = await supabase.from("paper_upvotes").insert({ paper_id: paper.id, user_id: user.id });
      if (error) return toast.error(error.message);
      setUp({ on: true, count: up.count + 1 });
    }
  }

  async function toggleStar(e: React.MouseEvent) {
    e.stopPropagation();
    if (!user) { toast.error("Sign in to star papers"); nav("/auth"); return; }
    const has = st.on;
    if (has) {
      const { error } = await supabase.from("paper_stars").delete().eq("paper_id", paper.id).eq("user_id", user.id);
      if (error) return toast.error(error.message);
      setSt({ on: false, count: Math.max(0, st.count - 1) });
      toast.success("Removed from starred");
    } else {
      const { error } = await supabase.from("paper_stars").insert({ paper_id: paper.id, user_id: user.id });
      if (error) return toast.error(error.message);
      setSt({ on: true, count: st.count + 1 });
      toast.success("Saved to starred");
    }
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Delete this paper permanently?")) return;
    if (paper.file_path) await supabase.storage.from("papers").remove([paper.file_path]);
    const { error } = await supabase.from("papers").delete().eq("id", paper.id);
    if (error) return toast.error(error.message);
    toast.success("Paper deleted");
    onDeleted?.(paper.id);
  }

  return (
    <article
      onClick={() => onOpen(paper)}
      className="group cursor-pointer rounded-xl border bg-card p-5 hover:border-primary/40 hover:shadow-soft transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-lg gradient-primary grid place-items-center text-primary-foreground shrink-0 shadow-soft">
          <FileText className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{paper.title || paper.subject}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                <Badge variant="secondary" className="font-medium">{paper.exam_type}</Badge>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{paper.year}</span>
                <span>· {timeAgo(paper.created_at)}</span>
              </div>
            </div>
          </div>


          {paper.description ? (
            <div className="mt-3 rounded-lg border bg-accent/40 px-3 py-2">
              <div className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground mb-0.5">Description</div>
              <p className="text-xs leading-relaxed line-clamp-3 whitespace-pre-wrap">{paper.description}</p>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground italic mt-3">No description provided.</p>
          )}

          {paper.tags && paper.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {paper.tags.slice(0, 4).map((t) => (
                <Badge key={t} variant="outline" className="text-[10px] px-1.5 py-0">#{t}</Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-accent text-accent-foreground grid place-items-center text-xs font-semibold">
                {initials(paper.uploader_name)}
              </div>
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">{paper.uploader_name}</span>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={toggleUpvote} className={cn("h-8 px-2 gap-1", up.on && "text-primary")}>
                <ThumbsUp className={cn("h-4 w-4", up.on && "fill-current")} />
                <span className="text-xs">{up.count}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleStar} className={cn("h-8 px-2 gap-1", st.on && "text-warning")}>
                <Star className={cn("h-4 w-4", st.on && "fill-current")} />
              </Button>
              <div className="hidden sm:flex items-center gap-1 px-2 text-xs text-muted-foreground">
                <Download className="h-3.5 w-3.5" />
                {paper.downloads}
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={(e) => { e.stopPropagation(); onOpen(paper); }}>
                <Eye className="h-4 w-4" />
              </Button>
              {canDelete && (
                <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive hover:text-destructive" onClick={handleDelete} aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
