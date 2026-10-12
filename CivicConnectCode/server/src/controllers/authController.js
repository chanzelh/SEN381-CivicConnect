
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const result = await pool.query(
      `SELECT user_id, full_name, email, password_hash, role
       FROM users
       WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      message: "Login successful.",
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Unable to log in.",
    });
  }
};

const signup = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Please complete all required fields.",
      });
    }

    if (password.length < 12) {
      return res.status(400).json({
        message: "Password must be at least 12 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
      "SELECT user_id FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users
        (full_name, email, password_hash, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING user_id, full_name, email, role`,
      [
        full_name.trim(),
        normalizedEmail,
        passwordHash,
        "requester",
      ]
    );

    return res.status(201).json({
      message: "Account created successfully. You can now log in.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      message: "Unable to create your account. Please try again.",
    });
  }
};

module.exports = { login, signup };
