import { useEffect, useState } from "react";
import { Film, Tv } from "lucide-react";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import GameCard from "@/components/GameCard";
import { getMovies, getGames, type Movie, type FootballGame } from "@/lib/store";

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [games, setGames] = useState<FootballGame[]>([]);

  useEffect(() => {
    setMovies(getMovies());
    setGames(getGames());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative py-16 md:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative container mx-auto px-4">
          <div className="inline-flex items-center gap-2 gold-gradient px-4 py-1.5 rounded-full text-primary-foreground text-sm font-medium mb-6">
            <Tv className="h-4 w-4" /> Now Showing
          </div>
          <h2 className="text-5xl md:text-7xl text-primary mb-3">
            ASIEMAN VIEWING CENTER
          </h2>
          <p className="text-lg text-muted-foreground tracking-widest">
            KOFAR KUDU KAZAURE — MOVIES & LIVE FOOTBALL
          </p>
        </div>
      </section>

      {/* Movies */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <Film className="h-6 w-6 text-primary" />
          <h2 className="text-3xl text-primary">MOVIES SHOWING</h2>
        </div>
        {movies.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
            No movies scheduled yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Football */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <Tv className="h-6 w-6 text-primary" />
          <h2 className="text-3xl text-primary">LIVE FOOTBALL</h2>
        </div>
        {games.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
            No games scheduled yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Asieman Viewing Center — Kofar Kudu Kazaure</p>
      </footer>
    </div>
  );
};

export default Index;
