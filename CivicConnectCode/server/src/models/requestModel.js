
const pool = require("../config/database");

async function getRequestsByRequester(requesterId) {
  const result = await pool.query(
    `SELECT
       request_id AS id,
       title,
       description,
       category,
       status,
       submitted_at AS submitted,
       updated_at AS updated
     FROM service_requests
     WHERE requester_id = $1
     ORDER BY submitted_at DESC`,
    [requesterId]
  );

  return result.rows;
}

async function getRequestById(requestId, requesterId) {
  const result = await pool.query(
    `SELECT
       request_id AS id,
       title,
       description,
       category,
       status,
       submitted_at AS submitted,
       updated_at AS updated
     FROM service_requests
     WHERE request_id = $1 AND requester_id = $2`,
    [requestId, requesterId]
  );

  return result.rows[0] || null;
}

async function createRequest({
  requesterId,
  title,
  description,
  category,
}) {
  const result = await pool.query(
    `INSERT INTO service_requests
       (requester_id, title, description, category)
     VALUES ($1, $2, $3, $4)
     RETURNING
       request_id AS id,
       title,
       description,
       category,
       status,
       submitted_at AS submitted,
       updated_at AS updated`,
    [requesterId, title, description, category]
  );

  return result.rows[0];
}

module.exports = {
  getRequestsByRequester,
  getRequestById,
  createRequest,
};
