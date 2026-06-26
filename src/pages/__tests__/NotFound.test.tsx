import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "../NotFound";

function renderNotFound(route = "/some-bad-path") {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <NotFound />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("NotFound", () => {
  it("renders the 404 heading", () => {
    renderNotFound();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders the not-found message", () => {
    renderNotFound();
    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
  });

  it("renders a link back to home", () => {
    renderNotFound();
    const link = screen.getByText("Return to Home");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("logs the 404 error to console", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderNotFound("/bad-route");
    expect(spy).toHaveBeenCalledWith(
      "404 Error: User attempted to access non-existent route:",
      "/bad-route",
    );
    spy.mockRestore();
  });
});
