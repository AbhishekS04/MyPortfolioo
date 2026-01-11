-- Add is_coming_soon column to projects table
ALTER TABLE projects 
ADD COLUMN is_coming_soon BOOLEAN DEFAULT FALSE;

-- Update existing records to have this set to false (handled by default, but good for clarity)
UPDATE projects SET is_coming_soon = FALSE WHERE is_coming_soon IS NULL;
