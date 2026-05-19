-- PYQ Vault: run this ONCE in Supabase Dashboard → SQL Editor → Run
-- Project: https://supabase.com/dashboard/project/sdflcuulikrzvwtwsdcb

-- ========== 1. Core tables ==========

CREATE TABLE public.papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program TEXT NOT NULL DEFAULT 'BTech',
  branch TEXT NOT NULL,
  semester INT NOT NULL,
  section TEXT NOT NULL,
  subject TEXT NOT NULL,
  year INT NOT NULL,
  exam_type TEXT NOT NULL,
  title TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  file_path TEXT NOT NULL,
  file_size INT,
  uploader_name TEXT NOT NULL DEFAULT 'Anonymous',
  upvotes INT NOT NULL DEFAULT 0,
  downloads INT NOT NULL DEFAULT 0,
  stars INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_papers_filter ON public.papers(branch, semester, section, subject);
CREATE INDEX idx_papers_created ON public.papers(created_at DESC);

ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "papers_select_all" ON public.papers FOR SELECT USING (true);
CREATE POLICY "papers_insert_all" ON public.papers FOR INSERT WITH CHECK (true);
CREATE POLICY "papers_update_all" ON public.papers FOR UPDATE USING (true);
CREATE POLICY "papers_delete_all" ON public.papers FOR DELETE USING (true);

CREATE TABLE public.datesheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch TEXT NOT NULL,
  semester INT NOT NULL,
  section TEXT NOT NULL,
  exam_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  exam_date DATE NOT NULL,
  exam_time TEXT,
  venue TEXT,
  created_by_name TEXT NOT NULL DEFAULT 'Anonymous',
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_datesheets_filter ON public.datesheets(branch, semester, section, exam_date);

ALTER TABLE public.datesheets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "datesheets_select_all" ON public.datesheets FOR SELECT USING (true);
CREATE POLICY "datesheets_insert_all" ON public.datesheets FOR INSERT WITH CHECK (true);
CREATE POLICY "datesheets_update_all" ON public.datesheets FOR UPDATE USING (true);
CREATE POLICY "datesheets_delete_all" ON public.datesheets FOR DELETE USING (true);

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID NOT NULL REFERENCES public.papers(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_paper ON public.comments(paper_id, created_at);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_select_all" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_all" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "comments_delete_all" ON public.comments FOR DELETE USING (true);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('papers', 'papers', true, 20971520, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "papers_storage_select" ON storage.objects FOR SELECT USING (bucket_id = 'papers');
CREATE POLICY "papers_storage_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'papers');
CREATE POLICY "papers_storage_delete" ON storage.objects FOR DELETE USING (bucket_id = 'papers');

-- ========== 2. Auth, profiles, roles ==========

CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "roles_admin_all" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  email TEXT,
  branch TEXT,
  semester INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP POLICY IF EXISTS datesheets_insert_all ON public.datesheets;
DROP POLICY IF EXISTS datesheets_update_all ON public.datesheets;
DROP POLICY IF EXISTS datesheets_delete_all ON public.datesheets;
CREATE POLICY "datesheets_admin_write" ON public.datesheets FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "datesheets_admin_update" ON public.datesheets FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "datesheets_admin_delete" ON public.datesheets FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.subject_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch TEXT NOT NULL,
  semester INT NOT NULL,
  subject TEXT NOT NULL,
  unit_number INT NOT NULL,
  unit_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(branch, semester, subject, unit_number)
);
ALTER TABLE public.subject_units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "units_select_all" ON public.subject_units FOR SELECT USING (true);
CREATE POLICY "units_admin_write" ON public.subject_units FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "units_admin_update" ON public.subject_units FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "units_admin_delete" ON public.subject_units FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.repeated_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch TEXT NOT NULL,
  semester INT NOT NULL,
  subject TEXT NOT NULL,
  unit_number INT,
  question TEXT NOT NULL,
  years INT[] DEFAULT '{}',
  marks INT,
  notes TEXT,
  contributor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  contributor_name TEXT NOT NULL DEFAULT 'Anonymous',
  upvotes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.repeated_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rq_select_all" ON public.repeated_questions FOR SELECT USING (true);
CREATE POLICY "rq_insert_auth" ON public.repeated_questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = contributor_id);
CREATE POLICY "rq_update_own_or_admin" ON public.repeated_questions FOR UPDATE TO authenticated USING (auth.uid() = contributor_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "rq_delete_own_or_admin" ON public.repeated_questions FOR DELETE TO authenticated USING (auth.uid() = contributor_id OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.repeated_question_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.repeated_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(question_id, user_id)
);
ALTER TABLE public.repeated_question_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rqv_select_all" ON public.repeated_question_votes FOR SELECT USING (true);
CREATE POLICY "rqv_insert_own" ON public.repeated_question_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rqv_delete_own" ON public.repeated_question_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_rq_upvotes()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.repeated_questions SET upvotes = upvotes + 1 WHERE id = NEW.question_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.repeated_questions SET upvotes = GREATEST(upvotes - 1, 0) WHERE id = OLD.question_id;
  END IF;
  RETURN NULL;
END; $$;

CREATE TRIGGER rqv_count AFTER INSERT OR DELETE ON public.repeated_question_votes
FOR EACH ROW EXECUTE FUNCTION public.update_rq_upvotes();

-- ========== 3. Paper approval + subjects ==========

ALTER TABLE public.papers
  ADD COLUMN IF NOT EXISTS approved boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS uploader_id uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid;

DROP POLICY IF EXISTS papers_select_all ON public.papers;
DROP POLICY IF EXISTS papers_insert_all ON public.papers;
DROP POLICY IF EXISTS papers_update_all ON public.papers;
DROP POLICY IF EXISTS papers_delete_all ON public.papers;

CREATE POLICY papers_select_approved_or_owner_or_admin ON public.papers
  FOR SELECT TO public
  USING (
    approved = true
    OR (auth.uid() IS NOT NULL AND auth.uid() = uploader_id)
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY papers_insert_auth ON public.papers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY papers_update_admin ON public.papers
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY papers_delete_admin_or_owner ON public.papers
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = uploader_id);

CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch text NOT NULL,
  semester integer NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (branch, semester, name)
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subjects_select_all" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "subjects_admin_insert" ON public.subjects FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "subjects_admin_update" ON public.subjects FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "subjects_admin_delete" ON public.subjects FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_subjects_branch_sem ON public.subjects (branch, semester);

ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS hidden boolean NOT NULL DEFAULT false;

-- ========== 4. Paper votes ==========

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

CREATE OR REPLACE FUNCTION public.increment_paper_downloads(paper_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.papers SET downloads = downloads + 1 WHERE id = paper_id;
END; $$;

GRANT EXECUTE ON FUNCTION public.increment_paper_downloads(uuid) TO anon, authenticated;
