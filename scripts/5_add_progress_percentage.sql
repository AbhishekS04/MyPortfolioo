-- Add progress_percentage column to projects table
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'progress_percentage') THEN
        ALTER TABLE public.projects ADD COLUMN progress_percentage integer DEFAULT 0;
    END IF;
END $$;
