
const pool = require("../config/database");

async function getAllRequests() {
  const result = await pool.query(`
    SELECT
      sr.request_id AS id,
      sr.requester_id AS "requesterId",
      sr.assigned_staff_id AS "assignedStaffId",
      sr.title,
      sr.description,
      sr.category,
      sr.status,
      sr.submitted_at AS submitted,
      sr.updated_at AS updated,
      sr.due_date AS "dueDate",
      requester.full_name AS "requesterName",
      requester.email AS "requesterEmail",
      staff.full_name AS "staffName"
    FROM service_requests sr
    LEFT JOIN users requester
      ON sr.requester_id = requester.user_id
    LEFT JOIN users staff
      ON sr.assigned_staff_id = staff.user_id
    ORDER BY sr.submitted_at DESC
  `);

  return result.rows;
}

async function assignRequestToStaff(requestId, staffId, dueDate) {
  const result = await pool.query(
    `UPDATE service_requests AS sr
     SET assigned_staff_id = $2,
         due_date = $3,
         status = 'Assigned',
         updated_at = NOW()
     WHERE sr.request_id = $1
       AND EXISTS (
         SELECT 1
         FROM users
         WHERE user_id = $2
           AND role = 'staff'
       )
     RETURNING
       sr.request_id AS id,
       sr.assigned_staff_id AS "assignedStaffId",
       sr.due_date AS "dueDate",
       sr.status`,
    [requestId, staffId, dueDate]
  );

  return result.rows[0] || null;
}

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
     WHERE request_id = $1
       AND requester_id = $2`,
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

async function getRequestsByStaff(staffId) {
  const result = await pool.query(
    `SELECT
       request_id AS id,
       requester_id AS "requesterId",
       assigned_staff_id AS "assignedStaffId",
       title,
       description,
       category,
       status,
       submitted_at AS submitted,
       updated_at AS updated
     FROM service_requests
     WHERE assigned_staff_id = $1
     ORDER BY submitted_at DESC`,
    [staffId]
  );

  return result.rows;
}

async function getStaffMembers() {
  const result = await pool.query(`
    SELECT
      user_id AS id,
      full_name AS "fullName",
      email
    FROM users
    WHERE role = 'staff'
    ORDER BY full_name ASC
  `);

  return result.rows;
}

async function updateRequestStatus(
  requestId,
  status,
  staffId,
  isManagement
) {
  const result = await pool.query(
    `UPDATE service_requests
     SET status = $2,
         updated_at = NOW()
     WHERE request_id = $1
       AND ($4::boolean = TRUE OR assigned_staff_id = $3)
     RETURNING
       request_id AS id,
       status,
       updated_at AS updated`,
    [requestId, status, staffId, isManagement]
  );

  return result.rows[0] || null;
}

module.exports = {
  getAllRequests,
  getRequestsByRequester,
  getRequestById,
  createRequest,
  getRequestsByStaff,
  assignRequestToStaff,
  getStaffMembers,
  updateRequestStatus,
};
