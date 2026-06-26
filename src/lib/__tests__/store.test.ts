import { describe, it, expect, vi, beforeEach } from "vitest";

const selectMock = vi.fn();
const insertMock = vi.fn();
const updateMock = vi.fn();
const deleteMock = vi.fn();
const eqMock = vi.fn();
const orderMock = vi.fn();
const singleMock = vi.fn();
const invokeMock = vi.fn();
const maybeSingleMock = vi.fn();

function buildChain(terminal: { data?: unknown; error?: unknown }) {
  const eq = vi.fn().mockReturnValue(terminal);
  const order = vi.fn().mockReturnValue(terminal);
  const single = vi.fn().mockReturnValue(terminal);
  const select = vi.fn().mockReturnValue({ order, single, eq });

  return {
    select: (...args: unknown[]) => {
      selectMock(...args);
      return { order, single, eq };
    },
    insert: (...args: unknown[]) => {
      insertMock(...args);
      return {
        select: (...a2: unknown[]) => {
          selectMock(...a2);
          return { single, order, eq };
        },
      };
    },
    update: (...args: unknown[]) => {
      updateMock(...args);
      return { eq };
    },
    delete: () => {
      deleteMock();
      return { eq };
    },
    order,
    single,
    eq,
  };
}

const fromMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (...args: unknown[]) => {
      fromMock(...args);
      return fromMock._chain;
    },
    functions: {
      invoke: (...args: unknown[]) => invokeMock(...args),
    },
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u1", email: "a@b.com" } } }),
    },
  },
}));

import {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getGames,
  addGame,
  updateGame,
  deleteGame,
  addMovies,
  addGames,
  getAllUsers,
  getActivityLogs,
} from "../store";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getMovies", () => {
  it("returns mapped movies on success", async () => {
    const raw = [
      { id: "m1", title: "A", image: "img", date: "2025-01-01", time: "10:00", description: null, created_at: "" },
    ];
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = buildChain({ data: raw, error: null });
    (fromMock._chain as ReturnType<typeof buildChain>).select = vi.fn().mockReturnValue({
      order: vi.fn().mockReturnValue({ data: raw, error: null }),
    });

    const movies = await getMovies();
    expect(fromMock).toHaveBeenCalledWith("movies");
    expect(movies).toEqual([
      { id: "m1", title: "A", image: "img", date: "2025-01-01", time: "10:00", description: undefined },
    ]);
  });

  it("throws on error", async () => {
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = {
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({ data: null, error: { message: "fail" } }),
      }),
    };

    await expect(getMovies()).rejects.toEqual({ message: "fail" });
  });
});

describe("addMovie", () => {
  it("inserts and returns the created movie", async () => {
    const created = { id: "m2", title: "B", image: "img2", date: "2025-02-01", time: "12:00", description: "desc" };
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = {
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: created, error: null }),
        }),
      }),
    };

    const movie = await addMovie({ title: "B", image: "img2", date: "2025-02-01", time: "12:00", description: "desc" });
    expect(movie.id).toBe("m2");
    expect(movie.description).toBe("desc");
  });

  it("throws on insert error", async () => {
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = {
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: null, error: { message: "insert fail" } }),
        }),
      }),
    };

    await expect(
      addMovie({ title: "X", image: "x", date: "d", time: "t" }),
    ).rejects.toEqual({ message: "insert fail" });
  });
});

describe("updateMovie", () => {
  it("calls update with correct params", async () => {
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = {
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: null }),
      }),
    };

    await expect(updateMovie("m1", { title: "Updated" })).resolves.toBeUndefined();
  });

  it("throws on update error", async () => {
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = {
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({ error: { message: "update fail" } }),
      }),
    };

    await expect(updateMovie("m1", { title: "X" })).rejects.toEqual({ message: "update fail" });
  });
});

describe("deleteMovie", () => {
  it("calls delete with correct id", async () => {
    const eqFn = vi.fn().mockReturnValue({ error: null });
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = {
      delete: vi.fn().mockReturnValue({ eq: eqFn }),
    };

    await expect(deleteMovie("m1")).resolves.toBeUndefined();
    expect(eqFn).toHaveBeenCalledWith("id", "m1");
  });
});

