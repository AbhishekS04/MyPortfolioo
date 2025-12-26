-- EXPAND PROFILE TABLE
-- We alter the existing profile table to add more global settings
alter table public.profile 
add column if not exists signature_text text default 'Abhishek',
add column if not exists location_city text default 'Kolkata',
add column if not exists location_country text default 'India',
add column if not exists location_timezone text default 'IST',
add column if not exists focus_area_title text default 'Focus Area',
add column if not exists focus_area_text text default 'Frontend Engineering, \nUI Systems, AI & \nModern Web.',
add column if not exists availability_status text default 'Available', -- For the green dot
add column if not exists availability_color text default 'emerald'; -- emerald, red, yellow

-- TECH STACK TABLE
create table if not exists public.tech_stack (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  icon_key text not null, -- e.g., 'react', 'next', 'cpp' - mapped in frontend
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SOCIAL STORIES TABLE
create table if not exists public.social_stories (
  id uuid default gen_random_uuid() primary key,
  platform text not null, -- 'instagram', 'linkedin'
  media_url text not null,
  link_url text,
  caption text,
  duration integer default 5,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- GALLERY IMAGES TABLE (for Vertical Image Stack)
create table if not exists public.gallery_images (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  alt_text text,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ENABLE RLS
alter table public.tech_stack enable row level security;
alter table public.social_stories enable row level security;
alter table public.gallery_images enable row level security;

-- POLICIES (Public Read)
create policy "Allow public read access on tech_stack" on public.tech_stack for select using (true);
create policy "Allow public read access on social_stories" on public.social_stories for select using (true);
create policy "Allow public read access on gallery_images" on public.gallery_images for select using (true);

-- SEED DATA

-- Update Profile with defaults if it exists, otherwise insert (Singleton logic handled by app usually, but we ensure 1 row)
-- (Assuming 1 row exists from previous step, we just updated columns with defaults)

-- Tech Stack Seed
insert into public.tech_stack (name, icon_key, display_order) values
('C++', 'cpp', 1),
('Java', 'java', 2),
('HTML5', 'html', 3),
('CSS3', 'css', 4),
('JavaScript', 'js', 5),
('TypeScript', 'ts', 6),
('React', 'react', 7),
('Next.js', 'next', 8),
('Bootstrap', 'bootstrap', 9);

-- Social Stories Seed
insert into public.social_stories (platform, media_url, link_url, caption, duration, display_order) values
('linkedin', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop', 'https://www.linkedin.com/', 'Excited to share my latest project! #webdev', 5, 1),
('instagram', 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop', 'https://www.instagram.com/', 'Behind the scenes 📸', 5, 2),
('instagram', 'https://images.unsplash.com/photo-1516251193000-18e65848006b?q=80&w=2670&auto=format&fit=crop', 'https://www.instagram.com/', 'Coding late night 🌙', 5, 3);

-- Gallery Images Seed
insert into public.gallery_images (image_url, alt_text, display_order) values
('https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop', 'Black sneaker with red sole', 1),
('https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1000&auto=format&fit=crop', 'White minimalist sneaker', 2),
('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop', 'Red athletic sneaker', 3),
('https://images.unsplash.com/photo-1525966222134-fcfa99183646?q=80&w=1000&auto=format&fit=crop', 'Urban walking shoe', 4),
('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop', 'Green limited edition', 5);
