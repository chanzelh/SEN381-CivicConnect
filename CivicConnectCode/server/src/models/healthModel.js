const pool = require("../config/database");

// Health check (#82): confirms the database answers a trivial query.
async function pingDatabase() {
  await pool.query("SELECT 1");
  return true;
}

module.exports = { pingDatabase };
