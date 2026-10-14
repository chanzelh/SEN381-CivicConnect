const pool = require("../../src/config/database");


async function resetData() {
  await pool.query(
    "TRUNCATE service_requests, request_status_history, request_comments, notifications RESTART IDENTITY CASCADE"
  );
}

async function countRequests() {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM service_requests");
  return rows[0].n;
}

async function getRequestRow(id) {
  const { rows } = await pool.query(
    "SELECT * FROM service_requests WHERE request_id = $1",
    [id]
  );
  return rows[0] || null;
}

async function closeDb() {
  await pool.end();
}

module.exports = { pool, resetData, countRequests, getRequestRow, closeDb };