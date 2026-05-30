-- Paper view counts (replaces upvote display for users)

ALTER TABLE public.papers
  ADD COLUMN IF NOT EXISTS views INT NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_paper_views(paper_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  fp TEXT;
  gid UUID;
BEGIN
  SELECT file_path, publish_group_id INTO fp, gid FROM public.papers WHERE id = paper_id;
  IF fp IS NULL THEN RETURN; END IF;
  IF gid IS NOT NULL THEN
    UPDATE public.papers SET views = views + 1 WHERE publish_group_id = gid;
  ELSE
    UPDATE public.papers SET views = views + 1 WHERE file_path = fp;
  END IF;
END; $$;

GRANT EXECUTE ON FUNCTION public.increment_paper_views(uuid) TO anon, authenticated;
