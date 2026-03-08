import { useState, useEffect, useRef } from "react";
import { Trash2, Pencil, Plus, Film, Tv, Lock } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getMovies, saveMovies, getGames, saveGames, generateId,
  type Movie, type FootballGame,
} from "@/lib/store";

const ADMIN_PIN = "1234";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      toast.success("Welcome, Admin!");
    } else {
      toast.error("Incorrect PIN");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-4">
            <div className="flex items-center gap-2 justify-center text-primary">
              <Lock className="h-6 w-6" />
              <h2 className="text-2xl">ADMIN LOGIN</h2>
            </div>
            <Input
              type="password"
              placeholder="Enter admin PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="text-center text-lg tracking-widest"
            />
            <Button onClick={handleLogin} className="w-full gold-gradient text-primary-foreground font-semibold">
              Login
            </Button>
            <p className="text-xs text-muted-foreground text-center">Default PIN: 1234</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <MovieManager />
        <GameManager />
      </div>
    </div>
  );
};

/* ── Movie Manager ── */
function MovieManager() {
  const [movies, setMovies] = useState<Movie[]>(getMovies());
  const [editing, setEditing] = useState<Movie | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setTitle(""); setDate(""); setTime(""); setDescription(""); setImage(""); setEditing(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = () => {
    if (!title || !date || !time || (!image && !editing)) {
      toast.error("Please fill title, date, time and image");
      return;
    }
    let updated: Movie[];
    if (editing) {
      updated = movies.map((m) =>
        m.id === editing.id ? { ...m, title, date, time, description, image: image || m.image } : m
      );
      toast.success("Movie updated!");
    } else {
      const newMovie: Movie = { id: generateId(), title, date, time, description, image };
      updated = [...movies, newMovie];
      toast.success("Movie added!");
    }
    saveMovies(updated);
    setMovies(updated);
    resetForm();
  };

  const handleEdit = (m: Movie) => {
    setEditing(m); setTitle(m.title); setDate(m.date); setTime(m.time); setDescription(m.description || ""); setImage(m.image);
  };

  const handleDelete = (id: string) => {
    const updated = movies.filter((m) => m.id !== id);
    saveMovies(updated);
    setMovies(updated);
    toast.success("Movie deleted");
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <Film className="h-6 w-6 text-primary" />
        <h2 className="text-3xl text-primary">MANAGE MOVIES</h2>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Movie title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-medium file:cursor-pointer" />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <Textarea placeholder="Short description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        {image && <img src={image} alt="Preview" className="h-32 rounded-lg object-cover" />}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="gold-gradient text-primary-foreground font-semibold">
            <Plus className="h-4 w-4 mr-1" /> {editing ? "Update" : "Add"} Movie
          </Button>
          {editing && (
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          )}
        </div>
      </div>

      {movies.length === 0 ? (
        <p className="text-muted-foreground text-sm">No movies yet.</p>
      ) : (
        <div className="space-y-3">
          {movies.map((m) => (
            <div key={m.id} className="flex items-center gap-4 bg-secondary/50 rounded-lg p-3 border border-border">
              <img src={m.image} alt={m.title} className="h-16 w-12 rounded object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.date} at {m.time}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="icon" variant="ghost" onClick={() => handleEdit(m)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(m.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Game Manager ── */
function GameManager() {
  const [games, setGames] = useState<FootballGame[]>(getGames());
  const [editing, setEditing] = useState<FootballGame | null>(null);
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [league, setLeague] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const resetForm = () => {
    setTeamA(""); setTeamB(""); setLeague(""); setDate(""); setTime(""); setEditing(null);
  };

  const handleSave = () => {
    if (!teamA || !teamB || !league || !date || !time) {
      toast.error("Please fill all fields");
      return;
    }
    let updated: FootballGame[];
    if (editing) {
      updated = games.map((g) =>
        g.id === editing.id ? { ...g, teamA, teamB, league, date, time } : g
      );
      toast.success("Game updated!");
    } else {
      const newGame: FootballGame = { id: generateId(), teamA, teamB, league, date, time };
      updated = [...games, newGame];
      toast.success("Game added!");
    }
    saveGames(updated);
    setGames(updated);
    resetForm();
  };

  const handleEdit = (g: FootballGame) => {
    setEditing(g); setTeamA(g.teamA); setTeamB(g.teamB); setLeague(g.league); setDate(g.date); setTime(g.time);
  };

  const handleDelete = (id: string) => {
    const updated = games.filter((g) => g.id !== id);
    saveGames(updated);
    setGames(updated);
    toast.success("Game deleted");
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <Tv className="h-6 w-6 text-primary" />
        <h2 className="text-3xl text-primary">MANAGE FOOTBALL GAMES</h2>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Team A" value={teamA} onChange={(e) => setTeamA(e.target.value)} />
          <Input placeholder="Team B" value={teamB} onChange={(e) => setTeamB(e.target.value)} />
          <Input placeholder="League (e.g. Premier League)" value={league} onChange={(e) => setLeague(e.target.value)} />
          <div /> {/* spacer */}
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSave} className="gold-gradient text-primary-foreground font-semibold">
            <Plus className="h-4 w-4 mr-1" /> {editing ? "Update" : "Add"} Game
          </Button>
          {editing && (
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          )}
        </div>
      </div>

      {games.length === 0 ? (
        <p className="text-muted-foreground text-sm">No games yet.</p>
      ) : (
        <div className="space-y-3">
          {games.map((g) => (
            <div key={g.id} className="flex items-center gap-4 bg-secondary/50 rounded-lg p-3 border border-border">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{g.teamA} vs {g.teamB}</p>
                <p className="text-xs text-muted-foreground">{g.league} — {g.date} at {g.time}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="icon" variant="ghost" onClick={() => handleEdit(g)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(g.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Admin;
