import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BRANCHES } from "@/lib/constants";

export type BranchOption = {
  code: string;
  name: string;
  icon: string;
  enabled: boolean;
  visible: boolean;
  uploads_enabled: boolean;
};

const FALLBACK = BRANCHES.map((b) => ({
  code: b.code,
  name: b.name,
  icon: b.icon,
  enabled: true,
  visible: true,
  uploads_enabled: true,
}));

let cachedRows: BranchOption[] | null = null;
let cacheAt = 0;
const TTL_MS = 5 * 60 * 1000;

async function fetchBranchRows(): Promise<BranchOption[]> {
  if (cachedRows && Date.now() - cacheAt < TTL_MS) return cachedRows;
  const { data } = await supabase.from("branch_settings").select("code,name,icon,enabled,visible,uploads_enabled").order("code");
  if (data?.length) {
    cachedRows = data.map((r) => ({
      code: r.code,
      name: r.name,
      icon: r.icon || "📚",
      enabled: r.enabled,
      visible: r.visible,
      uploads_enabled: r.uploads_enabled,
    }));
    cacheAt = Date.now();
    return cachedRows;
  }
  return FALLBACK;
}

export function useBranches(opts?: { admin?: boolean; forUpload?: boolean }) {
  const [branches, setBranches] = useState<BranchOption[]>(cachedRows ?? FALLBACK);
  const [loading, setLoading] = useState(!cachedRows);

  useEffect(() => {
    let cancelled = false;
    fetchBranchRows().then((list) => {
      if (cancelled) return;
      let filtered = list;
      if (!opts?.admin) {
        filtered = list.filter((b) => b.visible && b.enabled);
        if (opts?.forUpload) filtered = filtered.filter((b) => b.uploads_enabled);
      }
      setBranches(filtered);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [opts?.admin, opts?.forUpload]);

  return { branches, loading };
}
