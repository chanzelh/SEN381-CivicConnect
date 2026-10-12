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
  getAssignedRequestDetails,
  getRequestComments,
  createRequestComment,
  getRequesterRequestComments,
  createRequesterRequestComment
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

router.get(
  "/assigned/:id",
  authenticateToken,
  requireRole("staff"),
  getAssignedRequestDetails
);

// Staff: view comments
router.get(
  "/:id/comments",
  authenticateToken,
  requireRole("staff"),
  getRequestComments
);

// Staff: add a comment
router.post(
  "/:id/comments",
  authenticateToken,
  requireRole("staff"),
  createRequestComment
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

router.get(
  "/mine/:id/comments",
  authenticateToken,
  requireRole("requester"),
  getRequesterRequestComments
);

router.post(
  "/mine/:id/comments",
  authenticateToken,
  requireRole("requester"),
  createRequesterRequestComment
);


module.exports = router;