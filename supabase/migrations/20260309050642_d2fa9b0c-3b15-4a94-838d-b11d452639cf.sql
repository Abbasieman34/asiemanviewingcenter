
-- Fix movies: drop restrictive SELECT, recreate as permissive
DROP POLICY IF EXISTS "Anyone can view movies" ON public.movies;
CREATE POLICY "Anyone can view movies" ON public.movies FOR SELECT TO public USING (true);

-- Fix football_games: drop restrictive SELECT, recreate as permissive
DROP POLICY IF EXISTS "Anyone can view games" ON public.football_games;
CREATE POLICY "Anyone can view games" ON public.football_games FOR SELECT TO public USING (true);
