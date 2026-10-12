
const requestModel = require("../models/requestModel");
const notificationModel = require("../models/notificationModel");

// Create a notification without interrupting the main request operation
// if notification creation fails.
async function sendNotificationSafely(notification) {
  try {
    await notificationModel.createNotification(notification);
  } catch (error) {
    console.error("Could not create notification:", error.message);
  }
}

// Notify all management users.
async function notifyManagementUsers({
  requestId,
  title,
  message,
  notificationType,
}) {
  try {
    const managers = await notificationModel.getManagementUserIds();

    await Promise.all(
      managers.map((manager) =>
        sendNotificationSafely({
          userId: manager.id,
          requestId,
          title,
          message,
          notificationType,
        })
      )
    );
  } catch (error) {
    console.error("Could not notify management:", error.message);
  }
}

// Get request information needed for notifications.
async function getRequestNotificationInfo(requestId) {
  try {
    return await notificationModel.getRequestNotificationInfo(requestId);
  } catch (error) {
    console.error(
      "Could not retrieve request notification information:",
      error.message
    );
    return null;
  }
}

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

    // Notify the assigned staff member and the requester.
    const requestInfo =
      await getRequestNotificationInfo(requestId);

    if (requestInfo) {
      await Promise.all([
        sendNotificationSafely({
          userId: staffId,
          requestId,
          title: "Request assigned to you",
          message: `The request "${requestInfo.title}" has been assigned to you.`,
          notificationType: "request_assigned",
        }),

        sendNotificationSafely({
          userId: Number(requestInfo.requesterId),
          requestId,
          title: "Your request has been assigned",
          message: `Your request "${requestInfo.title}" has been assigned to a staff member.`,
          notificationType: "request_assigned",
        }),
      ]);
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
    const {
      title,
      description,
      category,
      issueType,
      deviceType,
      deviceName,
      manufacturer,
      model,
      softwareName,
      softwareVersion,
      operatingSystem,
      errorMessage,
      location,
      dateStarted,
      impact,
      urgency,
      troubleshooting,
      maintenanceType,
      affectedArea,
      additionalDetails,
      damageDetails,
      incidentType,
      incidentDate,
      itemDescription,
      lastKnownLocation,
      dateLost,
      otherRequestType,
    } = req.body;

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
      "Lost Property",
      "Other Operational",
    ];

    const cleanCategory = category.trim();

    if (!allowedCategories.includes(cleanCategory)) {
      return res.status(400).json({
        message: "Please select a valid category.",
      });
    }

    const optionalText = (value) =>
      typeof value === "string" && value.trim()
        ? value.trim()
        : null;

    let cleanDateStarted = null;

    if (dateStarted) {
      if (
        typeof dateStarted !== "string" ||
        Number.isNaN(Date.parse(dateStarted))
      ) {
        return res.status(400).json({
          message: "Please enter a valid date and time.",
        });
      }

      cleanDateStarted = new Date(dateStarted);

      if (Number.isNaN(cleanDateStarted.getTime())) {
        return res.status(400).json({
          message: "Please enter a valid date and time.",
        });
      }
    }

    
