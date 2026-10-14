// TC-U04 — Assignment due-date validation (FR-009, NFR-011)
// Technique: boundary value analysis on calendar dates, unit level.
// The database is mocked: these tests check only the validation in
// assignRequest, which runs before any database call.

jest.mock("../../src/config/database", () => ({
  query: jest.fn().mockResolvedValue({ rows: [] }),
  connect: jest.fn(),
}));

const { assignRequest } = require("../../src/controllers/requestController");

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

function callAssign(dueDate) {
  const req = {
    params: { id: "1" },
    body: { staffId: 2, dueDate },
    user: { user_id: 3, role: "management" },
  };
  const res = mockRes();
  return assignRequest(req, res).then(() => res);
}

describe("FR-009 / NFR-011 — TC-U04 assignment due-date validation", () => {
  beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  test.each([
    ["missing", undefined, "Please select a valid due date."],
    ["wrong format (slashes)", "2026/10/20", "Please select a valid due date."],
    ["wrong format (single-digit day)", "2026-10-1", "Please select a valid due date."],
    ["month 13", "2026-13-01", "The selected due date is invalid."],
    ["month 00", "2026-00-10", "The selected due date is invalid."],
    ["30 February", "2026-02-30", "The selected due date is invalid."],
    ["29 February in a non-leap year", "2027-02-29", "The selected due date is invalid."],
  ])("rejects %s (%s) with 400", async (_label, dueDate, message) => {
    const res = await callAssign(dueDate);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message });
  });

  test.each([
    ["29 February in a leap year", "2028-02-29"],
    ["last day of the year", "2026-12-31"],
    ["first day of the year", "2027-01-01"],
  ])("accepts %s (%s): no 400 returned", async (_label, dueDate) => {
    const res = await callAssign(dueDate);

    expect(res.status).not.toHaveBeenCalledWith(400);
  });
});