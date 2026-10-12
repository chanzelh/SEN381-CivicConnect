const express = require("express");
const router = express.Router();

const {
  getMyRequests,
  getMyRequestById,
  createMyRequest,
  getAssignedRequests,
  getAllRequestsForManager,
  assignRequest,
  getStaffMembers,
} = require("../controllers/requestController");

const {
  authenticateToken,
  requireRole,
} = require("../middleware/authMiddleware");

const {
  updateRequestStatus,
} = require("../controllers/requestController");

// Manager: view all service requests
router.get(
  "/",
  authenticateToken,
  requireRole("management"),
  getAllRequestsForManager
);

// Manager: assign a request to a staff member
router.put(
  "/:id/assign",
  authenticateToken,
  requireRole("management"),
  assignRequest
);

router.patch(
  "/:id/status",
  authenticateToken,
  requireRole("staff", "management"),
  updateRequestStatus
);

router.get(
  "/staff",
  authenticateToken,
  requireRole("management"),
  getStaffMembers
);

// Staff: view requests assigned to them
router.get(
  "/assigned",
  authenticateToken,
  requireRole("staff"),
  getAssignedRequests
);

// Requester routes
router.get(
  "/mine",
  authenticateToken,
  requireRole("requester"),
  getMyRequests
);

router.get(
  "/mine/:id",
  authenticateToken,
  requireRole("requester"),
  getMyRequestById
);

router.post(
  "/",
  authenticateToken,
  requireRole("requester"),
  createMyRequest
);


module.exports = router;