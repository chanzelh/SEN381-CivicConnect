import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import BrandHeader from "../components/Header";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");

    navigate("/requester");
  };

  return (
    <div className="auth-page">

      <BrandHeader title="LOGIN" />

      <main className="auth-container">

        <div className="auth-heading">
          <h3>Sign In</h3>
          <div className="heading-line"></div>
        </div>

        <form className="auth-card" onSubmit={handleLogin}>

          <div className="auth-field">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
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
            LOGIN
          </button>

          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          <Link
            to="/signup"
            className="auth-secondary-button"
          >
            SIGN UP
          </Link>

        </form>

      </main>

    </div>
  );
}

export default Login;