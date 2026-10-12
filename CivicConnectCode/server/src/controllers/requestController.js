const requestModel = require("../models/requestModel");

async function getMyRequests(req, res) {
  try {
    const requesterId = Number(req.user?.user_id);

    if (!Number.isInteger(requesterId) || requesterId < 1) {
      return res.status(401).json({
        message: "Please log in to view your requests.",
      });
    }

    const requests =
      await requestModel.getRequestsByRequester(requesterId);

    return res.json(requests);
  } catch (error) {
    console.error("Could not load requests:", error.message);

    return res.status(500).json({
      message: "Could not load service requests.",
    });
  }
}

async function getAllRequestsForManager(req, res) {
  try {
    const requests = await requestModel.getAllRequests();
    return res.json(requests);
  } catch (error) {
    console.error("Could not load all requests:", error.message);

    return res.status(500).json({
      message: "Could not load service requests.",
    });
  }
}

async function assignRequest(req, res) {
  try {
    const requestId = Number(req.params.id);
    const staffId = Number(req.body.staffId);
    const dueDate = req.body.dueDate;

    if (
      !Number.isInteger(requestId) ||
      requestId < 1 ||
      !Number.isInteger(staffId) ||
      staffId < 1
    ) {
      return res.status(400).json({
        message: "A valid request ID and staff ID are required.",
      });
    }

    if (
      typeof dueDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)
    ) {
      return res.status(400).json({
        message: "Please select a valid due date.",
      });
    }

    const parsedDate = new Date(`${dueDate}T00:00:00.000Z`);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== dueDate
    ) {
      return res.status(400).json({
        message: "The selected due date is invalid.",
      });
    }

    const request = await requestModel.assignRequestToStaff(
      requestId,
      staffId,
      dueDate
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found or staff account is invalid.",
      });
    }

    return res.json({
      message: "Staff member and due date saved successfully.",
      request,
    });
  } catch (error) {
    console.error("Could not assign request:", error.message);

    return res.status(500).json({
      message: "Could not assign the request.",
    });
  }
}

async function getMyRequestById(req, res) {
  try {
    const id = Number(req.params.id);
    const requesterId = Number(req.user?.user_id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    if (!Number.isInteger(requesterId) || requesterId < 1) {
      return res.status(401).json({
        message: "Please log in to view this request.",
      });
    }

    const request = await requestModel.getRequestById(
      id,
      requesterId
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    return res.json(request);
  } catch (error) {
    console.error("Could not load request:", error.message);

    return res.status(500).json({
      message: "Could not load the request.",
    });
  }
}

async function createMyRequest(req, res) {
  try {
    const { title, description, category } = req.body;
    const requesterId = Number(req.user?.user_id);

    if (!Number.isInteger(requesterId) || requesterId < 1) {
      return res.status(401).json({
        message: "Please log in before submitting a request.",
      });
    }

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof category !== "string" ||
      !title.trim() ||
      !description.trim() ||
      !category.trim()
    ) {
      return res.status(400).json({
        message: "Title, description and category are required.",
      });
    }

    if (title.trim().length > 150) {
      return res.status(400).json({
        message: "Title must be 150 characters or fewer.",
      });
    }

    if (description.trim().length > 5000) {
      return res.status(400).json({
        message: "Description must be 5000 characters or fewer.",
      });
    }

    const allowedCategories = [
      "Maintenance",
      "IT Support",
      "Security",
      "Equipment",
    ];

    if (!allowedCategories.includes(category.trim())) {
      return res.status(400).json({
        message: "Please select a valid category.",
      });
    }

    const request = await requestModel.createRequest({
      requesterId,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
    });

    return res.status(201).json({
      message: "Service request submitted successfully.",
      request,
    });
  } catch (error) {
    console.error("Could not create request:", error.message);

    return res.status(500).json({
      message: "Could not submit your request.",
    });
  }
}

async function getAllRequests(req, res) {
  try {
    const requests = await requestModel.getAllRequests();
    return res.json(requests);
  } catch (error) {
    console.error("Could not load all requests:", error.message);

    return res.status(500).json({
      message: "Could not load service requests.",
    });
  }
}

async function getAssignedRequests(req, res) {
  try {
    const staffId = Number(req.user?.user_id);

    if (!Number.isInteger(staffId) || staffId < 1) {
      return res.status(401).json({
        message: "Invalid staff account.",
      });
    }

    const requests = await requestModel.getRequestsByStaff(staffId);

    return res.json(requests);
  } catch (error) {
    console.error("Could not load assigned requests:", error.message);

    return res.status(500).json({
      message: "Could not load assigned requests.",
    });
  }
}

async function getStaffMembers(req, res) {
  try {
    const staff = await requestModel.getStaffMembers();
    return res.json(staff);
  } catch (error) {
    console.error("Could not load staff members:", error.message);

    return res.status(500).json({
      message: "Could not load staff members.",
    });
  }
}

async function updateRequestStatus(req, res) {
  try {
    const requestId = Number(req.params.id);
    const { status } = req.body;
    const userRole = req.user?.role;

    if (!Number.isInteger(requestId) || requestId < 1) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    const allowedStatuses =
      userRole === "management"
        ? [
            "Pending",
            "Assigned",
            "In Progress",
            "On Hold",
            "Resolved",
            "Closed",
          ]
        : [
            "In Progress",
            "On Hold",
            "Resolved",
          ];

    if (!allowedStatuses.includes(status)) {
      return res.status(403).json({
        message: "You are not permitted to select this status.",
      });
    }

    const isManagement = userRole === "management";

    const request = await requestModel.updateRequestStatus(
      requestId,
      status,
      req.user.user_id,
      isManagement
    );

    if (!request) {
      return res.status(404).json({
        message: isManagement
          ? "Request not found."
          : "Request not found or not assigned to you.",
      });
    }

    return res.json({
      message: "Request status updated successfully.",
      request,
    });
  } catch (error) {
    console.error("Could not update request status:", error.message);

    return res.status(500).json({
      message: "Could not update request status.",
    });
  }
}

module.exports = {
  getMyRequests,
  getMyRequestById,
  createMyRequest,
  getAllRequests,
  getAssignedRequests,
  assignRequest,
  getAllRequestsForManager,
  getStaffMembers,
  updateRequestStatus,
};
