// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Login.jsx — Email + Password only (no demo cards)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Icon } from "../components/common";

const Login = ({ onLoginWithEmail }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) return setError("Email is required");
    if (!password.trim()) return setError("Password is required");

    setLoading(true);
    try {
      await onLoginWithEmail(email, password);
    } catch (err) {
      setError(err.message || "Invalid email or password");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)", color: "#fff",
    fontSize: 14, outline: "none", transition: "border 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64,
            background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
            borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", boxShadow: "0 8px 32px rgba(79,70,229,0.3)",
          }}>
            <Icon name="leave" size={30} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 800, color: "#fff" }}>
            LeaveFlow
          </h1>
          <p style={{ color: "#a5b4fc", fontSize: 14, marginTop: 6 }}>
            Employee Leave Management System
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)",
          borderRadius: 20, padding: 32, border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <h2 style={{ color: "#fff", fontFamily: "Syne", fontWeight: 700, fontSize: 20, marginBottom: 4 }}>
            Welcome back
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 24 }}>
            Sign in to your account
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 16,
              color: "#fca5a5", fontSize: 13, fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24, position: "relative" }}>
            <label style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
              PASSWORD
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ ...inputStyle, paddingRight: 44 }}
              onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: 12, top: 34,
                background: "none", border: "none", cursor: "pointer",
                color: "#64748b", fontSize: 12, fontWeight: 600,
              }}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>

          {/* Sign In */}
          <button
            className="btn btn-primary"
            style={{
              width: "100%", justifyContent: "center",
              padding: "13px", fontSize: 15, opacity: loading ? 0.6 : 1,
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", color: "#475569", fontSize: 12, marginTop: 20 }}>
          Contact your administrator if you don't have an account
        </p>
      </div>
    </div>
  );
};

export default Login;
