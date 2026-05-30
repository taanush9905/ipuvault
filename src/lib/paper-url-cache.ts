import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

export function getPaperPublicUrl(filePath: string): string {
  const hit = cache.get(filePath);
  if (hit) return hit;
  const { data } = supabase.storage.from("papers").getPublicUrl(filePath);
  cache.set(filePath, data.publicUrl);
  return data.publicUrl;
}

/** Fast: public URL immediately; upgrades to signed URL in background when needed. */
export function resolvePaperUrlFast(filePath: string): string {
  if (!filePath?.trim()) return "";
  return cache.get(filePath) ?? getPaperPublicUrl(filePath);
}

export async function resolvePaperUrl(filePath: string): Promise<string> {
  if (!filePath?.trim()) throw new Error("Missing file");
  const cached = cache.get(filePath);
  if (cached) return cached;

  const existing = inflight.get(filePath);
  if (existing) return existing;

  const promise = (async () => {
    const publicUrl = getPaperPublicUrl(filePath);
    const { data, error } = await supabase.storage.from("papers").createSignedUrl(filePath, 3600);
    const url = !error && data?.signedUrl ? data.signedUrl : publicUrl;
    cache.set(filePath, url);
    inflight.delete(filePath);
    return url;
  })();

  inflight.set(filePath, promise);
  return promise;
}

export function prefetchPaperUrl(filePath: string) {
  if (!filePath || cache.has(filePath)) return;
  const publicUrl = getPaperPublicUrl(filePath);
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = publicUrl;
  document.head.appendChild(link);
  void resolvePaperUrl(filePath).catch(() => {});
}
