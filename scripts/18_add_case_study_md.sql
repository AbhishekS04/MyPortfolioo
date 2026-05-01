-- Add Markdown case study content to projects.
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS case_study_md text;
