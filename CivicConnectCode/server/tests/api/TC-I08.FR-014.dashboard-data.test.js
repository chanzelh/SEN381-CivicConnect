// TC-I08 — Eight seeded requests produce the expected status, category and overdue counts.
const request = require("supertest");
const app = require("../../src/app");
const { resetData, closeDb } = require("../helpers/db");
const { tokenFor } = require("../helpers/auth");
const { createRequestInState } = require("../helpers/requests");

const SEED = [
  { status: "Open", category: "Maintenance", dueDate: null, assigned: false },
  { status: "Pending", category: "Maintenance", dueDate: null, assigned: false },
  { status: "Assigned", category: "IT Support", dueDate: "2020-01-15", assigned: true },   
  { status: "In Progress", category: "IT Support", dueDate: "2099-12-31", assigned: true },
  { status: "On Hold", category: "Security", dueDate: "2020-03-01", assigned: true },     
  { status: "Resolved", category: "Security", dueDate: "2020-01-01", assigned: true },    
  { status: "Closed", category: "Equipment", dueDate: "2020-01-01", assigned: true },     
  { status: "Closed", category: "Maintenance", dueDate: "2099-01-01", assigned: true },
];

const countBy = (items, key) =>
  items.reduce((acc, item) => ({ ...acc, [item[key]]: (acc[item[key]] || 0) + 1 }), {});

describe("FR-013 / FR-014 / FR-015 — TC-I08 dashboard data matches seeded data", () => {
  let token;
  let seededIds;

  beforeAll(async () => {
    token = await tokenFor("management");
  });

  beforeEach(async () => {
    await resetData();
    seededIds = [];
    for (const r of SEED) {
      seededIds.push(
        await createRequestInState(r.status, {
          assigned: r.assigned,
          dueDate: r.dueDate,
          category: r.category,
        })
      );
    }
  });

  afterAll(closeDb);

  async function getList() {
    const res = await request(app).get("/api/requests").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    return res.body;
  }

  test("every seeded request is returned once, with its status, category and due date", async () => {
    const list = await getList();

    expect(list).toHaveLength(SEED.length);
    expect(list.map((r) => r.request_id).sort((a, b) => a - b)).toEqual(seededIds);

    SEED.forEach((expected, i) => {
      const item = list.find((r) => r.request_id === seededIds[i]);
      expect(item.status).toBe(expected.status);
      expect(item.category).toBe(expected.category);
      expect(item.dueDate).toBe(expected.dueDate);
    });
  });

  test("counts by status match the seeded data", async () => {
    expect(countBy(await getList(), "status")).toEqual({
      Open: 1,
      Pending: 1,
      Assigned: 1,
      "In Progress": 1,
      "On Hold": 1,
      Resolved: 1,
      Closed: 2,
    });
  });

  test("counts by category match the seeded data", async () => {
    expect(countBy(await getList(), "category")).toEqual({
      Maintenance: 3,
      "IT Support": 2,
      Security: 2,
      Equipment: 1,
    });
  });

  test("the data needed for the overdue count is correct (2 overdue)", async () => {
    const today = new Date().toISOString().slice(0, 10);
    const overdue = (await getList()).filter(
      (r) => r.dueDate && r.dueDate < today && !["Resolved", "Closed"].includes(r.status)
    );

    expect(overdue.map((r) => r.status).sort()).toEqual(["Assigned", "On Hold"]);
  });
});