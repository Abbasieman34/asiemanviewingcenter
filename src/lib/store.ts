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
  image?: string;
}

const MOVIES_KEY = "asieman_movies";
const GAMES_KEY = "asieman_games";

export function getMovies(): Movie[] {
  const data = localStorage.getItem(MOVIES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveMovies(movies: Movie[]) {
  localStorage.setItem(MOVIES_KEY, JSON.stringify(movies));
}

export function getGames(): FootballGame[] {
  const data = localStorage.getItem(GAMES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveGames(games: FootballGame[]) {
  localStorage.setItem(GAMES_KEY, JSON.stringify(games));
}

export function generateId() {
  return crypto.randomUUID();
}
