-- Migration: Add file_path to contribution_requests and increase storage limit to 25MB

ALTER TABLE public.contribution_requests ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Update papers bucket file size limit to 25MB (26214400 bytes)
UPDATE storage.buckets
SET file_size_limit = 26214400
WHERE id = 'papers';
