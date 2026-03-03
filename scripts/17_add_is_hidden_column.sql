-- Add missing is_hidden column to projects table
-- The application code queries .eq('is_hidden', false) but this column was never created
-- This causes queries to fail silently and return no data

ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

-- Update all existing projects to be visible
UPDATE public.projects SET is_hidden = FALSE WHERE is_hidden IS NULL;