const isValidDateOnly = (value) => {
  // Date is optional.
  if (value == null || value === "") {
    return true;
  }

  // Accept a date string such as 2026-10-12,
  // including a date-time string starting with that date.
  if (typeof value !== "string") {
    return false;
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

    const request = await requestModel.createRequest({
      requesterId,
      title: title.trim(),
      description: description.trim(),
      category: cleanCategory,

      issueType: optionalText(issueType),
      deviceType: optionalText(deviceType),
      deviceName: optionalText(deviceName),
      manufacturer: optionalText(manufacturer),
      model: optionalText(model),
      softwareName: optionalText(softwareName),
      softwareVersion: optionalText(softwareVersion),
      operatingSystem: optionalText(operatingSystem),
      errorMessage: optionalText(errorMessage),

      location: optionalText(location),
      dateStarted: cleanDateStarted,
      impact: optionalText(impact),
      urgency: optionalText(urgency),
      troubleshooting: optionalText(troubleshooting),

      maintenanceType: optionalText(maintenanceType),
      affectedArea: optionalText(affectedArea),
      additionalDetails: optionalText(additionalDetails),

      damageDetails: optionalText(damageDetails),

      incidentType: optionalText(incidentType),
      incidentDate: optionalText(incidentDate),

      itemDescription: optionalText(itemDescription),
      lastKnownLocation: optionalText(lastKnownLocation),
      dateLost: optionalText(dateLost),

      otherRequestType: optionalText(otherRequestType),
    });

    // Notify management after the request is saved.
    if (request) {
      await notifyManagementUsers({
        requestId: request.id,
        title: "New service request",
        message: `A new request "${request.title}" has been submitted.`,
        notificationType: "request_created",
      });
    }

    return res.status(201).json({
      message: "Service request submitted successfully.",
      request,
    });
  } catch (error) {
    console.error("Could not create request:", error);

    return res.status(500).json({
      message: "Could not submit your request.",
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
        : ["In Progress", "On Hold", "Resolved"];

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

    // Notify the requester about the status change.
    const requestInfo =
      await getRequestNotificationInfo(requestId);

    if (requestInfo) {
      await sendNotificationSafely({
        userId: Number(requestInfo.requesterId),
        requestId,
        title: "Request status updated",
        message: `Your request "${requestInfo.title}" now has the status "${status}".`,
        notificationType: "status_updated",
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

async function getAssignedRequestDetails(req, res) {
  try {
    const requestId = Number(req.params.id);
    const staffId = Number(req.user?.user_id);

    if (!Number.isInteger(requestId) || requestId < 1) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    if (!Number.isInteger(staffId) || staffId < 1) {
      return res.status(401).json({
        message: "Please log in again.",
      });
    }

    const request = await requestModel.getAssignedRequestById(
      requestId,
      staffId
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found or not assigned to you.",
      });
    }

    return res.json({ request });
  } catch (error) {
    console.error("Could not load request details:", error.message);

    return res.status(500).json({
      message: "Could not load request details.",
    });
  }
}

async function getRequestComments(req, res) {
  try {
    const requestId = Number(req.params.id);
    const staffId = Number(req.user?.user_id);

    if (!Number.isInteger(requestId) || requestId < 1) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    if (!Number.isInteger(staffId) || staffId < 1) {
      return res.status(401).json({
        message: "Please log in again.",
      });
    }

    const request = await requestModel.getAssignedRequestById(
      requestId,
      staffId
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found or not assigned to you.",
      });
    }

    const comments = await requestModel.listRequestComments(requestId);

    return res.json({ comments });
  } catch (error) {
    console.error("Could not load comments:", error.message);

    return res.status(500).json({
      message: "Could not load comments.",
    });
  }
}

async function createRequestComment(req, res) {
  try {
    const requestId = Number(req.params.id);
    const staffId = Number(req.user?.user_id);
    const { commentText } = req.body;

    if (!Number.isInteger(requestId) || requestId < 1) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    if (!Number.isInteger(staffId) || staffId < 1) {
      return res.status(401).json({
        message: "Please log in again.",
      });
    }

    if (
      typeof commentText !== "string" ||
      !commentText.trim()
    ) {
      return res.status(400).json({
        message: "Please enter a comment.",
      });
    }

    if (commentText.trim().length > 2000) {
      return res.status(400).json({
        message: "Comments must be 2000 characters or fewer.",
      });
    }

    const comment = await requestModel.createRequestComment({
      requestId,
      staffId,
      commentText: commentText.trim(),
    });

    if (!comment) {
      return res.status(404).json({
        message: "Request not found or not assigned to you.",
      });
    }

    // Notify the requester about the staff comment.
    const requestInfo =
      await getRequestNotificationInfo(requestId);

    if (requestInfo) {
      await sendNotificationSafely({
        userId: Number(requestInfo.requesterId),
        requestId,
        title: "New comment on your request",
        message: `A staff member commented on "${requestInfo.title}".`,
        notificationType: "new_comment",
      });
    }

    return res.status(201).json({
      message: "Comment added successfully.",
      comment,
    });
  } catch (error) {
    console.error("Could not create comment:", error.message);

    return res.status(500).json({
      message: "Could not add the comment.",
    });
  }
}

async function getRequesterRequestComments(req, res) {
  try {
    const requestId = Number(req.params.id);
    const requesterId = Number(req.user?.user_id);

    if (!Number.isInteger(requestId) || requestId < 1) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    if (!Number.isInteger(requesterId) || requesterId < 1) {
      return res.status(401).json({
        message: "Please log in again.",
      });
    }

    const request = await requestModel.getRequestById(
      requestId,
      requesterId
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    const comments = await requestModel.listRequestComments(requestId);

    return res.json({ comments });
  } catch (error) {
    console.error("Error fetching requester comments:", error.message);

    return res.status(500).json({
      message: "Failed to load comments.",
    });
  }
}

async function createRequesterRequestComment(req, res) {
  try {
    const requestId = Number(req.params.id);
    const requesterId = Number(req.user?.user_id);
    const { commentText } = req.body;

    if (!Number.isInteger(requestId) || requestId < 1) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    if (!Number.isInteger(requesterId) || requesterId < 1) {
      return res.status(401).json({
        message: "Please log in again.",
      });
    }

    if (
      typeof commentText !== "string" ||
      !commentText.trim()
    ) {
      return res.status(400).json({
        message: "Please enter a reply.",
      });
    }

    if (commentText.trim().length > 2000) {
      return res.status(400).json({
        message: "Replies must be 2000 characters or fewer.",
      });
    }

    const request = await requestModel.getRequestById(
      requestId,
      requesterId
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    const comment =
      await requestModel.createRequesterRequestComment({
        requestId,
        requesterId,
        commentText: commentText.trim(),
      });

    if (!comment) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    // Notify the assigned staff member about the requester reply.
    const requestInfo =
      await getRequestNotificationInfo(requestId);

    if (requestInfo?.assignedStaffId) {
      await sendNotificationSafely({
        userId: Number(requestInfo.assignedStaffId),
        requestId,
        title: "New comment on an assigned request",
        message: `The requester commented on "${requestInfo.title}".`,
        notificationType: "new_comment",
      });
    }

    return res.status(201).json({
      message: "Reply added successfully.",
      comment,
    });
  } catch (error) {
    console.error("Error creating requester reply:", error.message);

    return res.status(500).json({
      message: "Failed to add reply.",
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
  getAssignedRequestDetails,
  getRequestComments,
  createRequestComment,
  getRequesterRequestComments,
  createRequesterRequestComment,
};
