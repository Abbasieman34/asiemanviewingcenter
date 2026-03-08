import { useEffect, useState } from "react";
import { Film, Tv, Phone, Mail, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import GameCard from "@/components/GameCard";
import { getMovies, getGames, type Movie, type FootballGame } from "@/lib/store";

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [games, setGames] = useState<FootballGame[]>([]);

  useEffect(() => {
    getMovies().then(setMovies).catch(console.error);
    getGames().then(setGames).catch(console.error);
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

      {/* Contact Section */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl text-primary text-center mb-8">CONTACT US</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="https://wa.me/2347038802062"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 card-hover hover:border-primary/50 transition-colors"
          >
            <div className="gold-gradient p-2.5 rounded-lg">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">WhatsApp</p>
              <p className="text-sm font-semibold text-foreground">07038802062</p>
            </div>
          </a>

          <a
            href="tel:+2347038802062"
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 card-hover hover:border-primary/50 transition-colors"
          >
            <div className="gold-gradient p-2.5 rounded-lg">
              <Phone className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-semibold text-foreground">07038802062</p>
            </div>
          </a>

          <a
            href="mailto:aliyumusasiemankzr@gmail.com"
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 card-hover hover:border-primary/50 transition-colors"
          >
            <div className="gold-gradient p-2.5 rounded-lg">
              <Mail className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-semibold text-foreground truncate">aliyumusasiemankzr@gmail.com</p>
            </div>
          </a>

          <a
            href="https://www.facebook.com/search/top?q=Aliyu%20Musa%20Sieman"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 card-hover hover:border-primary/50 transition-colors"
          >
            <div className="gold-gradient p-2.5 rounded-lg">
              <svg className="h-5 w-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Facebook</p>
              <p className="text-sm font-semibold text-foreground">Aliyu Musa Sieman</p>
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Asieman Viewing Center — Kofar Kudu Kazaure</p>
      </footer>
    </div>
  );
};

export default Index;
