// TC-U03 — Permission check returns the correct result per role (NFR-002, RISK-002)

jest.mock("../../src/models/requestModel", () => ({
  updateRequestStatus: jest.fn(),
}));

jest.mock("../../src/models/notificationModel", () => ({
  createNotification: jest.fn(),
  getRequestNotificationInfo: jest.fn(),
}));

const requestModel = require("../../src/models/requestModel");
const notificationModel = require("../../src/models/notificationModel");
const { updateRequestStatus } = require("../../src/controllers/requestController");

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

async function callUpdate(role, status) {
  const req = {
    params: { id: "1" },
    body: { status },
    user: { user_id: 7, role },
  };
  const res = mockRes();
  await updateRequestStatus(req, res);
  return res;
}

describe("NFR-002 — TC-U03 status permission per role", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    requestModel.updateRequestStatus.mockResolvedValue({
      request: { id: 1, status: "changed" },
    });
    notificationModel.getRequestNotificationInfo.mockResolvedValue(null);
  });

  describe("staff are blocked from management-only statuses", () => {
    test.each(["Closed", "Pending", "Assigned"])(
      "staff → %s returns 403 and nothing is saved",
      async (status) => {
        const res = await callUpdate("staff", status);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
          message: "You are not permitted to select this status.",
        });
        expect(requestModel.updateRequestStatus).not.toHaveBeenCalled();
      }
    );
  });

  describe("allowed role/status combinations reach the save step", () => {
    test.each([
      ["staff", "In Progress", false],
      ["staff", "On Hold", false],
      ["staff", "Resolved", false],
      ["management", "Pending", true],
      ["management", "Closed", true],
    ])("%s → %s passes the role check", async (role, status, isManagement) => {
      const res = await callUpdate(role, status);

      expect(res.status).not.toHaveBeenCalledWith(403);
      expect(requestModel.updateRequestStatus).toHaveBeenCalledWith(
        1,
        status,
        7,
        isManagement
      );
    });
  });

  test("an unknown status is rejected for management too", async () => {
    const res = await callUpdate("management", "Done");

    expect(res.status).toHaveBeenCalledWith(403);
    expect(requestModel.updateRequestStatus).not.toHaveBeenCalled();
  });
});