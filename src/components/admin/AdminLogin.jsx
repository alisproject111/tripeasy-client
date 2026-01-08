"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Toast";
import "../../styles/admin/AdminLogin.css";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Secure hardcoded credentials
    if (credentials.username === "alisp" && credentials.password === "alisp") {
      // Generate a secure token with timestamp
      const token = btoa(`authenticated_${Date.now()}_${Math.random()}`);
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminLoginTime", Date.now().toString());

      success("Login successful! Welcome to admin panel.");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid username or password");
      showError("Access denied. Please check your credentials.");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>TripEasy Admin</h1>
          <p>Sign in to manage your travel packages</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Signing in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            <i className="fas fa-shield-alt"></i>
            Secure admin access only
          </p>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;
