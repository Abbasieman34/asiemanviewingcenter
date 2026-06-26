import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MovieCard from "../MovieCard";
import type { Movie } from "@/lib/store";

const baseMovie: Movie = {
  id: "m1",
  title: "The Matrix",
  image: "https://example.com/matrix.jpg",
  date: "2025-06-10",
  time: "20:00",
};

describe("MovieCard", () => {
  it("renders the movie title", () => {
    render(<MovieCard movie={baseMovie} />);
    expect(screen.getByText("The Matrix")).toBeInTheDocument();
  });

  it("renders the poster image with correct alt text", () => {
    render(<MovieCard movie={baseMovie} />);
    const img = screen.getByAltText("Movie poster for The Matrix");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/matrix.jpg");
  });

  it("renders the date", () => {
    render(<MovieCard movie={baseMovie} />);
    expect(screen.getByText("2025-06-10")).toBeInTheDocument();
  });

  it("renders the time", () => {
    render(<MovieCard movie={baseMovie} />);
    expect(screen.getByText("20:00")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    const movie = { ...baseMovie, description: "A sci-fi classic" };
    render(<MovieCard movie={movie} />);
    expect(screen.getByText("A sci-fi classic")).toBeInTheDocument();
  });

  it("does not render a description paragraph when not provided", () => {
    const { container } = render(<MovieCard movie={baseMovie} />);
    const paragraphs = container.querySelectorAll(".line-clamp-2");
    expect(paragraphs).toHaveLength(0);
  });

  it("sets lazy loading on the image", () => {
    render(<MovieCard movie={baseMovie} />);
    const img = screen.getByAltText("Movie poster for The Matrix");
    expect(img).toHaveAttribute("loading", "lazy");
  });
});
