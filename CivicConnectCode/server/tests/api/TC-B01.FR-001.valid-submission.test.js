const request = require("supertest");
const app = require("../../src/app");
const { resetData, getRequestRow, closeDb } = require("../helpers/db");
const { tokenFor, getSeedUser } = require("../helpers/auth");

const CATEGORIES = [
  "Maintenance",
  "IT Support",
  "Security",
  "Equipment",
  "Lost Property",
  "Other Operational",
];

describe("FR-001 / FR-002 — TC-B01 valid submission accepted", () => {
  let token;
  let requester;

  beforeAll(async () => {
    token = await tokenFor("requester");
    requester = await getSeedUser("requester");
  });

  beforeEach(resetData);
  afterAll(closeDb);

  test.each(CATEGORIES)("category %s → 201 and stored exactly as submitted", async (category) => {
    const body = {
      title: "Broken hall light",
      description: "The light outside room 12 flickers and goes off.",
      category,
    };

    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${token}`)
      .send(body);


    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Service request submitted successfully.");
    expect(res.body.request.id).toEqual(expect.any(Number));

    const row = await getRequestRow(res.body.request.id);
    expect(row).not.toBeNull();
    expect(row.title).toBe(body.title);
    expect(row.description).toBe(body.description);
    expect(row.category).toBe(category);
    expect(row.status).toBe("Open");
    expect(row.requester_id).toBe(requester.user_id);
  });
});