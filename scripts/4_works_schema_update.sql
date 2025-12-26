-- Add status enum type
DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('Not Started', 'In Progress', 'Near Completion', 'Completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS status project_status DEFAULT 'Not Started',
ADD COLUMN IF NOT EXISTS is_currently_working boolean DEFAULT false;

-- Create a partial index to ensure only one project is marked as currently working (optional but good for integrity, though logic can be handled in app)
-- CREATE UNIQUE INDEX IF NOT EXISTS one_currently_working_project ON public.projects (is_currently_working) WHERE (is_currently_working = true);
-- Commented out solely because user might want to toggle swtiching easily without constraint errors first, handled in Admin UI logic.

-- Grant permissions if necessary (usually public read is already set up for the table)
