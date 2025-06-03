
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCurrentUser, logout } from "../utils/auth";

export default function NavBar({ theme, toggleTheme }) {
  const [user, setUser] = useState(getCurrentUser());
  const location = useLocation();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [location]);

  return (
    <nav className="navbar">
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: "600", fontSize: "1.125rem" }}>
          FinanceApp
        </Link>
        <button
          onClick={toggleTheme}
          style={{
            marginLeft: "var(--space-4)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text)",
            fontSize: "1.25rem",
          }}
          aria-label="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        {user ? (
          <>
            <span
              style={{
                margin: "0 var(--space-3)",
                color: "var(--color-text-light)",
              }}
            >
              Hello, {user.name}
            </span>
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn" style={{ marginRight: "var(--space-3)" }}>
              Login
            </Link>
            <Link to="/register" className="btn">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
