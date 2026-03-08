
-- Create admin role enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Users can read their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Now update movie/game policies to require admin role for mutations
DROP POLICY "Allow insert movies" ON public.movies;
DROP POLICY "Allow update movies" ON public.movies;
DROP POLICY "Allow delete movies" ON public.movies;
DROP POLICY "Allow insert games" ON public.football_games;
DROP POLICY "Allow update games" ON public.football_games;
DROP POLICY "Allow delete games" ON public.football_games;

CREATE POLICY "Admins can insert movies" ON public.movies
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update movies" ON public.movies
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete movies" ON public.movies
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert games" ON public.football_games
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update games" ON public.football_games
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete games" ON public.football_games
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
