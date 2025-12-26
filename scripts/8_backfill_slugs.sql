-- Backfill slugs for existing projects
UPDATE public.projects
SET slug = lower(
    regexp_replace(
        regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), -- Remove special chars
        '\s+', '-', 'g' -- Replace spaces with hyphens
    )
)
WHERE slug IS NULL OR slug = '';

-- Ensure no duplicate slugs (simple check, appending id if needed could be complex, assuming titles are unique enough for now)
-- If you have duplicate titles, this might fail on the unique constraint.
-- If it fails, manually edit the titles or slugs.


