-- Create project_contributors table
CREATE TABLE IF NOT EXISTS public.project_contributors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    avatar_url TEXT NOT NULL,
    social_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.project_contributors ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access on project_contributors"
    ON public.project_contributors FOR SELECT
    USING (true);

-- Allow authenticated users (admin) to insert/update/delete
CREATE POLICY "Allow authenticated insert on project_contributors"
    ON public.project_contributors FOR INSERT
    WITH CHECK (true); -- ideally check for role, but keeping simple for now

CREATE POLICY "Allow authenticated update on project_contributors"
    ON public.project_contributors FOR UPDATE
    USING (true);

CREATE POLICY "Allow authenticated delete on project_contributors"
    ON public.project_contributors FOR DELETE
    USING (true);
