const healthModel = require("../models/healthModel");

// GET /health (#82). Public, no login: used by monitoring (NFR-008) and
// staging verification. Reveals no internal details (NFR-003).
async function getHealth(req, res) {
  const checkedAt = new Date().toISOString();

  try {
    await healthModel.pingDatabase();
    return res.json({ status: "ok", database: "ok", checkedAt });
  } catch (error) {
    console.error("Health check failed:", error.message);
    return res.status(503).json({ status: "degraded", database: "unavailable", checkedAt });
  }
}

module.exports = { getHealth };
