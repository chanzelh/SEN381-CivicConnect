// TC-I01 — Protected routes reject missing, forged, expired and role-less tokens without leaking internals.
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const { resetData, countRequests, closeDb } = require("../helpers/db");
const { getSeedUser } = require("../helpers/auth");
const { expectNoInternalDetails } = require("../helpers/security");

const PROTECTED_ROUTES = [
  ["GET", "/api/requests"],
  ["GET", "/api/requests/mine"],
  ["GET", "/api/requests/assigned"],
  ["GET", "/api/requests/staff"],
  ["POST", "/api/requests"],
  ["PUT", "/api/requests/1/assign"],
  ["PATCH", "/api/requests/1/status"],
];

function call(method, path) {
  return request(app)[method.toLowerCase()](path);
}

describe("NFR-001 / NFR-003 — TC-I01 no valid token → 401", () => {
  let requester;

  beforeAll(async () => {
    requester = await getSeedUser("requester");
  });

  beforeEach(resetData);
  afterAll(closeDb);

  describe("no Authorization header on every protected route", () => {
    test.each(PROTECTED_ROUTES)("%s %s → 401", async (method, path) => {
      const res = await call(method, path).send({});

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "Authentication required. Please log in." });
      expectNoInternalDetails(res.body);
    });
  });

  describe("invalid tokens are rejected", () => {
    test.each([
      [
        "header without 'Bearer '",
        () => "Token abc123",
        "Authentication required. Please log in.",
      ],
      [
        "random text as token",
        () => "Bearer not-a-real-token",
        "Invalid or expired token. Please log in again.",
      ],
      [
        "token signed with the wrong secret (forged)",
        () => `Bearer ${jwt.sign({ user_id: requester.user_id, role: "management" }, "attacker-secret")}`,
        "Invalid or expired token. Please log in again.",
      ],
      [
        "expired token",
        () =>
          `Bearer ${jwt.sign(
            { user_id: requester.user_id, role: "requester", exp: Math.floor(Date.now() / 1000) - 60 },
            process.env.JWT_SECRET
          )}`,
        "Invalid or expired token. Please log in again.",
      ],
      [
        "valid signature but no role",
        () => `Bearer ${jwt.sign({ user_id: requester.user_id }, process.env.JWT_SECRET)}`,
        "Invalid authentication token.",
      ],
    ])("%s → 401", async (_label, header, message) => {
      const res = await request(app)
        .get("/api/requests/mine")
        .set("Authorization", header());

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message });
      expectNoInternalDetails(res.body);
    });
  });

  test("a submission without a token stores nothing", async () => {
    const res = await request(app)
      .post("/api/requests")
      .send({ title: "Broken hall light", description: "Flickers.", category: "Maintenance" });

    expect(res.status).toBe(401);
    expect(await countRequests()).toBe(0);
  });
});