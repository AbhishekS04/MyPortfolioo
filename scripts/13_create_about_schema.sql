-- Create tables for the About Page dynamic content

-- 1. General Info (Singleton table, usually just 1 row with id=1)
create table if not exists public.about_general (
  id uuid not null default gen_random_uuid() primary key,
  full_name text not null default 'Abhishek Singh',
  role_title text not null default 'UI System Designer & Developer',
  bio_description text not null default 'My name is Abhishek Singh, a self-taught UI Designer & Frontend Engineer...',
  profile_image_url text,
  availability_status text default 'Available',
  is_available boolean default true,
  contact_email text,
  resume_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Experience
create table if not exists public.about_experience (
  id uuid not null default gen_random_uuid() primary key,
  role text not null,
  company text not null,
  period text not null,
  description_points text[] default '{}',
  display_order integer default 0,
  created_at timestamptz default now()
);

-- 3. Education
create table if not exists public.about_education (
  id uuid not null default gen_random_uuid() primary key,
  degree text not null,
  institution text not null,
  year text not null,
  display_order integer default 0,
  created_at timestamptz default now()
);

-- 4. Skills / Tools (Category: 'design' or 'editing' or 'language')
create table if not exists public.about_skills (
  id uuid not null default gen_random_uuid() primary key,
  category text not null, -- 'design', 'editing', 'language'
  name text not null,
  icon_name text, -- For lucide icons or shortcodes like 'Ps', 'Ae'
  color_code text, -- e.g. '#31A8FF'
  display_order integer default 0,
  created_at timestamptz default now()
);

-- 5. Interests
create table if not exists public.about_interests (
  id uuid not null default gen_random_uuid() primary key,
  label text not null,
  icon_name text not null, -- 'Gamepad2', 'Film', etc.
  display_order integer default 0,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.about_general enable row level security;
alter table public.about_experience enable row level security;
alter table public.about_education enable row level security;
alter table public.about_skills enable row level security;
alter table public.about_interests enable row level security;

-- Policies (Public Read, Admin Write)
create policy "Public can view about_general" on public.about_general for select using (true);
create policy "Admins can update about_general" on public.about_general for all using (auth.role() = 'authenticated'); -- Simplified auth check

create policy "Public can view about_experience" on public.about_experience for select using (true);
create policy "Admins can update about_experience" on public.about_experience for all using (auth.role() = 'authenticated');

create policy "Public can view about_education" on public.about_education for select using (true);
create policy "Admins can update about_education" on public.about_education for all using (auth.role() = 'authenticated');

create policy "Public can view about_skills" on public.about_skills for select using (true);
create policy "Admins can update about_skills" on public.about_skills for all using (auth.role() = 'authenticated');

create policy "Public can view about_interests" on public.about_interests for select using (true);
create policy "Admins can update about_interests" on public.about_interests for all using (auth.role() = 'authenticated');

-- Insert Initial Seed Data (matching the current website content)
insert into public.about_general (full_name, role_title, bio_description, contact_email)
select 'Abhishek Singh', 'UI System Designer & Developer', 'My name is Abhishek Singh, a self-taught UI Designer & Frontend Engineer...', 'Abhishek23main@gmail.com'
where not exists (select 1 from public.about_general);

-- Seed Experience
insert into public.about_experience (role, company, period, description_points, display_order)
values 
('Freelancer', 'UI System Designer', '2021 - Now', ARRAY['worked on diverse UI system and brand identity projects.', 'collaborated with clients from multiple countries.', 'developed a versatile design skill set.'], 1),
('Product Designer', 'Meetzed', '2020 - 2021', ARRAY['Collaboration: Supported Lead Designer on projects.', 'Branding: Crafted unique brand identities.', 'Tools: Worked on design systems and prototypes.'], 2);

-- Seed Education
insert into public.about_education (degree, institution, year, display_order)
values
('Graduation', 'Adamas University', '2023', 1),
('Higher Secondary', 'Rampurhat JL Vidyabhaban', '2023', 2),
('Secondary Education', 'Rampurhat JL Vidyabhaban', '2020', 3);

-- Seed Interests
insert into public.about_interests (label, icon_name, display_order)
values
('Gaming', 'Gamepad2', 1),
('Film Making', 'Film', 2),
('Traveling', 'Plane', 3);

-- Seed Skills
insert into public.about_skills (category, name, icon_name, color_code, display_order)
values
('design', 'Figma', 'Fg', '#F24E1E', 1),
('design', 'Photoshop', 'Ps', '#31A8FF', 2),
('design', 'Illustrator', 'Ai', '#FF3366', 3),
('editing', 'After Effects', 'Ae', '#9999FF', 1),
('editing', 'Premiere Pro', 'Pr', '#FF66FF', 2);
