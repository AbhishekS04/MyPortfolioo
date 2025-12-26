-- Add detailed fields to projects table
DO $$ BEGIN
    -- Routing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'slug') THEN
        ALTER TABLE public.projects ADD COLUMN slug text;
        -- Create unique index for slug
        CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_idx ON public.projects (slug);
    END IF;

    -- Meta & External
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'project_type') THEN
        ALTER TABLE public.projects ADD COLUMN project_type text DEFAULT 'Personal'; -- 'Client' or 'Personal'
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'client_name') THEN
        ALTER TABLE public.projects ADD COLUMN client_name text;
    END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'external_link_label') THEN
        ALTER TABLE public.projects ADD COLUMN external_link_label text DEFAULT 'Live Demo';
    END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'external_link_url') THEN
        ALTER TABLE public.projects ADD COLUMN external_link_url text;
    END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'github_url') THEN
        ALTER TABLE public.projects ADD COLUMN github_url text;
    END IF;

    -- Media
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'video_url') THEN
        ALTER TABLE public.projects ADD COLUMN video_url text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'media_mode') THEN
        ALTER TABLE public.projects ADD COLUMN media_mode text DEFAULT 'gallery'; -- 'video_first', 'gallery'
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'gallery_images') THEN
        ALTER TABLE public.projects ADD COLUMN gallery_images text[] DEFAULT '{}';
    END IF;

    -- Rich Content
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'overview') THEN
        ALTER TABLE public.projects ADD COLUMN overview text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'problem_statement') THEN
        ALTER TABLE public.projects ADD COLUMN problem_statement text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'approach') THEN
        ALTER TABLE public.projects ADD COLUMN approach text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'features') THEN
        ALTER TABLE public.projects ADD COLUMN features text; -- Store as text or JSON, text is fine for simple lists
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'challenges') THEN
        ALTER TABLE public.projects ADD COLUMN challenges text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'outcome') THEN
        ALTER TABLE public.projects ADD COLUMN outcome text;
    END IF;

END $$;
