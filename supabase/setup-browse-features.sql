-- Browse page: announcements + multi-branch datesheets

CREATE TABLE IF NOT EXISTS public.site_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  announcement_type TEXT NOT NULL DEFAULT 'info',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.site_announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS site_announcements_select ON public.site_announcements;
DROP POLICY IF EXISTS site_announcements_admin ON public.site_announcements;

CREATE POLICY site_announcements_select ON public.site_announcements
  FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY site_announcements_admin ON public.site_announcements
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.datesheets
  ADD COLUMN IF NOT EXISTS branches TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS publish_group_id UUID;

CREATE INDEX IF NOT EXISTS idx_datesheets_publish_group ON public.datesheets(publish_group_id);

UPDATE public.datesheets
SET branches = ARRAY[branch]
WHERE branches IS NULL OR branches = '{}';
