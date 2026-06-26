import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn().mockReturnValue({
    user: null,
    session: null,
    isAdmin: false,
    loading: false,
    signOut: vi.fn(),
  }),
}));

import { useAuth } from "@/hooks/useAuth";

function renderHeader(initialRoute = "/") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Header />
    </MemoryRouter>,
  );
}

describe("Header", () => {
  it("renders the viewing center name", () => {
    renderHeader();
    expect(screen.getByText("ASIEMAN VIEWING CENTER")).toBeInTheDocument();
  });

  it("renders the location subtitle", () => {
    renderHeader();
    expect(screen.getByText("KOFAR KUDU KAZAURE")).toBeInTheDocument();
  });

  it("shows 'Admin' link when not on admin page and user is not logged in", () => {
    renderHeader("/");
    const adminLink = screen.getByText("Admin");
    expect(adminLink).toBeInTheDocument();
    expect(adminLink.closest("a")).toHaveAttribute("href", "/login");
  });

  it("shows 'Admin' link pointing to /admin when user is logged in", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: "u1", email: "a@b.com" } as ReturnType<typeof useAuth>["user"],
      session: null,
      isAdmin: false,
      loading: false,
      signOut: vi.fn(),
    });

    renderHeader("/");
    const adminLink = screen.getByText("Admin");
    expect(adminLink.closest("a")).toHaveAttribute("href", "/admin");
  });

  it("shows 'View Site' link when on admin page", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: "u1", email: "a@b.com" } as ReturnType<typeof useAuth>["user"],
      session: null,
      isAdmin: true,
      loading: false,
      signOut: vi.fn(),
    });

    renderHeader("/admin");
    const viewSiteLink = screen.getByText("View Site");
    expect(viewSiteLink).toBeInTheDocument();
    expect(viewSiteLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("links the logo to the home page", () => {
    renderHeader();
    const logoLink = screen.getByText("ASIEMAN VIEWING CENTER").closest("a");
    expect(logoLink).toHaveAttribute("href", "/");
  });
});
