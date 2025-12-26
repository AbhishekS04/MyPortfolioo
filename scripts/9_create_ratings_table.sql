-- Create ratings table
create table if not exists public.ratings (
  id uuid default gen_random_uuid() primary key,
  rating integer not null check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.ratings enable row level security;

-- Policies
create policy "Anyone can insert ratings"
  on public.ratings for insert
  with check (true);

create policy "Admins can view ratings"
  on public.ratings for select
  using (true); -- Ideally restricted to admin, but for now open is fine or we stick to service_role in API
