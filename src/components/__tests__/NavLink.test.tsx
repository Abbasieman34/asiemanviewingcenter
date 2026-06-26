import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NavLink } from "../NavLink";

function renderWithRouter(ui: React.ReactElement, initialEntries = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>,
  );
}

describe("NavLink", () => {
  it("renders a link with the given text", () => {
    renderWithRouter(<NavLink to="/about">About</NavLink>);
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("renders an anchor element pointing to the correct path", () => {
    renderWithRouter(<NavLink to="/about">About</NavLink>);
    const link = screen.getByRole("link", { name: "About" });
    expect(link).toHaveAttribute("href", "/about");
  });

  it("applies the base className", () => {
    renderWithRouter(
      <NavLink to="/other" className="base-class">
        Link
      </NavLink>,
    );
    const link = screen.getByRole("link", { name: "Link" });
    expect(link.className).toContain("base-class");
  });

  it("applies the activeClassName when the route is active", () => {
    renderWithRouter(
      <NavLink to="/" activeClassName="active">
        Home
      </NavLink>,
      ["/"],
    );
    const link = screen.getByRole("link", { name: "Home" });
    expect(link.className).toContain("active");
  });

  it("does not apply the activeClassName when the route is not active", () => {
    renderWithRouter(
      <NavLink to="/other" activeClassName="active">
        Other
      </NavLink>,
      ["/"],
    );
    const link = screen.getByRole("link", { name: "Other" });
    expect(link.className).not.toContain("active");
  });

  it("has displayName set to NavLink", () => {
    expect(NavLink.displayName).toBe("NavLink");
  });
});
