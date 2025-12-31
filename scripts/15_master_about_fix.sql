-- MASTER FIX SCRIPT for About Page
-- Run this in your Supabase SQL Editor to fix "Table Not Found" errors.
-- It works even if you have run previous scripts.

-- 1. Create Tables (if they don't exist)
create table if not exists public.about_general (
  id uuid not null default gen_random_uuid() primary key,
  full_name text not null default 'Abhishek Singh',
  role_title text not null default 'UI System Designer & Developer',
  bio_description text not null default 'My name is Abhishek Singh...',
  profile_image_url text,
  availability_status text default 'Available',
  is_available boolean default true,
  contact_email text,
  resume_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.about_experience (
  id uuid not null default gen_random_uuid() primary key,
  role text not null,
  company text not null,
  period text not null,
  description_points text[] default '{}',
  display_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.about_education (
  id uuid not null default gen_random_uuid() primary key,
  degree text not null,
  institution text not null,
  year text not null,
  display_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.about_skills (
  id uuid not null default gen_random_uuid() primary key,
  category text not null, 
  name text not null,
  icon_name text, 
  color_code text,
  display_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.about_interests (
  id uuid not null default gen_random_uuid() primary key,
  label text not null,
  icon_name text not null, 
  display_order integer default 0,
  created_at timestamptz default now()
);

-- 2. Add Missing Columns (Phone, Location, Birthday)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_general' AND column_name = 'phone_number') THEN
        ALTER TABLE public.about_general ADD COLUMN phone_number text default '+91 0000000000';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_general' AND column_name = 'location') THEN
        ALTER TABLE public.about_general ADD COLUMN location text default 'Kolkata, India';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_general' AND column_name = 'birthday') THEN
        ALTER TABLE public.about_general ADD COLUMN birthday date default '2003-01-01';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'about_general' AND column_name = 'profile_image_url') THEN
        ALTER TABLE public.about_general ADD COLUMN profile_image_url text;
    END IF;
END $$;

-- 3. Enable Security (RLS)
alter table public.about_general enable row level security;
alter table public.about_experience enable row level security;
alter table public.about_education enable row level security;
alter table public.about_skills enable row level security;
alter table public.about_interests enable row level security;

-- 4. Create Policies (Drop first to avoid errors)
DO $$ 
BEGIN
    -- General Policies
    execute 'drop policy if exists "Public can view about_general" on public.about_general';
    execute 'create policy "Public can view about_general" on public.about_general for select using (true)';
    
    execute 'drop policy if exists "Admins can update about_general" on public.about_general';
    execute 'create policy "Admins can update about_general" on public.about_general for all using (auth.role() = ''authenticated'')';

    -- Experience Policies
    execute 'drop policy if exists "Public can view about_experience" on public.about_experience';
    execute 'create policy "Public can view about_experience" on public.about_experience for select using (true)';
    
    execute 'drop policy if exists "Admins can update about_experience" on public.about_experience';
    execute 'create policy "Admins can update about_experience" on public.about_experience for all using (auth.role() = ''authenticated'')';

    -- Education Policies
    execute 'drop policy if exists "Public can view about_education" on public.about_education';
    execute 'create policy "Public can view about_education" on public.about_education for select using (true)';
    
    execute 'drop policy if exists "Admins can update about_education" on public.about_education';
    execute 'create policy "Admins can update about_education" on public.about_education for all using (auth.role() = ''authenticated'')';
    
    -- Skills Policies
    execute 'drop policy if exists "Public can view about_skills" on public.about_skills';
    execute 'create policy "Public can view about_skills" on public.about_skills for select using (true)';
    
    execute 'drop policy if exists "Admins can update about_skills" on public.about_skills';
    execute 'create policy "Admins can update about_skills" on public.about_skills for all using (auth.role() = ''authenticated'')';

    -- Interests Policies
    execute 'drop policy if exists "Public can view about_interests" on public.about_interests';
    execute 'create policy "Public can view about_interests" on public.about_interests for select using (true)';
    
    execute 'drop policy if exists "Admins can update about_interests" on public.about_interests';
    execute 'create policy "Admins can update about_interests" on public.about_interests for all using (auth.role() = ''authenticated'')';
END $$;

-- 5. Seed Initial Data (Only if empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.about_general) THEN
    insert into public.about_general (full_name, role_title, bio_description, contact_email)
    values ('Abhishek Singh', 'UI System Designer & Developer', 'My name is Abhishek Singh...', 'Abhishek23main@gmail.com');
  END IF;
  
  -- Force Reload Schema Cache (Cannot be done via SQL, but this script changing structure often triggers it)
END $$;
