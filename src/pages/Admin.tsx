import { useState, useEffect, useRef } from "react";
import { Plus, Film, Tv, LogOut, ShieldAlert, Users, Shield, ShieldCheck, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import Header from "@/components/Header";
import SectionHeader from "@/components/SectionHeader";
import EmptyState from "@/components/EmptyState";
import BulkUploadSection from "@/components/BulkUploadSection";
import AdminItemActions from "@/components/AdminItemActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getMovies, addMovie, updateMovie, deleteMovie, addMovies,
  getGames, addGame, updateGame, deleteGame, addGames,
  getAllUsers, grantAdminRole, revokeAdminRole, getActivityLogs,
  type Movie, type FootballGame, type UserWithRole, type ActivityLog,
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
    <PageLayout
      title="Admin Dashboard — Asieman Viewing Center"
      description="Manage movies, football schedules, users and activity for Asieman Viewing Center."
      canonicalPath="/admin"
      noIndex
    >
      <div className="container mx-auto px-4 py-8 space-y-8">
        <h1 className="sr-only">Admin Dashboard</h1>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Signed in as <span className="text-foreground">{user.email}</span></p>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-1" /> Sign Out
          </Button>
        </div>
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users"><Users className="h-4 w-4 mr-1" /> Users</TabsTrigger>
            <TabsTrigger value="activity"><History className="h-4 w-4 mr-1" /> Activity Log</TabsTrigger>
            <TabsTrigger value="movies"><Film className="h-4 w-4 mr-1" /> Movies</TabsTrigger>
            <TabsTrigger value="games"><Tv className="h-4 w-4 mr-1" /> Games</TabsTrigger>
          </TabsList>
          <TabsContent value="users"><UserManager /></TabsContent>
          <TabsContent value="activity"><ActivityLogViewer /></TabsContent>
          <TabsContent value="movies"><MovieManager /></TabsContent>
          <TabsContent value="games"><GameManager /></TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

/* ── User Manager ── */
function UserManager() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleAdmin = async (userId: string, isCurrentlyAdmin: boolean) => {
    if (userId === currentUser?.id) {
      toast.error("You cannot modify your own admin status");
      return;
    }

    try {
      setLoading(true);
      if (isCurrentlyAdmin) {
        const targetUser = users.find(u => u.id === userId);
        await revokeAdminRole(userId, targetUser?.email || "unknown");
        toast.success("Admin privileges revoked");
      } else {
        const targetUser = users.find(u => u.id === userId);
        await grantAdminRole(userId, targetUser?.email || "unknown");
        toast.success("Admin privileges granted");
      }
      await loadUsers();
    } catch (error) {
      toast.error("Failed to update user role");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <SectionHeader icon={Users} title="USER MANAGEMENT" />

      {loading && users.length === 0 ? (
        <EmptyState message="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState message="No users found." />
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-4 bg-secondary/50 rounded-lg p-4 border border-border"
            >
              <div className="flex-shrink-0">
                {u.isAdmin ? (
                  <ShieldCheck className="h-8 w-8 text-primary" />
                ) : (
                  <Shield className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{u.email}</p>
                <p className="text-xs text-muted-foreground">
                  {u.isAdmin ? "Administrator" : "Regular User"} • Joined {new Date(u.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex-shrink-0">
                {u.id === currentUser?.id ? (
                  <span className="text-xs text-muted-foreground px-3 py-2 bg-secondary rounded-lg">
                    You
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant={u.isAdmin ? "outline" : "default"}
                    onClick={() => handleToggleAdmin(u.id, u.isAdmin)}
                    disabled={loading}
                    className={u.isAdmin ? "" : "gold-gradient text-primary-foreground font-semibold"}
                  >
                    {u.isAdmin ? (
                      <>
                        <Shield className="h-4 w-4 mr-1" /> Remove Admin
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 mr-1" /> Make Admin
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

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

  const movieBulkExample = `[
  {
    "title": "Movie 1",
    "image": "data:image/png;base64,...",
    "date": "2026-03-15",
    "time": "20:00",
    "description": "Optional"
  }
]`;

  return (
    <section>
      <SectionHeader icon={Film} title="MANAGE MOVIES" />

      <BulkUploadSection
        entityName="Movies"
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        exampleJson={movieBulkExample}
        bulkData={bulkData}
        onBulkDataChange={setBulkData}
        onUpload={handleBulkUpload}
        loading={loading}
        countKey="title"
      />

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
        <EmptyState message="No movies yet." />
      ) : (
        <div className="space-y-3">
          {movies.map((m) => (
            <div key={m.id} className="flex items-center gap-4 bg-secondary/50 rounded-lg p-3 border border-border">
              <img src={m.image} alt={m.title} className="h-16 w-12 rounded object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.date} at {m.time}</p>
              </div>
              <AdminItemActions onEdit={() => handleEdit(m)} onDelete={() => handleDelete(m.id)} />
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
  const [bulkData, setBulkData] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);

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

  const handleBulkUpload = async () => {
    try {
      const parsed = JSON.parse(bulkData) as Array<{ teamA: string; teamB: string; league: string; date: string; time: string }>;
      if (!Array.isArray(parsed)) throw new Error("Data must be an array");
      setLoading(true);
      await addGames(parsed);
      setGames(await getGames());
      toast.success(`${parsed.length} games added!`);
      setBulkData("");
      setBulkOpen(false);
    } catch (e) {
      toast.error("Invalid format. Expected JSON array with fields: teamA, teamB, league, date, time");
    } finally {
      setLoading(false);
    }
  };

  const gameBulkExample = `[
  {
    "teamA": "Manchester United",
    "teamB": "Liverpool",
    "league": "Premier League",
    "date": "2026-03-15",
    "time": "15:00"
  }
]`;

  return (
    <section>
      <SectionHeader icon={Tv} title="MANAGE FOOTBALL GAMES" />

      <BulkUploadSection
        entityName="Games"
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        exampleJson={gameBulkExample}
        bulkData={bulkData}
        onBulkDataChange={setBulkData}
        onUpload={handleBulkUpload}
        loading={loading}
        countKey="teamA"
      />

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
        <EmptyState message="No games yet." />
      ) : (
        <div className="space-y-3">
          {games.map((g) => (
            <div key={g.id} className="flex items-center gap-4 bg-secondary/50 rounded-lg p-3 border border-border">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{g.teamA} vs {g.teamB}</p>
                <p className="text-xs text-muted-foreground">{g.league} — {g.date} at {g.time}</p>
              </div>
              <AdminItemActions onEdit={() => handleEdit(g)} onDelete={() => handleDelete(g.id)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Activity Log Viewer ── */
function ActivityLogViewer() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getActivityLogs()
      .then(setLogs)
      .catch(() => toast.error("Failed to load activity logs"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <SectionHeader icon={History} title="ACTIVITY LOG" />

      {loading ? (
        <EmptyState message="Loading logs..." />
      ) : logs.length === 0 ? (
        <EmptyState message="No activity recorded yet." />
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-4 bg-secondary/50 rounded-lg p-4 border border-border"
            >
              <div className={`flex-shrink-0 mt-0.5 ${log.action === "grant_admin" ? "text-green-500" : "text-destructive"}`}>
                {log.action === "grant_admin" ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <Shield className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{log.performedByEmail}</span>
                  {" "}
                  {log.action === "grant_admin" ? "granted admin to" : "revoked admin from"}
                  {" "}
                  <span className="font-semibold">{log.targetUserEmail}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Admin;
