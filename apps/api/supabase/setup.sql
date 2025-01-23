-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Drop existing tables and types if they exist (be careful with this in production!)
drop table if exists public.job_applications cascade;
drop table if exists public.saved_jobs cascade;
drop table if exists public.jobs cascade;
drop table if exists public.resumes cascade;
drop table if exists public.user_subscriptions cascade;
drop table if exists public.user_profiles cascade;
drop type if exists job_application_status;
drop type if exists resume_file_type;
drop type if exists subscription_status;

-- Create enum types
create type job_application_status as enum ('PENDING', 'SUBMITTED', 'VIEWED', 'REJECTED', 'ACCEPTED');
create type resume_file_type as enum ('PDF', 'DOCX');
create type subscription_status as enum ('TRIAL', 'ACTIVE', 'EXPIRED');

-- Create user_profiles table
create table if not exists public.user_profiles (
    id uuid references auth.users on delete cascade not null primary key,
    email text not null,
    full_name text not null default '',
    title text,
    bio text,
    skills text[] default '{}',
    experience jsonb[] default '{}',
    education jsonb[] default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    constraint email_format check (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- Create user_subscriptions table
create table if not exists public.user_subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users on delete cascade not null,
    status subscription_status not null default 'TRIAL',
    stripe_customer_id text,
    stripe_subscription_id text,
    trial_ends_at timestamptz not null default (now() + interval '14 days'),
    current_period_ends_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create resumes table
create table if not exists public.resumes (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users on delete cascade not null,
    title text not null,
    content text not null,
    file_url text not null,
    file_type resume_file_type not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create jobs table
create table if not exists public.jobs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    company text not null,
    location text not null,
    description text not null,
    employment_type text not null,
    salary_range jsonb,
    requirements text[] default '{}',
    responsibilities text[] default '{}',
    posted_date timestamptz default now(),
    expires_at timestamptz,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create saved_jobs table
create table if not exists public.saved_jobs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users on delete cascade not null,
    job_id uuid references public.jobs on delete cascade not null,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id, job_id)
);

-- Create job_applications table
create table if not exists public.job_applications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users on delete cascade not null,
    job_id uuid references public.jobs not null,
    resume_id uuid references public.resumes not null,
    cover_letter text not null,
    status job_application_status not null default 'PENDING',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table public.user_profiles enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.resumes enable row level security;
alter table public.jobs enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.job_applications enable row level security;

-- User profiles policies
create policy "Users can view their own profile"
    on public.user_profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.user_profiles for update
    using (auth.uid() = id);

create policy "Users can insert their own profile"
    on public.user_profiles for insert
    with check (auth.uid() = id);

-- User subscriptions policies
create policy "Users can view their own subscription"
    on public.user_subscriptions for select
    using (auth.uid() = user_id);

create policy "Users can update their own subscription"
    on public.user_subscriptions for update
    using (auth.uid() = user_id);

create policy "Users can insert their own subscription"
    on public.user_subscriptions for insert
    with check (auth.uid() = user_id);

-- Resumes policies
create policy "Users can view their own resumes"
    on public.resumes for select
    using (auth.uid() = user_id);

create policy "Users can create their own resumes"
    on public.resumes for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own resumes"
    on public.resumes for update
    using (auth.uid() = user_id);

create policy "Users can delete their own resumes"
    on public.resumes for delete
    using (auth.uid() = user_id);

-- Jobs policies (public read-only)
create policy "Anyone can view active jobs"
    on public.jobs for select
    using (is_active = true);

-- Saved jobs policies
create policy "Users can view their saved jobs"
    on public.saved_jobs for select
    using (auth.uid() = user_id);

create policy "Users can save jobs"
    on public.saved_jobs for insert
    with check (auth.uid() = user_id);

create policy "Users can update their saved jobs"
    on public.saved_jobs for update
    using (auth.uid() = user_id);

create policy "Users can remove saved jobs"
    on public.saved_jobs for delete
    using (auth.uid() = user_id);

-- Job applications policies
create policy "Users can view their own applications"
    on public.job_applications for select
    using (auth.uid() = user_id);

create policy "Users can create their own applications"
    on public.job_applications for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own applications"
    on public.job_applications for update
    using (auth.uid() = user_id);

create policy "Users can delete their own applications"
    on public.job_applications for delete
    using (auth.uid() = user_id);

-- Create triggers for updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_updated_at
    before update on public.user_profiles
    for each row
    execute function public.set_updated_at();

create trigger set_updated_at
    before update on public.user_subscriptions
    for each row
    execute function public.set_updated_at();

create trigger set_updated_at
    before update on public.resumes
    for each row
    execute function public.set_updated_at();

create trigger set_updated_at
    before update on public.jobs
    for each row
    execute function public.set_updated_at();

create trigger set_updated_at
    before update on public.saved_jobs
    for each row
    execute function public.set_updated_at();

create trigger set_updated_at
    before update on public.job_applications
    for each row
    execute function public.set_updated_at();

-- Create indexes
create index if not exists idx_user_profiles_email on public.user_profiles(email);
create index if not exists idx_user_subscriptions_user_id on public.user_subscriptions(user_id);
create index if not exists idx_resumes_user_id on public.resumes(user_id);
create index if not exists idx_jobs_is_active on public.jobs(is_active);
create index if not exists idx_saved_jobs_user_id on public.saved_jobs(user_id);
create index if not exists idx_saved_jobs_job_id on public.saved_jobs(job_id);
create index if not exists idx_job_applications_user_id on public.job_applications(user_id);
create index if not exists idx_job_applications_job_id on public.job_applications(job_id);

-- Test data insertion function
create or replace function test_user_signup(user_id uuid, email text)
returns void as $$
begin
    -- Create user profile
    insert into public.user_profiles (id, email, full_name)
    values (user_id, email, 'Test User');

    -- Create trial subscription
    insert into public.user_subscriptions (user_id, status, trial_ends_at)
    values (user_id, 'TRIAL', now() + interval '14 days');
end;
$$ language plpgsql;
