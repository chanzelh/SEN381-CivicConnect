
const requestModel = require("../models/requestModel");

// Temporary requester ID for local testing.
// Replace with the authenticated user's ID when login is implemented.
const TEST_REQUESTER_ID = Number(
  process.env.TEST_REQUESTER_ID || 1
);

async function getMyRequests(req, res) {
  try {
    const requests = await requestModel.getRequestsByRequester(
      TEST_REQUESTER_ID
    );

    res.json(requests);
  } catch (error) {
    console.error("Could not load requests:", error.message);
    res.status(500).json({
      message: "Could not load service requests.",
    });
  }
}

async function getMyRequestById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    const request = await requestModel.getRequestById(
      id,
      TEST_REQUESTER_ID
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    res.json(request);
  } catch (error) {
    console.error("Could not load request:", error.message);
    res.status(500).json({
      message: "Could not load the request.",
    });
  }
}

async function createMyRequest(req, res) {
  try {
    const { title, description, category } = req.body;

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
      requesterId: TEST_REQUESTER_ID,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
    });

    res.status(201).json({
      message: "Service request submitted successfully.",
      request,
    });
  } catch (error) {
    console.error("Could not create request:", error.message);
    res.status(500).json({
      message: "Could not submit your request.",
    });
  }
}

module.exports = {
  getMyRequests,
  getMyRequestById,
  createMyRequest,
};
