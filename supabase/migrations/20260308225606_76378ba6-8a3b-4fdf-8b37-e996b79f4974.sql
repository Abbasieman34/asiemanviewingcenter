
-- Create movies table
CREATE TABLE public.movies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create football_games table
CREATE TABLE public.football_games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_a TEXT NOT NULL,
  team_b TEXT NOT NULL,
  league TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.football_games ENABLE ROW LEVEL SECURITY;

-- Public read access for visitors
CREATE POLICY "Anyone can view movies" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Anyone can view games" ON public.football_games FOR SELECT USING (true);

-- Allow mutations (PIN-protected in the app layer)
CREATE POLICY "Allow insert movies" ON public.movies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update movies" ON public.movies FOR UPDATE USING (true);
CREATE POLICY "Allow delete movies" ON public.movies FOR DELETE USING (true);

CREATE POLICY "Allow insert games" ON public.football_games FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update games" ON public.football_games FOR UPDATE USING (true);
CREATE POLICY "Allow delete games" ON public.football_games FOR DELETE USING (true);
