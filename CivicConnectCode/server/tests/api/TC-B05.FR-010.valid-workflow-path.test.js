const request = require("supertest");
const app = require("../../src/app");
const { resetData, closeDb } = require("../helpers/db");
const { tokenFor, getSeedUser } = require("../helpers/auth");
const { getStatus, getHistory } = require("../helpers/requests");

describe("FR-010 — TC-B05 valid workflow path", () => {
  let tokens;
  let staffId;
  let managementId;

  beforeAll(async () => {
    tokens = {
      requester: await tokenFor("requester"),
      staff: await tokenFor("staff"),
      management: await tokenFor("management"),
    };
    staffId = (await getSeedUser("staff")).user_id;
    managementId = (await getSeedUser("management")).user_id;
  });

  beforeEach(resetData);
  afterAll(closeDb);

  async function submit() {
    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${tokens.requester}`)
      .send({ title: "Broken hall light", description: "Flickers.", category: "Maintenance" });
    expect(res.status).toBe(201);
    return res.body.request.id;
  }

  async function assign(id) {
    const res = await request(app)
      .put(`/api/requests/${id}/assign`)
      .set("Authorization", `Bearer ${tokens.management}`)
      .send({ staffId, dueDate: "2026-12-31" });
    expect(res.status).toBe(200);
    expect(res.body.request.status).toBe("Assigned");
  }

  async function move(id, role, status) {
    const res = await request(app)
      .patch(`/api/requests/${id}/status`)
      .set("Authorization", `Bearer ${tokens[role]}`)
      .send({ status });
    expect(res.status).toBe(200);
    expect(res.body.request.status).toBe(status);
    expect(await getStatus(id)).toBe(status);
  }

  test("main path: Open → Assigned → In Progress → Resolved → Closed", async () => {
    const id = await submit();
    expect(await getStatus(id)).toBe("Open");

    await assign(id);
    await move(id, "staff", "In Progress");
    await move(id, "staff", "Resolved");
    await move(id, "management", "Closed");

    expect(await getHistory(id)).toEqual([
      { old_status: "Open", new_status: "Assigned", changed_by: managementId },
      { old_status: "Assigned", new_status: "In Progress", changed_by: staffId },
      { old_status: "In Progress", new_status: "Resolved", changed_by: staffId },
      { old_status: "Resolved", new_status: "Closed", changed_by: managementId },
    ]);
  });

  test("alternative path: Open → Pending → Assigned → In Progress → On Hold → In Progress → Resolved → Closed", async () => {
    const id = await submit();

    await move(id, "management", "Pending");
    await assign(id);
    await move(id, "staff", "In Progress");
    await move(id, "staff", "On Hold");
    await move(id, "staff", "In Progress");
    await move(id, "staff", "Resolved");
    await move(id, "management", "Closed");

    const history = await getHistory(id);
    expect(history.map((h) => `${h.old_status} → ${h.new_status}`)).toEqual([
      "Open → Pending",
      "Pending → Assigned",
      "Assigned → In Progress",
      "In Progress → On Hold",
      "On Hold → In Progress",
      "In Progress → Resolved",
      "Resolved → Closed",
    ]);
  });
});