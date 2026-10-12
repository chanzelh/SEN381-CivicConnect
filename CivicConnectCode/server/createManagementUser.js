require("dotenv").config();

const bcrypt = require("bcrypt");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");
const pool = require("./src/config/database");

async function createManagementUser() {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  try {
    const fullName = (
      await rl.question("Enter manager's full name: ")
    )
      .trim()
      .replace(/\s+/g, " ");

    if (!fullName || fullName.split(" ").length < 2) {
      throw new Error("Please enter both a first name and surname.");
    }

    // Automatically generate the manager's email address.
    const emailPrefix = fullName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s.-]/g, "")
      .trim()
      .replace(/[\s.]+/g, ".");

    const email = `${emailPrefix}.manager@civicconnect.local`;

    const password = await rl.question(
      "Enter a password (minimum 12 characters): "
    );

    if (password.length < 12) {
      throw new Error("Password must be at least 12 characters.");
    }

    const existingUser = await pool.query(
      "SELECT user_id FROM users WHERE LOWER(email) = $1",
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      throw new Error(`An account with ${email} already exists.`);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(
      `INSERT INTO users
        (full_name, email, password_hash, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [fullName, email, passwordHash, "management"]
    );

    console.log("\nManagement account created successfully!");
    console.log(`Name: ${fullName}`);
    console.log(`Email: ${email}`);
    console.log("Role: management");
  } finally {
    rl.close();
    await pool.end();
  }
}

createManagementUser().catch((error) => {
  console.error("\nCould not create management account:", error.message);
  process.exitCode = 1;
});