describe("getGames", () => {
  it("returns mapped games on success", async () => {
    const raw = [
      { id: "g1", team_a: "A", team_b: "B", league: "L", date: "2025-01-01", time: "15:00", created_at: "" },
    ];
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = {
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({ data: raw, error: null }),
      }),
    };

    const games = await getGames();
    expect(fromMock).toHaveBeenCalledWith("football_games");
    expect(games).toEqual([
      { id: "g1", teamA: "A", teamB: "B", league: "L", date: "2025-01-01", time: "15:00" },
    ]);
  });
});

describe("addGame", () => {
  it("inserts and returns the created game", async () => {
    const created = { id: "g2", team_a: "X", team_b: "Y", league: "L2", date: "2025-03-01", time: "18:00" };
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = {
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: created, error: null }),
        }),
      }),
    };

    const game = await addGame({ teamA: "X", teamB: "Y", league: "L2", date: "2025-03-01", time: "18:00" });
    expect(game.id).toBe("g2");
    expect(game.teamA).toBe("X");
    expect(game.teamB).toBe("Y");
  });
});

describe("updateGame", () => {
  it("builds partial update correctly", async () => {
    const updateFn = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({ error: null }),
    });
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = {
      update: updateFn,
    };

    await updateGame("g1", { teamA: "NewA" });
    expect(updateFn).toHaveBeenCalledWith({ team_a: "NewA" });
  });
});

describe("deleteGame", () => {
  it("calls delete with correct id", async () => {
    const eqFn = vi.fn().mockReturnValue({ error: null });
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = {
      delete: vi.fn().mockReturnValue({ eq: eqFn }),
    };

    await expect(deleteGame("g1")).resolves.toBeUndefined();
    expect(eqFn).toHaveBeenCalledWith("id", "g1");
  });
});

describe("addMovies (bulk)", () => {
  it("inserts multiple movies and returns them", async () => {
    const created = [
      { id: "m10", title: "M1", image: "i1", date: "d1", time: "t1", description: null },
      { id: "m11", title: "M2", image: "i2", date: "d2", time: "t2", description: "desc" },
    ];
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = {
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({ data: created, error: null }),
      }),
    };

    const movies = await addMovies([
      { title: "M1", image: "i1", date: "d1", time: "t1" },
      { title: "M2", image: "i2", date: "d2", time: "t2", description: "desc" },
    ]);
    expect(movies).toHaveLength(2);
    expect(movies[0].description).toBeUndefined();
    expect(movies[1].description).toBe("desc");
  });
});

describe("addGames (bulk)", () => {
  it("inserts multiple games and returns them", async () => {
    const created = [
      { id: "g10", team_a: "A1", team_b: "B1", league: "L1", date: "d1", time: "t1" },
    ];
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = {
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({ data: created, error: null }),
      }),
    };

    const games = await addGames([
      { teamA: "A1", teamB: "B1", league: "L1", date: "d1", time: "t1" },
    ]);
    expect(games).toHaveLength(1);
    expect(games[0].teamA).toBe("A1");
  });
});

describe("getAllUsers", () => {
  it("returns data from edge function", async () => {
    const users = [{ id: "u1", email: "a@b.com", isAdmin: true, createdAt: "2025-01-01" }];
    invokeMock.mockResolvedValue({ data: users, error: null });

    const result = await getAllUsers();
    expect(invokeMock).toHaveBeenCalledWith("list-users");
    expect(result).toEqual(users);
  });

  it("throws on error", async () => {
    invokeMock.mockResolvedValue({ data: null, error: { message: "edge fn error" } });

    await expect(getAllUsers()).rejects.toThrow("edge fn error");
  });
});

describe("getActivityLogs", () => {
  it("returns mapped activity logs", async () => {
    const raw = [
      {
        id: "a1",
        action: "grant_admin",
        target_user_email: "t@b.com",
        performed_by_email: "p@b.com",
        created_at: "2025-01-01",
      },
    ];
    (fromMock as ReturnType<typeof vi.fn> & { _chain: unknown })._chain = {
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({ data: raw, error: null }),
      }),
    };

    const logs = await getActivityLogs();
    expect(logs).toEqual([
      {
        id: "a1",
        action: "grant_admin",
        targetUserEmail: "t@b.com",
        performedByEmail: "p@b.com",
        createdAt: "2025-01-01",
      },
    ]);
  });
});
