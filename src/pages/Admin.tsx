import { useState, useEffect, useRef } from "react";
import { Trash2, Pencil, Plus, Film, Tv, LogOut, ShieldAlert, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  getMovies, addMovie, updateMovie, deleteMovie, addMovies,
  getGames, addGame, updateGame, deleteGame, addGames,
  type Movie, type FootballGame,
} from "@/lib/store";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-4 text-center">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-2xl text-primary">ACCESS DENIED</h2>
            <p className="text-sm text-muted-foreground">
              You are signed in as <span className="text-foreground">{user.email}</span> but you don't have admin privileges.
            </p>
            <p className="text-xs text-muted-foreground">
              Contact the site owner to request admin access.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/")} className="flex-1">Home</Button>
              <Button variant="outline" onClick={signOut} className="flex-1">
                <LogOut className="h-4 w-4 mr-1" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-12">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Signed in as <span className="text-foreground">{user.email}</span></p>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-1" /> Sign Out
          </Button>
        </div>
        <MovieManager />
        <GameManager />
      </div>
    </div>
  );
};

/* ── Movie Manager ── */
function MovieManager() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editing, setEditing] = useState<Movie | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [bulkData, setBulkData] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);

  useEffect(() => {
    getMovies().then(setMovies).catch(() => toast.error("Failed to load movies"));
  }, []);

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

  const handleSave = async () => {
    if (!title || !date || !time || (!image && !editing)) {
      toast.error("Please fill title, date, time and image");
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        await updateMovie(editing.id, { title, date, time, description, image: image || editing.image });
        toast.success("Movie updated!");
      } else {
        await addMovie({ title, date, time, description, image });
        toast.success("Movie added!");
      }
      setMovies(await getMovies());
      resetForm();
    } catch {
      toast.error("Failed to save movie");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (m: Movie) => {
    setEditing(m); setTitle(m.title); setDate(m.date); setTime(m.time); setDescription(m.description || ""); setImage(m.image);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMovie(id);
      setMovies(await getMovies());
      toast.success("Movie deleted");
    } catch {
      toast.error("Failed to delete movie");
    }
  };

  const handleBulkUpload = async () => {
    try {
      const parsed = JSON.parse(bulkData) as Array<{ title: string; image: string; date: string; time: string; description?: string }>;
      if (!Array.isArray(parsed)) throw new Error("Data must be an array");
      setLoading(true);
      await addMovies(parsed);
      setMovies(await getMovies());
      toast.success(`${parsed.length} movies added!`);
      setBulkData("");
      setBulkOpen(false);
    } catch (e) {
      toast.error("Invalid format. Expected JSON array with fields: title, image, date, time, description (optional)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <Film className="h-6 w-6 text-primary" />
        <h2 className="text-3xl text-primary">MANAGE MOVIES</h2>
      </div>

      <Collapsible open={bulkOpen} onOpenChange={setBulkOpen} className="mb-6">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Upload className="h-4 w-4" /> Bulk Upload Movies
            </span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Paste a JSON array of movies. Example:
            </p>
            <pre className="bg-secondary/50 p-3 rounded text-xs overflow-x-auto">
{`[
  {
    "title": "Movie 1",
    "image": "data:image/png;base64,...",
    "date": "2026-03-15",
    "time": "20:00",
    "description": "Optional"
  }
]`}
            </pre>
            <Textarea
              placeholder="Paste JSON array here..."
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              rows={8}
              className="font-mono text-xs"
            />
            <Button onClick={handleBulkUpload} disabled={loading || !bulkData}>
              <Upload className="h-4 w-4 mr-2" /> Upload {bulkData ? `(${bulkData.split('"title"').length - 1} movies)` : ""}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

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
          <Button onClick={handleSave} disabled={loading} className="gold-gradient text-primary-foreground font-semibold">
            <Plus className="h-4 w-4 mr-1" /> {editing ? "Update" : "Add"} Movie
          </Button>
          {editing && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
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
                <Button size="icon" variant="ghost" onClick={() => handleEdit(m)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4" /></Button>
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
  const [games, setGames] = useState<FootballGame[]>([]);
  const [editing, setEditing] = useState<FootballGame | null>(null);
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [league, setLeague] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getGames().then(setGames).catch(() => toast.error("Failed to load games"));
  }, []);

  const resetForm = () => {
    setTeamA(""); setTeamB(""); setLeague(""); setDate(""); setTime(""); setEditing(null);
  };

  const handleSave = async () => {
    if (!teamA || !teamB || !league || !date || !time) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        await updateGame(editing.id, { teamA, teamB, league, date, time });
        toast.success("Game updated!");
      } else {
        await addGame({ teamA, teamB, league, date, time });
        toast.success("Game added!");
      }
      setGames(await getGames());
      resetForm();
    } catch {
      toast.error("Failed to save game");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (g: FootballGame) => {
    setEditing(g); setTeamA(g.teamA); setTeamB(g.teamB); setLeague(g.league); setDate(g.date); setTime(g.time);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGame(id);
      setGames(await getGames());
      toast.success("Game deleted");
    } catch {
      toast.error("Failed to delete game");
    }
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
          <div />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={loading} className="gold-gradient text-primary-foreground font-semibold">
            <Plus className="h-4 w-4 mr-1" /> {editing ? "Update" : "Add"} Game
          </Button>
          {editing && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
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
                <Button size="icon" variant="ghost" onClick={() => handleEdit(g)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(g.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Admin;
