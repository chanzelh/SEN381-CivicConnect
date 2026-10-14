const { pool } = require("./db");
const { getSeedUser } = require("./auth");

async function createRequestInState(status, { assigned = false, dueDate = null } = {}) {
  const requester = await getSeedUser("requester");
  const staff = await getSeedUser("staff");

  const { rows } = await pool.query(
    `INSERT INTO service_requests
       (requester_id, assigned_staff_id, title, description, category, status, due_date)
     VALUES ($1, $2, 'Broken hall light', 'The light outside room 12 flickers.', 'Maintenance', $3, $4)
     RETURNING request_id`,
    [requester.user_id, assigned ? staff.user_id : null, status, dueDate]
  );
  return rows[0].request_id;
}

async function getStatus(id) {
  const { rows } = await pool.query(
    "SELECT status FROM service_requests WHERE request_id = $1",
    [id]
  );
  return rows[0].status;
}

async function getHistory(id) {
  const { rows } = await pool.query(
    `SELECT old_status, new_status, changed_by
     FROM request_status_history
     WHERE request_id = $1
     ORDER BY history_id`,
    [id]
  );
  return rows;
}

module.exports = { createRequestInState, getStatus, getHistory };