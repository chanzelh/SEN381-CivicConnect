const pool = require("../config/database");

async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT user_id, full_name, email, password_hash, role
     FROM users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0] || null;
}

async function emailExists(email) {
  const result = await pool.query(
    "SELECT user_id FROM users WHERE LOWER(email) = $1",
    [email]
  );

  return result.rows.length > 0;
}

async function createRequester({ fullName, email, passwordHash }) {
  const result = await pool.query(
    `INSERT INTO users
      (full_name, email, password_hash, role, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING user_id, full_name, email, role`,
    [fullName, email, passwordHash, "requester"]
  );

  return result.rows[0];
}

module.exports = {
  findUserByEmail,
  emailExists,
  createRequester,
};