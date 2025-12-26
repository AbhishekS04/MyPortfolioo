-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROJECTS TABLE
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  tech_stack text[] default '{}',
  image_url text not null,
  project_url text not null,
  featured boolean default false,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SKILLS TABLE
create table if not exists public.skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text default 'Other', -- e.g. 'Frontend', 'Backend', 'Tools'
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROFILE / CONFIG TABLE (Singleton for bio, etc.)
create table if not exists public.profile (
  id uuid default gen_random_uuid() primary key,
  bio_primary text not null,
  bio_secondary text,
  email text,
  resume_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ENABLE ROW LEVEL SECURITY
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.profile enable row level security;

-- CREATE POLICIES (Public Read, Admin Write)
-- Note: modifying these requires being logged into Supabase or using the service role key.
-- For now, we allow public read access to everything.

-- Projects
create policy "Allow public read access on projects"
  on public.projects for select
  using (true);

-- Skills
create policy "Allow public read access on skills"
  on public.skills for select
  using (true);

-- Profile
create policy "Allow public read access on profile"
  on public.profile for select
  using (true);


-- SEED DATA (Based on existing current data)

-- Projects Seed
insert into public.projects (title, description, tech_stack, image_url, project_url, featured, display_order)
values
  (
    'Lumina Interface',
    'A next-gen dashboard for light analytics.',
    ARRAY['Next.js', 'WebGL', 'Tailwind'],
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop',
    '/works/lumina',
    true,
    1
  ),
  (
    'Apex Finance',
    'Real-time trading platform with sub-ms latency.',
    ARRAY['React', 'Rust', 'WebSockets'],
    'https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2576&auto=format&fit=crop',
    '/works/apex',
    true,
    2
  ),
  (
    'Vocalize AI',
    'Voice synthesis engine for web applications.',
    ARRAY['Python', 'TensorFlow', 'React'],
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2664&auto=format&fit=crop',
    '/works/vocalize',
    true,
    3
  ),
  (
    'Orbit Design System',
    'A comprehensive design language for enterprise.',
    ARRAY['Figma', 'Storybook', 'React'],
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    '/works/orbit',
    true,
    4
  );

-- Skills Seed
insert into public.skills (name, category, display_order)
values
  ('Frontend Engineering', 'Core', 1),
  ('UI Systems & Animations', 'Core', 2),
  ('Next.js & React Architecture', 'Core', 3),
  ('AI-assisted Development', 'Core', 4);

-- Profile Seed
insert into public.profile (bio_primary, bio_secondary, email)
values
  (
    'I enjoy turning complex ideas into clean, usable systems.',
    'I focus on clarity, performance, and scalability rather than visual noise.',
    'hello@example.com'
  );
