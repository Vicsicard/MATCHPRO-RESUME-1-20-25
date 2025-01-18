-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type job_application_status as enum ('PENDING', 'SUBMITTED', 'VIEWED', 'REJECTED', 'ACCEPTED');
create type resume_file_type as enum ('PDF', 'DOCX');

-- Create user_profiles table
create table if not exists public.user_profiles (
    id uuid references auth.users not null primary key,
    email text not null,
    full_name text not null,
    title text,
    bio text,
    skills text[] default '{}',
    experience jsonb[] default '{}',
    education jsonb[] default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    constraint email_format check (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- Create resumes table
create table if not exists public.resumes (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
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

-- Create job_applications table
create table if not exists public.job_applications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    job_id uuid references public.jobs not null,
    resume_id uuid references public.resumes not null,
    cover_letter text not null,
    status job_application_status not null default 'PENDING',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create RLS policies
alter table public.user_profiles enable row level security;
alter table public.resumes enable row level security;
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

-- Create indexes
create index if not exists idx_user_profiles_email on public.user_profiles(email);
create index if not exists idx_resumes_user_id on public.resumes(user_id);
create index if not exists idx_jobs_posted_date on public.jobs(posted_date);
create index if not exists idx_job_applications_user_id on public.job_applications(user_id);
create index if not exists idx_job_applications_job_id on public.job_applications(job_id);

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.user_profiles (id, email, full_name)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name');
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
