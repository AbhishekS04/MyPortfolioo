-- Add enhanced contact page fields
ALTER TABLE public.profile 
ADD COLUMN IF NOT EXISTS is_available boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{"github": "https://github.com", "x": "https://x.com", "linkedin": "https://linkedin.com", "dribbble": "https://dribbble.com"}'::jsonb;

-- Update existing row to defaults if null (optional safety)
UPDATE public.profile 
SET 
  is_available = COALESCE(is_available, true),
  social_links = COALESCE(social_links, '{"github": "https://github.com", "x": "https://x.com", "linkedin": "https://linkedin.com", "dribbble": "https://dribbble.com"}'::jsonb)
WHERE id IS NOT NULL;
