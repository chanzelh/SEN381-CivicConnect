import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import BrandHeader from "../components/Header";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setError("");
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    // Temporary frontend-only signup
    alert("Account created successfully!");

    navigate("/login");
  };

  return (
    <div className="auth-page">

      <BrandHeader title="SIGN UP" />

      <main className="auth-container signup-container">

        <div className="auth-heading">
          <h3>Create Account</h3>
          <div className="heading-line"></div>
        </div>

        <form
          className="auth-card signup-card"
          onSubmit={handleSignup}
        >

          <div className="auth-two-column">

            <div className="auth-field">
              <label htmlFor="firstName">
                First Name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="auth-field">
            <label htmlFor="signupEmail">
              Email
            </label>

            <input
              id="signupEmail"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signupPassword">
              Password
            </label>

            <input
              id="signupPassword"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-button auth-submit"
          >
            CREATE ACCOUNT
          </button>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link
            to="/login"
            className="auth-secondary-button"
          >
            LOGIN
          </Link>

        </form>

      </main>

    </div>
  );
}

export default Signup;