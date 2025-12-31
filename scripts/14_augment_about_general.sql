-- Augment the about_general table with missing contact fields

DO $$
BEGIN
    -- Add Phone Number
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_general' AND column_name = 'phone_number') THEN
        ALTER TABLE public.about_general ADD COLUMN phone_number text default '+91 0000000000';
    END IF;

    -- Add Location
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_general' AND column_name = 'location') THEN
        ALTER TABLE public.about_general ADD COLUMN location text default 'Kolkata, India';
    END IF;

    -- Add Birthday (for dynamic Age calculation)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_general' AND column_name = 'birthday') THEN
        ALTER TABLE public.about_general ADD COLUMN birthday date default '2003-01-01';
    END IF;

    -- Add User ID for RLS ownership (Optional but good practice, though we use role check now)
    -- Skipping for now to keep it simple as it's a single-user portfolio
END $$;
