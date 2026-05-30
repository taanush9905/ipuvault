import { supabase } from "@/integrations/supabase/client";
import type { Paper } from "@/components/paper-card";

export async function publishPaperToMoreBranches(
  paper: Paper & { publish_group_id?: string | null; branch?: string; semester?: number },
  newBranches: string[]
) {
  const target = newBranches.filter((b) => b !== paper.branch);
  if (!target.length) return { inserted: 0 };

  const publishGroupId = paper.publish_group_id ?? crypto.randomUUID();

  const { data: existing } = await supabase
    .from("papers")
    .select("branch")
    .eq("file_path", paper.file_path);

  const taken = new Set((existing || []).map((r) => r.branch));
  const toAdd = target.filter((b) => !taken.has(b));
  if (!toAdd.length) return { inserted: 0 };

  const baseTags = (paper.tags || []).filter((t) => !t.startsWith("branch-"));
  const rows = toAdd.map((branch) => ({
    branch,
    semester: paper.semester,
    section: "-",
    subject: paper.subject,
    year: paper.year,
    exam_type: paper.exam_type,
    title: paper.title,
    description: paper.description,
    tags: [...baseTags, `branch-${branch.toLowerCase()}`, "shared-across-branches"],
    file_path: paper.file_path,
    file_size: paper.file_size ?? null,
    uploader_name: paper.uploader_name,
    uploader_id: paper.uploader_id ?? null,
    approved: true,
    publish_group_id: publishGroupId,
  }));

  const { error } = await supabase.from("papers").insert(rows);
  if (error) throw error;

  if (!paper.publish_group_id) {
    await supabase.from("papers").update({ publish_group_id: publishGroupId }).eq("id", paper.id);
  }

  return { inserted: toAdd.length };
}
