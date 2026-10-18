// TC-I03 — Submitted fields round-trip, request IDs are unique and due dates retain their calendar date (DEF-005).

const request = require("supertest");
const app = require("../../src/app");
const { resetData, getRequestRow, closeDb } = require("../helpers/db");
const { tokenFor, getSeedUser } = require("../helpers/auth");

describe("NFR-007 / FR-001 — TC-I03 stored and retrievable", () => {
  let tokens;
  let requester;
  let staffId;

  beforeAll(async () => {
    tokens = {
      requester: await tokenFor("requester"),
      management: await tokenFor("management"),
    };
    requester = await getSeedUser("requester");
    staffId = (await getSeedUser("staff")).user_id;
  });

  beforeEach(resetData);
  afterAll(closeDb);

  const submission = {
    title: "Projector not turning on",
    description: "The projector in lecture hall B stays black.",
    category: "IT Support",
    deviceType: "Projector",
    location: "Lecture hall B",
    urgency: "High",
    impact: "Whole class affected",
  };

  async function submit(body = submission) {
    const res = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${tokens.requester}`)
      .send(body);
    expect(res.status).toBe(201);
    return res.body.request.id;
  }

  test("every submitted field is stored in the database", async () => {
    const id = await submit();
    const row = await getRequestRow(id);

    expect(row).toMatchObject({
      requester_id: requester.user_id,
      title: submission.title,
      description: submission.description,
      category: submission.category,
      device_type: submission.deviceType,
      location: submission.location,
      urgency: submission.urgency,
      impact: submission.impact,
      status: "Open",
      assigned_staff_id: null,
    });
    expect(row.submitted_at).toBeInstanceOf(Date);
  });

  test("the requester can retrieve it with the same values", async () => {
    const id = await submit();

    const res = await request(app)
      .get(`/api/requests/mine/${id}`)
      .set("Authorization", `Bearer ${tokens.requester}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id,
      title: submission.title,
      description: submission.description,
      category: submission.category,
      status: "Open",
    });

    const list = await request(app)
      .get("/api/requests/mine")
      .set("Authorization", `Bearer ${tokens.requester}`);
    expect(list.body.map((r) => r.id)).toContain(id);
  });

  test("two submissions receive different IDs (unique reference)", async () => {
    const first = await submit();
    const second = await submit({ ...submission, title: "Second request" });

    expect(second).not.toBe(first);
    expect((await getRequestRow(first)).title).toBe(submission.title);
    expect((await getRequestRow(second)).title).toBe("Second request");
  });

  test("DEF-005 regression: the due date is returned exactly as saved", async () => {
    const id = await submit();

    const assign = await request(app)
      .put(`/api/requests/${id}/assign`)
      .set("Authorization", `Bearer ${tokens.management}`)
      .send({ staffId, dueDate: "2026-12-31" });
    expect(assign.status).toBe(200);

    const list = await request(app)
      .get("/api/requests")
      .set("Authorization", `Bearer ${tokens.management}`);
    const item = list.body.find((r) => r.request_id === id);

    expect(item.dueDate).toBe("2026-12-31");
  });
});