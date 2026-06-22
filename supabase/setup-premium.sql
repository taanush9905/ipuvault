-- Premium platform: contributions, branch settings, multi-branch publish groups

-- Contribution requests (non-admin users)
CREATE TABLE IF NOT EXISTS public.contribution_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_name TEXT NOT NULL,
  requester_email TEXT,
  branch TEXT,
  semester INT,
  subject TEXT,
  year INT,
  exam_type TEXT,
  title TEXT,
  description TEXT,
  message TEXT,
  file_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contribution_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS contribution_requests_insert ON public.contribution_requests;
DROP POLICY IF EXISTS contribution_requests_admin ON public.contribution_requests;

CREATE POLICY contribution_requests_insert ON public.contribution_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(trim(requester_name)) > 0);

CREATE POLICY contribution_requests_admin ON public.contribution_requests
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Branch admin settings
CREATE TABLE IF NOT EXISTS public.branch_settings (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📚',
  enabled BOOLEAN NOT NULL DEFAULT true,
  visible BOOLEAN NOT NULL DEFAULT true,
  uploads_enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.branch_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS branch_settings_select ON public.branch_settings;
DROP POLICY IF EXISTS branch_settings_admin ON public.branch_settings;

CREATE POLICY branch_settings_select ON public.branch_settings
  FOR SELECT USING (visible = true OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY branch_settings_admin ON public.branch_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Seed branches (upsert)
INSERT INTO public.branch_settings (code, name, icon) VALUES
  ('CSE', 'Computer Science', '💻'),
  ('CST', 'Computer Sci. & Tech.', '🖥️'),
  ('IT', 'Information Technology', '🌐'),
  ('ECE', 'Electronics & Comm.', '📡'),
  ('EE', 'Electrical Engineering', '⚡'),
  ('EEE', 'Electrical & Electronics', '🔌'),
  ('ICE', 'Instrumentation & Control', '🎛️'),
  ('ME', 'Mechanical Engineering', '⚙️'),
  ('CE', 'Civil Engineering', '🏗️'),
  ('MAE', 'Mechanical & Automation', '🤖')
ON CONFLICT (code) DO NOTHING;

-- Multi-branch publish group (same file, linked rows)
ALTER TABLE public.papers
  ADD COLUMN IF NOT EXISTS publish_group_id UUID;

CREATE INDEX IF NOT EXISTS idx_papers_publish_group ON public.papers(publish_group_id);

ALTER TABLE public.repeated_questions
  ADD COLUMN IF NOT EXISTS branches TEXT[] DEFAULT '{}';

-- Backfill branches array from single branch
UPDATE public.repeated_questions
SET branches = ARRAY[branch]
WHERE branches IS NULL OR branches = '{}';

-- Apply migrations if table already existed
ALTER TABLE public.contribution_requests ADD COLUMN IF NOT EXISTS file_path TEXT;
UPDATE storage.buckets SET file_size_limit = 26214400 WHERE id = 'papers';
