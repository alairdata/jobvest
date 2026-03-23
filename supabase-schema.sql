-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text default '',
  email text default '',
  avatar_url text,
  email_verified boolean default false,
  is_google boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. User settings
create table if not exists public.user_settings (
  id uuid references auth.users on delete cascade primary key,
  notifications jsonb default '{"email": true, "browser": false, "weekly": true}',
  tailor_count integer default 0,
  improve_count integer default 0,
  score_count integer default 0,
  total_tailor_count integer default 0,
  total_improve_count integer default 0,
  total_score_count integer default 0,
  tailor_reset_month text default to_char(now(), 'YYYY-MM'),
  updated_at timestamptz default now()
);

-- 3. Saved resumes
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  resume_text text,
  file_name text,
  score integer,
  feedback jsonb,
  candidate_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id) -- one saved resume per user for now
);

-- 4. Application log
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  role text not null,
  company text not null,
  status text default 'applied',
  date text,
  ats_score integer default 0,
  platform text default 'Pasted',
  created_at timestamptz default now()
);

-- 5. Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  subject text default '',
  feedback text default '',
  created_at timestamptz default now()
);

-- 6. Verification tokens
create table if not exists public.verification_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.resumes enable row level security;
alter table public.applications enable row level security;
alter table public.verification_tokens enable row level security;

-- RLS Policies: users can only access their own data

-- Profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- User Settings
create policy "Users can view own settings"
  on public.user_settings for select
  using (auth.uid() = id);

create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (auth.uid() = id);

create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = id);

-- Resumes
create policy "Users can view own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own resumes"
  on public.resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

-- Applications
create policy "Users can view own applications"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on public.applications for update
  using (auth.uid() = user_id);

create policy "Users can delete own applications"
  on public.applications for delete
  using (auth.uid() = user_id);

-- Auto-create profile + settings on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, email_verified, is_google)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    case when new.raw_app_meta_data->>'provider' = 'google' then true else false end,
    case when new.raw_app_meta_data->>'provider' = 'google' then true else false end
  );
  insert into public.user_settings (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
