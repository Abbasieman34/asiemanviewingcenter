
-- Drop all existing restrictive policies
DROP POLICY "Anyone can view movies" ON public.movies;
DROP POLICY "Allow insert movies" ON public.movies;
DROP POLICY "Allow update movies" ON public.movies;
DROP POLICY "Allow delete movies" ON public.movies;
DROP POLICY "Anyone can view games" ON public.football_games;
DROP POLICY "Allow insert games" ON public.football_games;
DROP POLICY "Allow update games" ON public.football_games;
DROP POLICY "Allow delete games" ON public.football_games;

-- Recreate as PERMISSIVE policies (default)
CREATE POLICY "Anyone can view movies" ON public.movies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow insert movies" ON public.movies FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow update movies" ON public.movies FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow delete movies" ON public.movies FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "Anyone can view games" ON public.football_games FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow insert games" ON public.football_games FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow update games" ON public.football_games FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Allow delete games" ON public.football_games FOR DELETE TO anon, authenticated USING (true);
