// TC-I04 — Assignment and reassignment append audit entries without replacing earlier history.
const request = require("supertest");
const app = require("../../src/app");
const { resetData, pool, getRequestRow, closeDb } = require("../helpers/db");
const { tokenFor, getSeedUser } = require("../helpers/auth");
const { createRequestInState } = require("../helpers/requests");

describe("FR-009 / NFR-009 — TC-I04 assignment is recorded in history", () => {
  let token;
  let managementId;
  let staffId;

  beforeAll(async () => {
    token = await tokenFor("management");
    managementId = (await getSeedUser("management")).user_id;
    staffId = (await getSeedUser("staff")).user_id;
  });

  beforeEach(resetData);
  afterAll(closeDb);

  test("assigning writes exactly one history row: who, what, when", async () => {
    const id = await createRequestInState("Open");
    const before = new Date();

    const res = await request(app)
      .put(`/api/requests/${id}/assign`)
      .set("Authorization", `Bearer ${token}`)
      .send({ staffId, dueDate: "2026-12-31" });

    const after = new Date();
    expect(res.status).toBe(200);

    // The assignment itself is stored
    const row = await getRequestRow(id);
    expect(row.assigned_staff_id).toBe(staffId);
    expect(row.status).toBe("Assigned");

    // ...and recorded: user, action, timestamp
    const { rows: history } = await pool.query(
      "SELECT * FROM request_status_history WHERE request_id = $1",
      [id]
    );
    expect(history).toHaveLength(1);

    const entry = history[0];
    expect(entry.changed_by).toBe(managementId);               // user
    expect(entry.old_status).toBe("Open");                      // action: from
    expect(entry.new_status).toBe("Assigned");                  // action: to
    expect(entry.change_note).toBe(`Assigned to staff ${staffId}, due 2026-12-31`);
    expect(entry.changed_at.getTime()).toBeGreaterThanOrEqual(before.getTime() - 2000); // timestamp
    expect(entry.changed_at.getTime()).toBeLessThanOrEqual(after.getTime() + 2000);
  });

  test("reassigning writes a second row; the first is kept", async () => {
    const id = await createRequestInState("Open");

    for (const dueDate of ["2026-12-30", "2026-12-31"]) {
      const res = await request(app)
        .put(`/api/requests/${id}/assign`)
        .set("Authorization", `Bearer ${token}`)
        .send({ staffId, dueDate });
      expect(res.status).toBe(200);
    }

    const { rows } = await pool.query(
      "SELECT old_status, new_status FROM request_status_history WHERE request_id = $1 ORDER BY history_id",
      [id]
    );
    expect(rows).toEqual([
      { old_status: "Open", new_status: "Assigned" },
      { old_status: "Assigned", new_status: "Assigned" },
    ]);
  });
});