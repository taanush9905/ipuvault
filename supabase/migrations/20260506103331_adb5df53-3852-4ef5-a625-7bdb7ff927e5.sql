
-- Papers table
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

-- Datesheets table
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

-- Comments table
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

-- Storage bucket for papers
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('papers', 'papers', true, 20971520, ARRAY['application/pdf']);

CREATE POLICY "papers_storage_select" ON storage.objects FOR SELECT USING (bucket_id = 'papers');
CREATE POLICY "papers_storage_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'papers');
CREATE POLICY "papers_storage_delete" ON storage.objects FOR DELETE USING (bucket_id = 'papers');
