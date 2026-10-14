// TC-U02 — Overdue rule: due date before, on and after today;

import { describe, test, expect, beforeAll, afterAll, vi } from "vitest";
import { isOverdue } from "../../src/utils/overdue";

describe("FR-014 — TC-U02 overdue rule", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 15, 12, 0, 0)); // 15 Oct 2026, noon
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe("boundaries around today for an open request", () => {
    test.each([
      ["two days ago", "2026-10-13", true],
      ["yesterday (just past the boundary)", "2026-10-14", true],
      ["today (on the boundary)", "2026-10-15", false],
      ["tomorrow", "2026-10-16", false],
    ])("due %s (%s) → overdue = %s", (_label, dueDate, expected) => {
      expect(isOverdue(dueDate, "In Progress")).toBe(expected);
    });
  });

  describe("finished requests are never overdue", () => {
    test.each(["Resolved", "Closed"])("past due but %s → false", (status) => {
      expect(isOverdue("2026-10-01", status)).toBe(false);
    });
  });

  describe("unfinished statuses past their due date are overdue", () => {
    test.each(["Open", "Pending", "Assigned", "In Progress", "On Hold"])(
      "past due and %s → true",
      (status) => {
        expect(isOverdue("2026-10-01", status)).toBe(true);
      }
    );
  });

  describe("missing or unusable due dates are not overdue", () => {
    test.each([
      ["no due date", undefined],
      ["empty string", ""],
      ["null", null],
      ["not a date", "soon"],
    ])("%s → false", (_label, dueDate) => {
      expect(isOverdue(dueDate, "In Progress")).toBe(false);
    });
  });
});