import { useEffect, useState } from "react";
import { Film, Tv, Phone, Mail, MessageCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import MovieCard from "@/components/MovieCard";
import GameCard from "@/components/GameCard";
import SectionHeader from "@/components/SectionHeader";
import EmptyState from "@/components/EmptyState";
import ContactCard from "@/components/ContactCard";
import { getMovies, getGames, type Movie, type FootballGame } from "@/lib/store";

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [games, setGames] = useState<FootballGame[]>([]);

  useEffect(() => {
    getMovies().then(setMovies).catch(console.error);
    getGames().then(setGames).catch(console.error);
  }, []);

  return (
    <PageLayout
      title="Asieman Viewing Center — Movies & Live Football"
      description="Catch the latest movies and watch live football matches at Asieman Viewing Center, Kofar Kudu Kazaure. See today's schedule."
      canonicalPath="/"
      ogTitle="Asieman Viewing Center — Movies & Live Football"
      ogDescription="Catch the latest movies and watch live football matches at Asieman Viewing Center, Kofar Kudu Kazaure."
    >
      <main>
      {/* Hero */}
      <section className="relative py-16 md:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative container mx-auto px-4">
          <div className="inline-flex items-center gap-2 gold-gradient px-4 py-1.5 rounded-full text-primary-foreground text-sm font-medium mb-6">
            <Tv className="h-4 w-4" /> Now Showing
          </div>
          <h1 className="text-5xl md:text-7xl text-primary mb-3">
            ASIEMAN VIEWING CENTER
          </h1>
          <p className="text-lg text-muted-foreground tracking-widest">
            KOFAR KUDU KAZAURE — MOVIES & LIVE FOOTBALL
          </p>
        </div>
      </section>

      {/* Movies */}
      <section className="container mx-auto px-4 pb-12">
        <SectionHeader icon={Film} title="MOVIES SHOWING" />
        {movies.length === 0 ? (
          <EmptyState message="No movies scheduled yet. Check back soon!" variant="bordered" />
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
        <SectionHeader icon={Tv} title="LIVE FOOTBALL" />
        {games.length === 0 ? (
          <EmptyState message="No games scheduled yet. Check back soon!" variant="bordered" />
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
          <ContactCard
            href="https://wa.me/2347038802062"
            icon={<MessageCircle className="h-5 w-5 text-primary-foreground" />}
            label="WhatsApp"
            value="07038802062"
            external
          />
          <ContactCard
            href="tel:+2347038802062"
            icon={<Phone className="h-5 w-5 text-primary-foreground" />}
            label="Phone"
            value="07038802062"
          />
          <ContactCard
            href="mailto:aliyumusasiemankzr@gmail.com"
            icon={<Mail className="h-5 w-5 text-primary-foreground" />}
            label="Email"
            value="aliyumusasiemankzr@gmail.com"
            truncate
          />
          <ContactCard
            href="https://www.facebook.com/search/top?q=Aliyu%20Musa%20Sieman"
            icon={
              <svg className="h-5 w-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            }
            label="Facebook"
            value="Aliyu Musa Sieman"
            external
          />
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Asieman Viewing Center — Kofar Kudu Kazaure</p>
      </footer>
    </PageLayout>
  );
};

export default Index;
