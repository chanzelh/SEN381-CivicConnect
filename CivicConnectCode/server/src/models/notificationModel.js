
const pool = require("../config/database");

async function createNotification({
  userId,
  requestId = null,
  title,
  message,
  notificationType,
}) {
  const result = await pool.query(
    `INSERT INTO notifications (
       user_id,
       request_id,
       title,
       message,
       notification_type
     )
     VALUES ($1, $2, $3, $4, $5)
     RETURNING
       notification_id AS id,
       user_id AS "userId",
       request_id AS "requestId",
       title,
       message,
       notification_type AS "notificationType",
       is_read AS "isRead",
       created_at AS "createdAt"`,
    [userId, requestId, title, message, notificationType]
  );

  return result.rows[0];
}

async function getNotifications(userId) {
  const result = await pool.query(
    `SELECT
       notification_id AS id,
       request_id AS "requestId",
       title,
       message,
       notification_type AS "notificationType",
       is_read AS "isRead",
       created_at AS "createdAt"
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId]
  );

  return result.rows;
}

async function getUnreadCount(userId) {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM notifications
     WHERE user_id = $1
       AND is_read = FALSE`,
    [userId]
  );

  return result.rows[0].count;
}

async function markAsRead(notificationId, userId) {
  const result = await pool.query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE notification_id = $1
       AND user_id = $2
     RETURNING notification_id AS id`,
    [notificationId, userId]
  );

  return result.rows[0] || null;
}

async function markAllAsRead(userId) {
  const result = await pool.query(
    `UPDATE notifications
     SET is_read = TRUE
     WHERE user_id = $1
       AND is_read = FALSE`,
    [userId]
  );

  return result.rowCount;
}

async function getRequestNotificationInfo(requestId) {
  const result = await pool.query(
    `SELECT
       request_id AS id,
       requester_id AS "requesterId",
       assigned_staff_id AS "assignedStaffId",
       title
     FROM service_requests
     WHERE request_id = $1`,
    [requestId]
  );

  return result.rows[0] || null;
}

async function getManagementUserIds() {
  const result = await pool.query(
    `SELECT user_id AS id
     FROM users
     WHERE role = 'management'`
  );

  return result.rows;
}

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getRequestNotificationInfo,
  getManagementUserIds
};
