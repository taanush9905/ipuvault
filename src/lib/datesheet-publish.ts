import { supabase } from "@/integrations/supabase/client";
import { ALL_BRANCHES_CODE } from "@/lib/datesheet-label";

export type DatesheetPayload = {
  branch: string;
  branches: string[];
  semester: number;
  section?: string;
  exam_type: string;
  subject: string;
  exam_date: string;
  exam_time: string | null;
  venue: string | null;
  created_by_name: string;
  pinned?: boolean;
};

/** No branches selected → single row for all branches */
export async function insertDatesheetMulti(payload: DatesheetPayload) {
  const selected = payload.branches.filter(Boolean);
  const forAllBranches = selected.length === 0;

  if (forAllBranches) {
    const { error } = await supabase.from("datesheets").insert({
      branch: ALL_BRANCHES_CODE,
      branches: [ALL_BRANCHES_CODE],
      semester: payload.semester,
      section: payload.section ?? "-",
      exam_type: payload.exam_type,
      subject: payload.subject,
      exam_date: payload.exam_date,
      exam_time: payload.exam_time,
      venue: payload.venue,
      created_by_name: payload.created_by_name,
      pinned: payload.pinned ?? false,
      publish_group_id: null,
    });
    if (error) throw error;
    return 1;
  }

  const publishGroupId = selected.length > 1 ? crypto.randomUUID() : null;
  const rows = selected.map((branch) => ({
    branch,
    branches: selected,
    semester: payload.semester,
    section: payload.section ?? "-",
    exam_type: payload.exam_type,
    subject: payload.subject,
    exam_date: payload.exam_date,
    exam_time: payload.exam_time,
    venue: payload.venue,
    created_by_name: payload.created_by_name,
    pinned: payload.pinned ?? false,
    publish_group_id: publishGroupId,
  }));

  const { error } = await supabase.from("datesheets").insert(rows);
  if (error) throw error;
  return selected.length;
}

export async function updateDatesheetGroup(
  id: string,
  existing: { publish_group_id?: string | null; branch: string },
  payload: DatesheetPayload
) {
  const groupId = existing.publish_group_id;

  if (groupId) {
    await supabase.from("datesheets").delete().eq("publish_group_id", groupId);
  } else {
    await supabase.from("datesheets").delete().eq("id", id);
  }

  return insertDatesheetMulti(payload);
}
