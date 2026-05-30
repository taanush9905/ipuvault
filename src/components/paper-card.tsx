import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Download, FileText, Eye, Calendar, Trash2, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BranchMultiPicker } from "@/components/branch-multi-picker";
import { useBranches } from "@/lib/use-branches";
import { publishPaperToMoreBranches } from "@/lib/publish-branches";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { initials, timeAgo } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { prefetchPaperUrl } from "@/lib/paper-url-cache";

export type Paper = {
  id: string;
  branch?: string;
  semester?: number;
  publish_group_id?: string | null;
  subject: string;
  exam_type: string;
  year: number;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  file_path: string;
  uploader_name: string;
  views?: number;
  downloads: number;
  stars: number;
  created_at: string;
  uploader_id?: string | null;
  file_size?: number | null;
  approved?: boolean;
};

type Props = {
  paper: Paper;
  onOpen: (p: Paper) => void;
  onDeleted?: (id: string) => void;
  starred?: boolean;
  onStarChange?: (paperId: string, starred: boolean) => void;
};

function PaperCardInner({ paper, onOpen, onDeleted, starred = false, onStarChange }: Props) {
  const nav = useNavigate();
  const { user, isAdmin } = useAuth();
  const [starCount, setStarCount] = useState(paper.stars);
  const { branches: branchOptions } = useBranches({ admin: true });
  const [branchDialog, setBranchDialog] = useState(false);
  const [extraBranches, setExtraBranches] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const canDelete = !!(isAdmin || (user && paper.uploader_id && user.id === paper.uploader_id));
  const branchTags = (paper.tags || []).filter((t) => t.startsWith("branch-"));
  const sharedCount = branchTags.length;
  const isShared = sharedCount > 1 || (paper.tags || []).includes("shared-across-branches");

  async function toggleStar(e: React.MouseEvent) {
    e.stopPropagation();
    if (!user) { toast.error("Sign in to star papers"); nav("/auth"); return; }
    if (starred) {
      const { error } = await supabase.from("paper_stars").delete().eq("paper_id", paper.id).eq("user_id", user.id);
      if (error) return toast.error(error.message);
      setStarCount((c) => Math.max(0, c - 1));
      onStarChange?.(paper.id, false);
      toast.success("Removed from starred");
    } else {
      const { error } = await supabase.from("paper_stars").insert({ paper_id: paper.id, user_id: user.id });
      if (error) return toast.error(error.message);
      setStarCount((c) => c + 1);
      onStarChange?.(paper.id, true);
      toast.success("Saved to starred");
    }
  }

  async function handlePublishBranches(e: React.MouseEvent) {
    e.stopPropagation();
    if (!extraBranches.length) return toast.error("Select at least one branch");
    setPublishing(true);
    try {
      const { inserted } = await publishPaperToMoreBranches(paper, extraBranches);
      toast.success(inserted ? `Added to ${inserted} branch(es)` : "Already published in those branches");
      setBranchDialog(false);
      setExtraBranches([]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not publish");
    } finally {
      setPublishing(false);
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
      onMouseEnter={() => paper.file_path && prefetchPaperUrl(paper.file_path)}
      className="group cursor-pointer rounded-xl border bg-card p-5 hover:border-primary/40 hover:shadow-soft transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-lg gradient-primary grid place-items-center text-primary-foreground shrink-0 shadow-soft">
          <FileText className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold truncate">{paper.title || paper.subject}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
            <Badge variant="secondary" className="font-medium">{paper.exam_type}</Badge>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{paper.year}</span>
            {isShared && (
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                {sharedCount > 1 ? `Available in ${sharedCount} branches` : "Shared across branches"}
              </Badge>
            )}
            <span>· {timeAgo(paper.created_at)}</span>
          </div>

          {paper.description ? (
            <p className="text-xs leading-relaxed line-clamp-2 mt-3 text-muted-foreground">{paper.description}</p>
          ) : null}

          <div className="flex items-center justify-between mt-4 gap-2 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-full bg-accent text-accent-foreground grid place-items-center text-xs font-semibold shrink-0">
                {initials(paper.uploader_name)}
              </div>
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">{paper.uploader_name}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
              <span className="inline-flex items-center gap-1 rounded-lg border bg-muted/50 px-2 py-1" title="Views">
                <Eye className="h-3.5 w-3.5" />
                {paper.views ?? 0}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border bg-muted/50 px-2 py-1" title="Downloads">
                <Download className="h-3.5 w-3.5" />
                {paper.downloads}
              </span>
              <Button variant="ghost" size="sm" onClick={toggleStar} className={cn("h-8 px-2 gap-1", starred && "text-warning")} title="Star">
                <Star className={cn("h-4 w-4", starred && "fill-current")} />
                <span>{starCount}</span>
              </Button>
              {isAdmin && (
                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={(e) => { e.stopPropagation(); setBranchDialog(true); }}>
                  <Layers className="h-4 w-4" />
                </Button>
              )}
              {canDelete && (
                <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={branchDialog} onOpenChange={setBranchDialog}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Publish to more branches</DialogTitle>
          </DialogHeader>
          <BranchMultiPicker branches={branchOptions.filter((b) => b.code !== paper.branch)} selected={extraBranches} onChange={setExtraBranches} />
          <Button onClick={handlePublishBranches} disabled={publishing} className="w-full rounded-xl">
            {publishing ? "Publishing…" : "Publish to selected branches"}
          </Button>
        </DialogContent>
      </Dialog>
    </article>
  );
}

export const PaperCard = memo(PaperCardInner);
