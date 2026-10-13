const request = require("supertest");
const app = require("../../src/app");
const pool = require("../../src/config/database");

describe("CI smoke (pipeline wiring, not counted in the test baseline)", () => {
  afterAll(() => pool.end());

  test("database is reachable and schema is applied", async () => {
    const { rows } = await pool.query(
      "SELECT to_regclass('public.service_requests') AS t"
    );
    expect(rows[0].t).toBe("service_requests");
  });

  test("app loads and returns 404 for an unknown route", async () => {
    const res = await request(app).get("/api/not-a-route");
    expect(res.status).toBe(404);
  });
});