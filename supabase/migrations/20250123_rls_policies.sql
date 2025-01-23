-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_matches ENABLE ROW LEVEL SECURITY;

-- Create policies for the profiles table
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for the resumes table
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for the job_matches table
CREATE POLICY "Users can view own job matches"
  ON job_matches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own job matches"
  ON job_matches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job matches"
  ON job_matches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a secure function to get the current user's profile
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS SETOF profiles
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT *
  FROM profiles
  WHERE user_id = auth.uid()
$$;

-- Create a secure function to get the current user's resumes
CREATE OR REPLACE FUNCTION public.get_current_user_resumes()
RETURNS SETOF resumes
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT *
  FROM resumes
  WHERE user_id = auth.uid()
$$;

-- Create a secure function to get the current user's job matches
CREATE OR REPLACE FUNCTION public.get_current_user_job_matches()
RETURNS SETOF job_matches
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT *
  FROM job_matches
  WHERE user_id = auth.uid()
$$;

-- Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
