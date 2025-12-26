-- Add contact page specific fields to the profile table
ALTER TABLE public.profile 
ADD COLUMN IF NOT EXISTS contact_heading text DEFAULT 'Let’s build something meaningful.',
ADD COLUMN IF NOT EXISTS availability_items text[] DEFAULT ARRAY['Internships', 'Freelance', 'Consulting'];

-- Update the existing row if simpler, or just defaults handle it.
-- Ensure RLS allows update (assuming existing policies cover 'profile' table for authenticated users)
