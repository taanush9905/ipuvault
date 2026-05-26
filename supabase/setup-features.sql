-- Run in Supabase SQL Editor after setup-all.sql

-- Public feedback (no login)
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  feedback TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS feedbacks_insert_public ON public.feedbacks;
DROP POLICY IF EXISTS feedbacks_select_admin ON public.feedbacks;

CREATE POLICY feedbacks_insert_public ON public.feedbacks
  FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(trim(name)) > 0 AND char_length(trim(feedback)) > 0);

CREATE POLICY feedbacks_select_admin ON public.feedbacks
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Anonymous paper uploads (no account required)
DROP POLICY IF EXISTS papers_insert_anonymous ON public.papers;

CREATE POLICY papers_insert_anonymous ON public.papers
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NULL AND uploader_id IS NULL AND approved = false)
    OR (auth.uid() IS NOT NULL AND auth.uid() = uploader_id)
  );
