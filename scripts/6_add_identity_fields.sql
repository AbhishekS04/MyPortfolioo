-- Add identity fields to profile table
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'full_name') THEN
        ALTER TABLE public.profile ADD COLUMN full_name text DEFAULT 'Abhishek Singh';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'role_title') THEN
        ALTER TABLE public.profile ADD COLUMN role_title text DEFAULT 'Frontend Engineer &';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'role_subtitle') THEN
        ALTER TABLE public.profile ADD COLUMN role_subtitle text DEFAULT 'Ui System Designer.';
    END IF;
END $$;
