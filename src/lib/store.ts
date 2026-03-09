import { supabase } from "@/integrations/supabase/client";

export interface Movie {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  description?: string;
}

export interface FootballGame {
  id: string;
  teamA: string;
  teamB: string;
  league: string;
  date: string;
  time: string;
}

export async function getMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((m) => ({
    id: m.id,
    title: m.title,
    image: m.image,
    date: m.date,
    time: m.time,
    description: m.description ?? undefined,
  }));
}

export async function addMovie(movie: Omit<Movie, "id">): Promise<Movie> {
  const { data, error } = await supabase
    .from("movies")
    .insert({
      title: movie.title,
      image: movie.image,
      date: movie.date,
      time: movie.time,
      description: movie.description || null,
    })
    .select()
    .single();
  if (error) throw error;
  return { ...data, description: data.description ?? undefined };
}

export async function updateMovie(id: string, movie: Partial<Movie>): Promise<void> {
  const { error } = await supabase
    .from("movies")
    .update({
      title: movie.title,
      image: movie.image,
      date: movie.date,
      time: movie.time,
      description: movie.description || null,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteMovie(id: string): Promise<void> {
  const { error } = await supabase.from("movies").delete().eq("id", id);
  if (error) throw error;
}

export async function getGames(): Promise<FootballGame[]> {
  const { data, error } = await supabase
    .from("football_games")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((g) => ({
    id: g.id,
    teamA: g.team_a,
    teamB: g.team_b,
    league: g.league,
    date: g.date,
    time: g.time,
  }));
}

export async function addGame(game: Omit<FootballGame, "id">): Promise<FootballGame> {
  const { data, error } = await supabase
    .from("football_games")
    .insert({
      team_a: game.teamA,
      team_b: game.teamB,
      league: game.league,
      date: game.date,
      time: game.time,
    })
    .select()
    .single();
  if (error) throw error;
  return { id: data.id, teamA: data.team_a, teamB: data.team_b, league: data.league, date: data.date, time: data.time };
}

export async function updateGame(id: string, game: Partial<FootballGame>): Promise<void> {
  const update: Record<string, unknown> = {};
  if (game.teamA !== undefined) update.team_a = game.teamA;
  if (game.teamB !== undefined) update.team_b = game.teamB;
  if (game.league !== undefined) update.league = game.league;
  if (game.date !== undefined) update.date = game.date;
  if (game.time !== undefined) update.time = game.time;
  const { error } = await supabase.from("football_games").update(update).eq("id", id);
  if (error) throw error;
}

export async function deleteGame(id: string): Promise<void> {
  const { error } = await supabase.from("football_games").delete().eq("id", id);
  if (error) throw error;
}

export async function addMovies(movies: Omit<Movie, "id">[]): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("movies")
    .insert(
      movies.map((m) => ({
        title: m.title,
        image: m.image,
        date: m.date,
        time: m.time,
        description: m.description || null,
      }))
    )
    .select();
  if (error) throw error;
  return (data || []).map((m) => ({ ...m, description: m.description ?? undefined }));
}

export async function addGames(games: Omit<FootballGame, "id">[]): Promise<FootballGame[]> {
  const { data, error } = await supabase
    .from("football_games")
    .insert(
      games.map((g) => ({
        team_a: g.teamA,
        team_b: g.teamB,
        league: g.league,
        date: g.date,
        time: g.time,
      }))
    )
    .select();
  if (error) throw error;
  return (data || []).map((g) => ({
    id: g.id,
    teamA: g.team_a,
    teamB: g.team_b,
    league: g.league,
    date: g.date,
    time: g.time,
  }));
}

/* ── User Role Management ── */
export interface UserWithRole {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export async function getAllUsers(): Promise<UserWithRole[]> {
  // Get all users from auth.users (via admin API)
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) throw usersError;

  // Get all admin roles
  const { data: adminRoles, error: rolesError } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin");
  if (rolesError) throw rolesError;

  const adminUserIds = new Set((adminRoles || []).map((r) => r.user_id));

  return (users || []).map((u) => ({
    id: u.id,
    email: u.email || "No email",
    isAdmin: adminUserIds.has(u.id),
    createdAt: u.created_at,
  }));
}

export async function grantAdminRole(userId: string, targetEmail: string): Promise<void> {
  const { error } = await supabase
    .from("user_roles")
    .insert({ user_id: userId, role: "admin" });
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("admin_activity_log").insert({
      action: "grant_admin",
      target_user_id: userId,
      target_user_email: targetEmail,
      performed_by_id: user.id,
      performed_by_email: user.email || "unknown",
    });
  }
}

export async function revokeAdminRole(userId: string, targetEmail: string): Promise<void> {
  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role", "admin");
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("admin_activity_log").insert({
      action: "revoke_admin",
      target_user_id: userId,
      target_user_email: targetEmail,
      performed_by_id: user.id,
      performed_by_email: user.email || "unknown",
    });
  }
}

export interface ActivityLog {
  id: string;
  action: string;
  targetUserEmail: string;
  performedByEmail: string;
  createdAt: string;
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from("admin_activity_log")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((l) => ({
    id: l.id,
    action: l.action,
    targetUserEmail: l.target_user_email,
    performedByEmail: l.performed_by_email,
    createdAt: l.created_at,
  }));
}
