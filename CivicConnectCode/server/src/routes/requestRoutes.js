const express = require("express");
const router = express.Router();

const {
  getMyRequests,
  getMyRequestById,
  createMyRequest,
} = require("../controllers/requestController");

router.get("/mine", getMyRequests);
router.get("/mine/:id", getMyRequestById);
router.post("/", createMyRequest);

module.exports = router;
