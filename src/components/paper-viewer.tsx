import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, Share2, Flag, MessageSquare, Send, Eye, Loader2 } from "lucide-react";
import { resolvePaperUrl, resolvePaperUrlFast } from "@/lib/paper-url-cache";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { initials, timeAgo } from "@/lib/format";
import type { Paper } from "./paper-card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

type Comment = {
  id: string;
  paper_id: string;
  author_name: string;
  content: string;
  created_at: string;
};

type PaperWithDesc = Paper & { description?: string | null };

export function PaperViewer({ paper, onClose }: { paper: Paper | null; onClose: () => void }) {
  const { profile } = useAuth();
  const [url, setUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!paper) {
      setUrl(null);
      setLoadError(false);
      setComments([]);
      setDraft("");
      setShowComments(false);
      return;
    }

    setViewCount(paper.views ?? 0);
    setDownloadCount(paper.downloads);
    setComments([]);
    setDraft("");
    setShowComments(false);
    setLoadError(false);

    if (!paper.file_path) {
      setUrl(null);
      setLoadError(true);
      return;
    }

    // Show PDF immediately from public URL
    setUrl(resolvePaperUrlFast(paper.file_path));

    void supabase.rpc("increment_paper_views", { paper_id: paper.id }).then(({ error }) => {
      if (!error) setViewCount((c) => c + 1);
    });

    void resolvePaperUrl(paper.file_path)
      .then((signed) => setUrl(signed))
      .catch(() => setLoadError(true));

    void supabase
      .from("comments")
      .select("id,paper_id,author_name,content,created_at")
      .eq("paper_id", paper.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => setComments((data as Comment[]) || []));
  }, [paper]);

  async function handleDownload() {
    if (!paper) return;
    const href = url || resolvePaperUrlFast(paper.file_path);
    if (!href) return;
    try {
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.download = `${paper.subject}-${paper.year}-${paper.exam_type}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      void supabase.rpc("increment_paper_downloads", { paper_id: paper.id });
      setDownloadCount((c) => c + 1);
      toast.success("Download started");
    } catch {
      toast.error("Could not download");
    }
  }

  function handleShare() {
    if (!paper) return;
    navigator.clipboard.writeText(`${window.location.origin}/?paper=${paper.id}`);
    toast.success("Link copied to clipboard");
  }

  async function handleReport() {
    toast.success("Reported. Thanks for the heads up!");
  }

  async function postComment() {
    if (!paper || !draft.trim()) return;
    const { data, error } = await supabase
      .from("comments")
      .insert({ paper_id: paper.id, author_name: profile?.display_name || "Anonymous", content: draft.trim() })
      .select("id,paper_id,author_name,content,created_at")
      .single();
    if (error) { toast.error("Could not post comment"); return; }
    setComments((c) => [...c, data as Comment]);
    setDraft("");
  }

  return (
    <Dialog open={!!paper} onOpenChange={(o) => !o && onClose()}>
      <DialogContent hideClose className="max-w-6xl w-[95vw] h-[92vh] p-0 gap-0 flex flex-col overflow-hidden">
        {paper && (
          <>
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b shrink-0">
              <div className="min-w-0">
                <div className="font-semibold truncate">{paper.title || paper.subject}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">{paper.exam_type}</Badge>
                  <span>{paper.year}</span>
                  <span>· {paper.uploader_name}</span>
                  <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{viewCount} views</span>
                  <span className="inline-flex items-center gap-1"><Download className="h-3 w-3" />{downloadCount} downloads</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setShowComments((v) => !v)}>
                  <MessageSquare className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{comments.length}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReport}>
                  <Flag className="h-4 w-4" />
                </Button>
                <Button variant="default" size="sm" onClick={handleDownload} disabled={loadError && !url}>
                  <Download className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close viewer">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {(paper as PaperWithDesc).description && (
              <div className="px-4 py-3 border-b bg-accent/40 shrink-0">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">Description</div>
                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{(paper as PaperWithDesc).description}</p>
              </div>
            )}

            <div className="flex-1 flex min-h-0">
              <div className="flex-1 bg-muted relative">
                {loadError && !url && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Could not load this PDF.</p>
                    <Button variant="outline" onClick={handleDownload}>Try download</Button>
                  </div>
                )}
                {url && (
                  <iframe key={`${paper.id}-${url.slice(-24)}`} src={url} title={paper.subject} className="w-full h-full border-0" />
                )}
                {url && !loadError && (
                  <div className="absolute bottom-3 right-3 pointer-events-none opacity-0 animate-pulse">
                    <Loader2 className="h-4 w-4 hidden" />
                  </div>
                )}
              </div>
              {showComments && (
                <aside className="w-full sm:w-80 border-l bg-card flex flex-col shrink-0 max-w-full absolute sm:relative inset-0 sm:inset-auto sm:h-auto h-full z-10">
                  <div className="px-4 py-3 border-b flex items-center justify-between">
                    <div className="font-semibold text-sm">Comments</div>
                    <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setShowComments(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center mt-8">No comments yet.</p>
                    )}
                    {comments.map((c) => (
                      <div key={c.id} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground grid place-items-center text-xs font-semibold shrink-0">
                          {initials(c.author_name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium">{c.author_name}</span>
                            <span className="text-[10px] text-muted-foreground">{timeAgo(c.created_at)}</span>
                          </div>
                          <p className="text-sm mt-0.5 break-words">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t p-3 flex gap-2">
                    <Input
                      placeholder="Write a comment…"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && postComment()}
                    />
                    <Button size="icon" onClick={postComment} disabled={!draft.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </aside>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
