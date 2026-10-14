//Short explanation of test: 8 wrong-role attempts → 403, and the ones that try to change data leave no trace
const request = require("supertest");
const app = require("../../src/app");
const { resetData, closeDb } = require("../helpers/db");
const { tokenFor, getSeedUser } = require("../helpers/auth");
const { createRequestInState, getStatus, getHistory } = require("../helpers/requests");
const { expectNoInternalDetails } = require("../helpers/security");

const FORBIDDEN = { message: "You do not have permission to access this resource." };

describe("NFR-002 / NFR-003 — TC-I02 wrong role → 403", () => {
  let tokens;
  let staffId;

  beforeAll(async () => {
    tokens = {
      requester: await tokenFor("requester"),
      staff: await tokenFor("staff"),
      management: await tokenFor("management"),
    };
    staffId = (await getSeedUser("staff")).user_id;
  });

  beforeEach(resetData);
  afterAll(closeDb);

  describe("read-only routes the role may not see", () => {
    test.each([
      ["requester", "GET", "/api/requests", "all requests (management)"],
      ["requester", "GET", "/api/requests/staff", "staff list (management)"],
      ["requester", "GET", "/api/requests/assigned", "assigned work (staff)"],
      ["staff", "GET", "/api/requests", "all requests (management)"],
      ["management", "GET", "/api/requests/mine", "own requests (requester)"],
    ])("%s → %s %s (%s) → 403", async (role, method, path) => {
      const call = request(app)[method.toLowerCase()](path);
      const res = await call.set("Authorization", `Bearer ${tokens[role]}`);

      expect(res.status).toBe(403);
      expect(res.body).toEqual(FORBIDDEN);
      expectNoInternalDetails(res.body);
    });
  });

  describe("changing routes: blocked AND nothing changes", () => {
    test("requester cannot assign a request", async () => {
      const id = await createRequestInState("Open");

      const res = await request(app)
        .put(`/api/requests/${id}/assign`)
        .set("Authorization", `Bearer ${tokens.requester}`)
        .send({ staffId, dueDate: "2026-12-31" });

      expect(res.status).toBe(403);
      expect(res.body).toEqual(FORBIDDEN);
      expect(await getStatus(id)).toBe("Open");
      expect(await getHistory(id)).toEqual([]);
    });

    test("requester cannot change a status", async () => {
      const id = await createRequestInState("Assigned", { assigned: true });

      const res = await request(app)
        .patch(`/api/requests/${id}/status`)
        .set("Authorization", `Bearer ${tokens.requester}`)
        .send({ status: "In Progress" });

      expect(res.status).toBe(403);
      expect(res.body).toEqual(FORBIDDEN);
      expect(await getStatus(id)).toBe("Assigned");
      expect(await getHistory(id)).toEqual([]);
    });

    test("staff cannot submit a request as a requester", async () => {
      const res = await request(app)
        .post("/api/requests")
        .set("Authorization", `Bearer ${tokens.staff}`)
        .send({ title: "X", description: "Y", category: "Maintenance" });

      expect(res.status).toBe(403);
      expect(res.body).toEqual(FORBIDDEN);
    });
  });
});