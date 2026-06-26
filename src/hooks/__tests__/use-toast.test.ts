import { describe, it, expect } from "vitest";
import { reducer } from "../use-toast";

function makeToast(overrides: Record<string, unknown> = {}) {
  return {
    id: "1",
    open: true,
    title: "Test",
    onOpenChange: () => {},
    ...overrides,
  };
}

describe("use-toast reducer", () => {
  describe("ADD_TOAST", () => {
    it("adds a toast to an empty list", () => {
      const toast = makeToast();
      const state = reducer({ toasts: [] }, { type: "ADD_TOAST", toast });
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].id).toBe("1");
    });

    it("prepends the new toast (most recent first)", () => {
      const existing = makeToast({ id: "old" });
      const added = makeToast({ id: "new" });
      const state = reducer(
        { toasts: [existing] },
        { type: "ADD_TOAST", toast: added },
      );
      expect(state.toasts[0].id).toBe("new");
    });

    it("enforces the toast limit (keeps only 1)", () => {
      const existing = makeToast({ id: "old" });
      const added = makeToast({ id: "new" });
      const state = reducer(
        { toasts: [existing] },
        { type: "ADD_TOAST", toast: added },
      );
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].id).toBe("new");
    });
  });

  describe("UPDATE_TOAST", () => {
    it("updates matching toast by id", () => {
      const toast = makeToast({ id: "1", title: "Old" });
      const state = reducer(
        { toasts: [toast] },
        { type: "UPDATE_TOAST", toast: { id: "1", title: "New" } },
      );
      expect(state.toasts[0].title).toBe("New");
    });

    it("does not modify other toasts", () => {
      const t1 = makeToast({ id: "1", title: "One" });
      const t2 = makeToast({ id: "2", title: "Two" });
      const state = reducer(
        { toasts: [t1, t2] },
        { type: "UPDATE_TOAST", toast: { id: "2", title: "Updated" } },
      );
      expect(state.toasts[0].title).toBe("One");
      expect(state.toasts[1].title).toBe("Updated");
    });
  });

  describe("DISMISS_TOAST", () => {
    it("sets open to false for a specific toast", () => {
      const toast = makeToast({ id: "1", open: true });
      const state = reducer(
        { toasts: [toast] },
        { type: "DISMISS_TOAST", toastId: "1" },
      );
      expect(state.toasts[0].open).toBe(false);
    });

    it("sets open to false for all toasts when no id is provided", () => {
      const t1 = makeToast({ id: "1", open: true });
      const t2 = makeToast({ id: "2", open: true });
      const state = reducer(
        { toasts: [t1, t2] },
        { type: "DISMISS_TOAST" },
      );
      expect(state.toasts.every((t) => t.open === false)).toBe(true);
    });

    it("does not dismiss non-matching toasts", () => {
      const t1 = makeToast({ id: "1", open: true });
      const t2 = makeToast({ id: "2", open: true });
      const state = reducer(
        { toasts: [t1, t2] },
        { type: "DISMISS_TOAST", toastId: "1" },
      );
      expect(state.toasts[0].open).toBe(false);
      expect(state.toasts[1].open).toBe(true);
    });
  });

  describe("REMOVE_TOAST", () => {
    it("removes a specific toast by id", () => {
      const toast = makeToast({ id: "1" });
      const state = reducer(
        { toasts: [toast] },
        { type: "REMOVE_TOAST", toastId: "1" },
      );
      expect(state.toasts).toHaveLength(0);
    });

    it("clears all toasts when no id is provided", () => {
      const t1 = makeToast({ id: "1" });
      const t2 = makeToast({ id: "2" });
      const state = reducer(
        { toasts: [t1, t2] },
        { type: "REMOVE_TOAST" },
      );
      expect(state.toasts).toHaveLength(0);
    });

    it("preserves other toasts when removing by id", () => {
      const t1 = makeToast({ id: "1" });
      const t2 = makeToast({ id: "2" });
      const state = reducer(
        { toasts: [t1, t2] },
        { type: "REMOVE_TOAST", toastId: "1" },
      );
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].id).toBe("2");
    });
  });
});
