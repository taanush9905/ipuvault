
-- Per-user paper upvotes and stars (counts on papers updated via triggers)
CREATE TABLE public.paper_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(paper_id, user_id)
);

CREATE TABLE public.paper_stars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(paper_id, user_id)
);

ALTER TABLE public.paper_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_stars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "paper_upvotes_select_all" ON public.paper_upvotes FOR SELECT USING (true);
CREATE POLICY "paper_upvotes_insert_own" ON public.paper_upvotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "paper_upvotes_delete_own" ON public.paper_upvotes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "paper_stars_select_all" ON public.paper_stars FOR SELECT USING (true);
CREATE POLICY "paper_stars_insert_own" ON public.paper_stars FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "paper_stars_delete_own" ON public.paper_stars FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_paper_upvotes()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.papers SET upvotes = upvotes + 1 WHERE id = NEW.paper_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.papers SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = OLD.paper_id;
  END IF;
  RETURN NULL;
END; $$;

CREATE OR REPLACE FUNCTION public.update_paper_stars()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.papers SET stars = stars + 1 WHERE id = NEW.paper_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.papers SET stars = GREATEST(stars - 1, 0) WHERE id = OLD.paper_id;
  END IF;
  RETURN NULL;
END; $$;

CREATE TRIGGER paper_upvotes_count AFTER INSERT OR DELETE ON public.paper_upvotes
FOR EACH ROW EXECUTE FUNCTION public.update_paper_upvotes();

CREATE TRIGGER paper_stars_count AFTER INSERT OR DELETE ON public.paper_stars
FOR EACH ROW EXECUTE FUNCTION public.update_paper_stars();

-- Allow anyone to bump download counts (RLS blocks direct paper updates for non-admins)
CREATE OR REPLACE FUNCTION public.increment_paper_downloads(paper_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.papers SET downloads = downloads + 1 WHERE id = paper_id;
END; $$;

GRANT EXECUTE ON FUNCTION public.increment_paper_downloads(uuid) TO anon, authenticated;
