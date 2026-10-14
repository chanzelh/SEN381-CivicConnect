const pool = require("../config/database");
const { isValidTransition, canAssign } = require("../utils/statusRules");

async function getAllRequests() {
  const result = await pool.query(`
    SELECT
      sr.request_id AS "request_id",
      sr.requester_id AS "requesterId",
      sr.assigned_staff_id AS "assignedStaffId",
      sr.title,
      sr.description,
      sr.category,
      sr.status,
      sr.submitted_at AS "submittedAt",
      sr.updated_at AS "updatedAt",
      sr.due_date AS "dueDate",

      sr.issue_type AS "issueType",
      sr.device_type AS "deviceType",
      sr.device_name AS "deviceName",
      sr.manufacturer,
      sr.model,
      sr.software_name AS "softwareName",
      sr.software_version AS "softwareVersion",
      sr.operating_system AS "operatingSystem",
      sr.error_message AS "errorMessage",
      sr.location,
      sr.date_started AS "dateStarted",
      sr.impact,
      sr.urgency,
      sr.troubleshooting,

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


// Assigns staff + due date AND writes the history row in ONE transaction.
async function assignRequestToStaff(requestId, staffId, dueDate, changedBy) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const current = await client.query(
      `SELECT status
       FROM service_requests
       WHERE request_id = $1
       FOR UPDATE`,
      [requestId],
    );

    const staff = await client.query(
      `SELECT 1 FROM users WHERE user_id = $1 AND role = 'staff'`,
      [staffId],
    );

    if (!current.rows[0] || !staff.rows[0]) {
      await client.query("ROLLBACK");
      return { error: "NOT_FOUND" };
    }

    const oldStatus = current.rows[0].status;

    if (!canAssign(oldStatus)) {
      await client.query("ROLLBACK");
      return { error: "INVALID_TRANSITION", currentStatus: oldStatus };
    }

    const updated = await client.query(
      `UPDATE service_requests
       SET assigned_staff_id = $2,
           due_date = $3,
           status = 'Assigned',
           updated_at = NOW()
       WHERE request_id = $1
       RETURNING
         request_id AS id,
         assigned_staff_id AS "assignedStaffId",
         due_date AS "dueDate",
         status`,
      [requestId, staffId, dueDate],
    );

    await client.query(
      `INSERT INTO request_status_history
         (request_id, changed_by, old_status, new_status, change_note)
       VALUES ($1, $2, $3, 'Assigned', $4)`,
      [requestId, changedBy, oldStatus, `Assigned to staff ${staffId}, due ${dueDate}`],
    );

    await client.query("COMMIT");
    return { request: updated.rows[0] };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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
    [requesterId],
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
    [requestId, requesterId],
  );

  return result.rows[0] || null;
}

async function createRequest({
  requesterId,
  title,
  description,
  category,

  // Existing IT support fields
  issueType = null,
  deviceType = null,
  deviceName = null,
  manufacturer = null,
  model = null,
  softwareName = null,
  softwareVersion = null,
  operatingSystem = null,
  errorMessage = null,

  // Common fields
  location = null,
  dateStarted = null,
  impact = null,
  urgency = null,
  troubleshooting = null,

  // Facilities / maintenance
  maintenanceType = null,
  affectedArea = null,
  additionalDetails = null,

  // Damaged equipment
  damageDetails = null,

  // Security
  incidentType = null,
  incidentDate = null,

  // Lost property
  itemDescription = null,
  lastKnownLocation = null,
  dateLost = null,

  // Other operational requests
  otherRequestType = null,
}) {
  const query = `
    INSERT INTO service_requests (
      requester_id,
      title,
      description,
      category,
      issue_type,
      device_type,
      device_name,
      manufacturer,
      model,
      software_name,
      software_version,
      operating_system,
      error_message,
      location,
      date_started,
      impact,
      urgency,
      troubleshooting,
      maintenance_type,
      affected_area,
      additional_details,
      damage_details,
      incident_type,
      incident_date,
      item_description,
      last_known_location,
      date_lost,
      other_request_type
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13, $14,
      $15, $16, $17, $18, $19, $20, $21,
      $22, $23, $24, $25, $26, $27, $28
    )
    RETURNING
      request_id AS id,
      requester_id AS "requesterId",
      title,
      description,
      category,
      issue_type AS "issueType",
      device_type AS "deviceType",
      device_name AS "deviceName",
      manufacturer,
      model,
      software_name AS "softwareName",
      software_version AS "softwareVersion",
      operating_system AS "operatingSystem",
      error_message AS "errorMessage",
      location,
      date_started AS "dateStarted",
      impact,
      urgency,
      troubleshooting,
      maintenance_type AS "maintenanceType",
      affected_area AS "affectedArea",
      additional_details AS "additionalDetails",
      damage_details AS "damageDetails",
      incident_type AS "incidentType",
      incident_date AS "incidentDate",
      item_description AS "itemDescription",
      last_known_location AS "lastKnownLocation",
      date_lost AS "dateLost",
      other_request_type AS "otherRequestType",
      status,
      submitted_at AS submitted,
      updated_at AS updated
  `;

  const values = [
    requesterId,
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
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

// Changes status AND writes the history row in ONE transaction (NFR-009, RISK-008).
// Returns { request } on success, or { error, currentStatus } when nothing was changed.
async function updateRequestStatus(requestId, status, userId, isManagement, note = null) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock the row so two people can't change it at the same time.
    const current = await client.query(
      `SELECT status, assigned_staff_id
       FROM service_requests
       WHERE request_id = $1
       FOR UPDATE`,
      [requestId],
    );

    const row = current.rows[0];

    if (!row || (!isManagement && Number(row.assigned_staff_id) !== Number(userId))) {
      await client.query("ROLLBACK");
      return { error: "NOT_FOUND" };
    }

    if (!isValidTransition(row.status, status)) {
      await client.query("ROLLBACK");
      return { error: "INVALID_TRANSITION", currentStatus: row.status };
    }

    const updated = await client.query(
      `UPDATE service_requests
       SET status = $2,
           updated_at = NOW()
       WHERE request_id = $1
       RETURNING
         request_id AS id,
         status,
         updated_at AS updated`,
      [requestId, status],
    );

    await client.query(
      `INSERT INTO request_status_history
         (request_id, changed_by, old_status, new_status, change_note)
       VALUES ($1, $2, $3, $4, $5)`,
      [requestId, userId, row.status, status, note],
    );

    await client.query("COMMIT");
    return { request: updated.rows[0] };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getAssignedRequestById(requestId, staffId) {
  const result = await pool.query(
    `SELECT
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

       sr.issue_type AS "issueType",
       sr.device_type AS "deviceType",
       sr.device_name AS "deviceName",
       sr.manufacturer,
       sr.model,
       sr.software_name AS "softwareName",
       sr.software_version AS "softwareVersion",
       sr.operating_system AS "operatingSystem",
       sr.error_message AS "errorMessage",
       sr.location,
       sr.date_started AS "dateStarted",
       sr.impact,
       sr.urgency,
       sr.troubleshooting

     FROM service_requests sr

     LEFT JOIN users requester
       ON sr.requester_id = requester.user_id

     WHERE sr.request_id = $1
       AND sr.assigned_staff_id = $2`,
    [requestId, staffId]
  );

  return result.rows[0] || null;
}


async function listRequestComments(requestId) {
  const result = await pool.query(
    `SELECT
       rc.comment_id AS id,
       rc.request_id AS "requestId",
       rc.user_id AS "userId",
       u.full_name AS "fullName",
       rc.comment_text AS "commentText",
       rc.created_at AS "createdAt"
     FROM request_comments rc
     JOIN users u ON rc.user_id = u.user_id
     WHERE rc.request_id = $1
     ORDER BY rc.created_at ASC, rc.comment_id ASC`,
    [requestId],
  );

  return result.rows;
}

async function createRequestComment({ requestId, staffId, commentText }) {
  const result = await pool.query(
    `WITH inserted AS (
       INSERT INTO request_comments (
         request_id,
         user_id,
         comment_text
       )
       SELECT sr.request_id, $2, $3
       FROM service_requests sr
       WHERE sr.request_id = $1
         AND sr.assigned_staff_id = $2
       RETURNING
         comment_id,
         request_id,
         user_id,
         comment_text,
         created_at
     )
     SELECT
       i.comment_id AS id,
       i.request_id AS "requestId",
       i.user_id AS "userId",
       u.full_name AS "staffName",
       i.comment_text AS "commentText",
       i.created_at AS "createdAt"
     FROM inserted i
     JOIN users u ON i.user_id = u.user_id`,
    [requestId, staffId, commentText],
  );

  return result.rows[0] || null;
}

async function createRequesterRequestComment({
  requestId,
  requesterId,
  commentText,
}) {
  const result = await pool.query(
    `INSERT INTO request_comments (
       request_id,
       user_id,
       comment_text
     )
     SELECT
       sr.request_id,
       sr.requester_id,
       $3
     FROM service_requests sr
     WHERE sr.request_id = $1
       AND sr.requester_id = $2
     RETURNING
       comment_id AS id,
       request_id AS "requestId",
       user_id AS "userId",
       comment_text AS "commentText",
       created_at AS "createdAt"`,
    [requestId, requesterId, commentText],
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
  getAssignedRequestById,
  listRequestComments,
  createRequestComment,
  createRequesterRequestComment,
};
