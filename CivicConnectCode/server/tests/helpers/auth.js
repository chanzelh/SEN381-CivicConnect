const jwt = require("jsonwebtoken");
const { pool } = require("./db");

const SEED_EMAILS = {
  requester: "requester@test.civicconnect.local",
  staff: "staff@test.civicconnect.local",
  management: "management@test.civicconnect.local",
};

async function getSeedUser(role) {
  const { rows } = await pool.query(
    "SELECT user_id, role FROM users WHERE email = $1",
    [SEED_EMAILS[role]]
  );
  if (!rows[0]) throw new Error(`Seed user for role "${role}" not found. Was seed.sql applied?`);
  return rows[0];
}

async function tokenFor(role) {
  const user = await getSeedUser(role);
  return jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
}

module.exports = { tokenFor, getSeedUser };