import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePaperStars(paperIds: string[], userId?: string) {
  const [starred, setStarred] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId || paperIds.length === 0) {
      setStarred(new Set());
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("paper_stars")
        .select("paper_id")
        .eq("user_id", userId)
        .in("paper_id", paperIds);
      if (!cancelled) setStarred(new Set((data || []).map((r) => r.paper_id)));
    })();
    return () => { cancelled = true; };
  }, [userId, paperIds.join("|")]);

  return starred;
}
