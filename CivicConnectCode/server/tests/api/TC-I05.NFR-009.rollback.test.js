// Short Explanation: The database is forced to refuse history rows, and the whole change is undone. A control check proves the failure was caused by the injected fault
const request = require("supertest");
const app = require("../../src/app");
const { resetData, pool, getRequestRow, closeDb } = require("../helpers/db");
const { tokenFor, getSeedUser } = require("../helpers/auth");
const { createRequestInState, getStatus, getHistory } = require("../helpers/requests");
const { expectNoInternalDetails } = require("../helpers/security");

async function blockHistoryWrites() {
  await pool.query(
    "ALTER TABLE request_status_history ADD CONSTRAINT tc_i05_block_history CHECK (false) NOT VALID"
  );
}

async function unblockHistoryWrites() {
  await pool.query(
    "ALTER TABLE request_status_history DROP CONSTRAINT IF EXISTS tc_i05_block_history"
  );
}

describe("NFR-009 / RISK-008 — TC-I05 rollback when the history write fails", () => {
  let tokens;
  let staffId;
  let consoleError;

  beforeAll(async () => {
    tokens = {
      staff: await tokenFor("staff"),
      management: await tokenFor("management"),
    };
    staffId = (await getSeedUser("staff")).user_id;
  });

  beforeEach(async () => {
    await resetData();
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(async () => {
    await unblockHistoryWrites(); // always restore, even if a check failed
    consoleError.mockRestore();
  });

  afterAll(closeDb);

  test("status change: nothing is saved when history cannot be written", async () => {
    const id = await createRequestInState("Assigned", { assigned: true });
    await blockHistoryWrites();

    const res = await request(app)
      .patch(`/api/requests/${id}/status`)
      .set("Authorization", `Bearer ${tokens.staff}`)
      .send({ status: "In Progress" });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Could not update request status." });
    expectNoInternalDetails(res.body);

    expect(await getStatus(id)).toBe("Assigned"); // rolled back
    expect(await getHistory(id)).toEqual([]);
  });

  test("assignment: staff and due date are not saved when history cannot be written", async () => {
    const id = await createRequestInState("Open");
    await blockHistoryWrites();

    const res = await request(app)
      .put(`/api/requests/${id}/assign`)
      .set("Authorization", `Bearer ${tokens.management}`)
      .send({ staffId, dueDate: "2026-12-31" });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Could not assign the request." });
    expectNoInternalDetails(res.body);

    const row = await getRequestRow(id);
    expect(row.status).toBe("Open");
    expect(row.assigned_staff_id).toBeNull();
    expect(row.due_date).toBeNull();
    expect(await getHistory(id)).toEqual([]);
  });

  test("control: with history writes allowed, the same change succeeds", async () => {
    const id = await createRequestInState("Assigned", { assigned: true });

    const res = await request(app)
      .patch(`/api/requests/${id}/status`)
      .set("Authorization", `Bearer ${tokens.staff}`)
      .send({ status: "In Progress" });

    expect(res.status).toBe(200);
    expect(await getStatus(id)).toBe("In Progress");
    expect(await getHistory(id)).toHaveLength(1);
  });
});