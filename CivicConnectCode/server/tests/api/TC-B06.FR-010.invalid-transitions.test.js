const request = require("supertest");
const app = require("../../src/app");
const { resetData, closeDb } = require("../helpers/db");
const { tokenFor, getSeedUser } = require("../helpers/auth");
const { createRequestInState, getStatus, getHistory } = require("../helpers/requests");

describe("FR-010 / FR-012 — TC-B06 invalid transitions blocked", () => {
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

  describe("transition not allowed from the current status → 409", () => {
    test.each([
      // [from, to, role, why]
      ["Open", "Closed", "management", "closing a request that was never worked on (FR-012)"],
      ["Pending", "Closed", "management", "closing a request that was never worked on (FR-012)"],
      ["In Progress", "Closed", "management", "closing before Resolved (FR-012)"],
      ["Open", "In Progress", "management", "skipping assignment"],
      ["Assigned", "Resolved", "staff", "skipping In Progress"],
      ["Resolved", "In Progress", "staff", "reopening is not in the agreed model"],
      ["Closed", "In Progress", "management", "Closed is final"],
      ["Closed", "Pending", "management", "Closed is final"],
    ])("%s → %s by %s is rejected (%s)", async (from, to, role) => {
      const id = await createRequestInState(from, { assigned: from !== "Open" && from !== "Pending" });

      const res = await request(app)
        .patch(`/api/requests/${id}/status`)
        .set("Authorization", `Bearer ${tokens[role]}`)
        .send({ status: to });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({ message: `Cannot change status from ${from} to ${to}.` });
      expect(await getStatus(id)).toBe(from);
      expect(await getHistory(id)).toEqual([]);
    });
  });

  describe("assignment once work has started → 409", () => {
    test.each(["In Progress", "On Hold", "Resolved", "Closed"])(
      "assigning a request that is %s is rejected",
      async (from) => {
        const id = await createRequestInState(from, { assigned: true });

        const res = await request(app)
          .put(`/api/requests/${id}/assign`)
          .set("Authorization", `Bearer ${tokens.management}`)
          .send({ staffId, dueDate: "2026-12-31" });

        expect(res.status).toBe(409);
        expect(res.body).toEqual({
          message: `This request cannot be assigned while it is ${from}.`,
        });
        expect(await getStatus(id)).toBe(from);
        expect(await getHistory(id)).toEqual([]);
      }
    );
  });

  describe("wrong role for the transition → 403", () => {
    test("staff cannot close a Resolved request (management only)", async () => {
      const id = await createRequestInState("Resolved", { assigned: true });

      const res = await request(app)
        .patch(`/api/requests/${id}/status`)
        .set("Authorization", `Bearer ${tokens.staff}`)
        .send({ status: "Closed" });

      expect(res.status).toBe(403);
      expect(res.body).toEqual({ message: "You are not permitted to select this status." });
      expect(await getStatus(id)).toBe("Resolved");
      expect(await getHistory(id)).toEqual([]);
    });

    test("a requester cannot change status at all", async () => {
      const id = await createRequestInState("Resolved", { assigned: true });

      const res = await request(app)
        .patch(`/api/requests/${id}/status`)
        .set("Authorization", `Bearer ${tokens.requester}`)
        .send({ status: "Closed" });

      expect(res.status).toBe(403);
      expect(res.body).toEqual({ message: "You do not have permission to access this resource." });
      expect(await getStatus(id)).toBe("Resolved");
      expect(await getHistory(id)).toEqual([]);
    });
  });
});