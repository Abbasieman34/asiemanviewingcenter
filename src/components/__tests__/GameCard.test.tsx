import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GameCard from "../GameCard";
import type { FootballGame } from "@/lib/store";

const game: FootballGame = {
  id: "g1",
  teamA: "Manchester United",
  teamB: "Liverpool",
  league: "Premier League",
  date: "2025-06-15",
  time: "15:00",
};

describe("GameCard", () => {
  it("renders the league name", () => {
    render(<GameCard game={game} />);
    expect(screen.getByText("Premier League")).toBeInTheDocument();
  });

  it("renders both team names", () => {
    render(<GameCard game={game} />);
    expect(screen.getByText("Manchester United")).toBeInTheDocument();
    expect(screen.getByText("Liverpool")).toBeInTheDocument();
  });

  it("renders the VS separator", () => {
    render(<GameCard game={game} />);
    expect(screen.getByText("VS")).toBeInTheDocument();
  });

  it("renders the date", () => {
    render(<GameCard game={game} />);
    expect(screen.getByText("2025-06-15")).toBeInTheDocument();
  });

  it("renders the time", () => {
    render(<GameCard game={game} />);
    expect(screen.getByText("15:00")).toBeInTheDocument();
  });
});
