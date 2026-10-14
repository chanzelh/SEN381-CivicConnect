// TC-U05 — Notification failure does not undo the status update (FR-005, RISK-010)

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

describe("FR-005 — TC-U05 notification failure does not undo the status update", () => {
  let consoleError;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    requestModel.updateRequestStatus.mockResolvedValue({
      request: { id: 1, status: "Resolved", updated: "2026-10-13T10:00:00.000Z" },
    });
    notificationModel.getRequestNotificationInfo.mockResolvedValue({
      requesterId: 5,
      title: "Broken hall light",
    });
    notificationModel.createNotification.mockRejectedValue(
      new Error("notification store unavailable")
    );
  });

  afterEach(() => consoleError.mockRestore());

  test("the update still returns success with the saved request", async () => {
    const req = {
      params: { id: "1" },
      body: { status: "Resolved" },
      user: { user_id: 2, role: "staff" },
    };
    const res = mockRes();

    await updateRequestStatus(req, res);

    expect(notificationModel.createNotification).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Request status updated successfully.",
      request: { id: 1, status: "Resolved", updated: "2026-10-13T10:00:00.000Z" },
    });
    expect(requestModel.updateRequestStatus).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(
      "Could not create notification:",
      "notification store unavailable"
    );
  });
});