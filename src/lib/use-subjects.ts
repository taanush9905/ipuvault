import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSubjects as defaultSubjects } from "@/lib/constants";

export function useSubjects(branch: string, semester: number | null) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!branch || !semester) { setSubjects([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("subjects")
      .select("name, hidden")
      .eq("branch", branch)
      .eq("semester", semester);
    const rows = (data || []) as { name: string; hidden: boolean }[];
    const hidden = new Set(rows.filter((r) => r.hidden).map((r) => r.name));
    const added = rows.filter((r) => !r.hidden).map((r) => r.name);
    const defaults = defaultSubjects(branch, semester);
    const set = new Set<string>();
    const out: string[] = [];
    for (const n of [...defaults, ...added]) {
      if (hidden.has(n)) continue;
      if (set.has(n)) continue;
      set.add(n);
      out.push(n);
    }
    setSubjects(out);
    setLoading(false);
  }, [branch, semester]);

  useEffect(() => { refresh(); }, [refresh]);

  return { subjects, loading, refresh };
}
