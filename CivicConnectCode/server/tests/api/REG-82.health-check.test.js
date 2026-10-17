// Health check (#82): supports staging verification (#81) and
// availability monitoring (NFR-008, #89). Not a baseline test case.
const request = require("supertest");
const app = require("../../src/app");
const { pool, closeDb } = require("../helpers/db");

describe("#82 health check", () => {
  afterAll(closeDb);

  test("GET /health returns 200 and ok when the database answers", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok", database: "ok" });
    expect(Number.isNaN(Date.parse(res.body.checkedAt))).toBe(false);
  });

  test("GET /health returns 503 without internal details when the database fails", async () => {
    const spy = jest.spyOn(pool, "query").mockRejectedValueOnce(new Error("connection refused"));
    const mute = jest.spyOn(console, "error").mockImplementation(() => {});

    const res = await request(app).get("/health");

    expect(res.status).toBe(503);
    expect(res.body).toMatchObject({ status: "degraded", database: "unavailable" });
    expect(JSON.stringify(res.body)).not.toMatch(/connection refused/);

    spy.mockRestore();
    mute.mockRestore();
  });
});
