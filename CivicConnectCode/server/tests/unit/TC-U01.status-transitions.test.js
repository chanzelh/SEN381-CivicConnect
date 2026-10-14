// TC-U01 — Transition rule allows only valid status changes (FR-010, FR-012)

const { isValidTransition, canAssign } = require("../../src/utils/statusRules");

describe("FR-010 — TC-U01 status transition rules", () => {
  describe("allowed moves are accepted", () => {
    test.each([
      ["Open", "Pending"],
      ["Assigned", "In Progress"],
      ["In Progress", "On Hold"],
      ["In Progress", "Resolved"],
      ["On Hold", "In Progress"],
      ["Resolved", "Closed"],
    ])("%s → %s is allowed", (from, to) => {
      expect(isValidTransition(from, to)).toBe(true);
    });
  });

  describe("invalid moves are rejected", () => {
    test.each([
      ["Pending", "Closed", "closing a request that was never resolved (FR-012)"],
      ["Open", "Closed", "closing a request that was never resolved (FR-012)"],
      ["In Progress", "Closed", "closing before Resolved (FR-012)"],
      ["Open", "In Progress", "skipping assignment"],
      ["Assigned", "Resolved", "skipping In Progress"],
      ["Resolved", "In Progress", "reopening is not in the agreed model"],
      ["Closed", "In Progress", "Closed is final"],
      ["Closed", "Open", "Closed is final"],
      ["Open", "Assigned", "Assigned is only reached through the assign endpoint"],
      ["In Progress", "In Progress", "a status cannot move to itself"],
    ])("%s → %s is rejected (%s)", (from, to) => {
      expect(isValidTransition(from, to)).toBe(false);
    });

    test("an unknown current status is rejected", () => {
      expect(isValidTransition("Done", "Closed")).toBe(false);
    });

    test("an unknown target status is rejected", () => {
      expect(isValidTransition("In Progress", "Finished")).toBe(false);
    });
  });

  describe("assignment is only allowed before work starts", () => {
    test.each(["Open", "Pending", "Assigned"])("can assign while %s", (status) => {
      expect(canAssign(status)).toBe(true);
    });

    test.each(["In Progress", "On Hold", "Resolved", "Closed"])(
      "cannot assign while %s",
      (status) => {
        expect(canAssign(status)).toBe(false);
      }
    );
  });
});