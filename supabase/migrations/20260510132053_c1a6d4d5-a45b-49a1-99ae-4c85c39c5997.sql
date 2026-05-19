
-- Roles enum + table
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

-- Profiles
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

-- Auto-create profile + default user role on signup
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

-- Lock datesheets to admin writes
DROP POLICY IF EXISTS datesheets_insert_all ON public.datesheets;
DROP POLICY IF EXISTS datesheets_update_all ON public.datesheets;
DROP POLICY IF EXISTS datesheets_delete_all ON public.datesheets;
CREATE POLICY "datesheets_admin_write" ON public.datesheets FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "datesheets_admin_update" ON public.datesheets FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "datesheets_admin_delete" ON public.datesheets FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Subject units (admin-defined)
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

-- Repeated questions (open contributions + upvotes)
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

-- Vote count trigger
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
