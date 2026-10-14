const request = require("supertest");
const app = require("../../src/app");
const { resetData, countRequests, closeDb } = require("../helpers/db");
const { tokenFor } = require("../helpers/auth");

const REQUIRED = "Title, description and category are required.";
const INVALID = "Please select a valid category.";

describe("FR-002 / NFR-011 — TC-B02 invalid category rejected", () => {
  let token;

  beforeAll(async () => {
    token = await tokenFor("requester");
  });

  beforeEach(resetData);
  afterAll(closeDb);

  test.each([
    ["missing (field absent)", undefined, REQUIRED],
    ["empty string", "", REQUIRED],
    ["only spaces", "   ", REQUIRED],
    ["wrong type (number)", 5, REQUIRED],
    ["unknown category", "Plumbing", INVALID],
    ["wrong letter case", "maintenance", INVALID],
    ["near-miss spelling", "IT-Support", INVALID],
  ])("%s (%p) → 400 with message, nothing stored", async (_label, category, message) => {
    const body = {
      title: "Broken hall light",
      description: "The light outside room 12 flickers.",
    };
    if (category !== undefined) body.category = category;

    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${token}`)
      .send(body);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message });
    expect(await countRequests()).toBe(0);
  });
});