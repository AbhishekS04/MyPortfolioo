-- FIX RLS POLICIES FOR ADMIN ACCESS
-- The previous scripts enabled "Public Read" but didn't explicitly enable "Authenticated Write".
-- This script fixes the "404" or "Not Saved" issues by allowing logged-in users (Admin) to Edit/Delete.

-- PROJECTS
drop policy if exists "Allow authenticated full access on projects" on public.projects;
create policy "Allow authenticated full access on projects"
  on public.projects
  for all
  using (auth.role() = 'authenticated');

-- SKILLS
drop policy if exists "Allow authenticated full access on skills" on public.skills;
create policy "Allow authenticated full access on skills"
  on public.skills
  for all
  using (auth.role() = 'authenticated');

-- PROFILE
drop policy if exists "Allow authenticated full access on profile" on public.profile;
create policy "Allow authenticated full access on profile"
  on public.profile
  for all
  using (auth.role() = 'authenticated');

-- TECH STACK
drop policy if exists "Allow authenticated full access on tech_stack" on public.tech_stack;
create policy "Allow authenticated full access on tech_stack"
  on public.tech_stack
  for all
  using (auth.role() = 'authenticated');

-- SOCIAL STORIES
drop policy if exists "Allow authenticated full access on social_stories" on public.social_stories;
create policy "Allow authenticated full access on social_stories"
  on public.social_stories
  for all
  using (auth.role() = 'authenticated');

-- GALLERY IMAGES
drop policy if exists "Allow authenticated full access on gallery_images" on public.gallery_images;
create policy "Allow authenticated full access on gallery_images"
  on public.gallery_images
  for all
  using (auth.role() = 'authenticated');

-- Verify RLS is enabled
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.profile enable row level security;
alter table public.tech_stack enable row level security;
alter table public.social_stories enable row level security;
alter table public.gallery_images enable row level security;
