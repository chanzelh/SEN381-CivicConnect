const request = require("supertest");
const app = require("../../src/app");
const { resetData, countRequests, getRequestRow, closeDb } = require("../helpers/db");
const { tokenFor } = require("../helpers/auth");

const VALID_TITLE = "Broken hall light";
const VALID_DESCRIPTION = "The light outside room 12 flickers.";
const chars = (n) => "a".repeat(n);

describe("NFR-011 — TC-B03 field boundaries", () => {
  let token;

  beforeAll(async () => {
    token = await tokenFor("requester");
  });

  beforeEach(resetData);
  afterAll(closeDb);

  function submit(fields) {
    return request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: VALID_TITLE, description: VALID_DESCRIPTION, category: "Maintenance", ...fields });
  }

  describe("invalid boundaries → 400 with message, nothing stored", () => {
    test.each([
      ["title missing (length 0)", { title: "" }, "Title, description and category are required."],
      ["title max+1 (151)", { title: chars(151) }, "Title must be 150 characters or fewer."],
      ["description missing (length 0)", { description: "" }, "Title, description and category are required."],
      ["description max+1 (5001)", { description: chars(5001) }, "Description must be 5000 characters or fewer."],
    ])("%s", async (_label, fields, message) => {
      const res = await submit(fields);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message });
      expect(await countRequests()).toBe(0);
    });
  });

  describe("valid boundaries → 201 and stored", () => {
    test.each([
      ["title min (1)", { title: chars(1) }, "title", chars(1)],
      ["title max (150)", { title: chars(150) }, "title", chars(150)],
      ["description min (1)", { description: chars(1) }, "description", chars(1)],
      ["description max (5000)", { description: chars(5000) }, "description", chars(5000)],
      ["title 150 + surrounding spaces (trimmed to 150)", { title: `  ${chars(150)}  ` }, "title", chars(150)],
    ])("%s", async (_label, fields, column, storedValue) => {
      const res = await submit(fields);

      expect(res.status).toBe(201);
      const row = await getRequestRow(res.body.request.id);
      expect(row[column]).toBe(storedValue);
    });
  });
});