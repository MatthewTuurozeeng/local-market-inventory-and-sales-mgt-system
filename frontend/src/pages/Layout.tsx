import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { hasToken, logout } from "../lib/api.ts";
import { useTheme } from "../lib/theme.tsx";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const useMocks = import.meta.env.VITE_USE_MOCKS === "true";
  const [isAuthed, setIsAuthed] = useState(hasToken() || useMocks);
  const { theme, toggleTheme } = useTheme();
  const themeLabel = theme === "dark" ? "Light" : "Dark";
  const ThemeIcon = theme === "dark" ? FiSun : FiMoon;

  useEffect(() => {
    setIsAuthed(hasToken() || useMocks);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setIsAuthed(hasToken() || useMocks);
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthed(false);
    navigate("/login");
  };
  return (
    <div className="page">
      <header className="site-header">
        <nav className="navbar">
          <Link to="/" className="brand">
            <span className="brand-mark"></span>
            <span>Daakye Vendor Space</span>
          </Link>
          <div className="nav-links">
            <NavLink
              to="/features"
              className={({ isActive }: { isActive: boolean }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              Features
            </NavLink>
            <NavLink
              to="/how-it-works"
              className={({ isActive }: { isActive: boolean }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              How It Works
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }: { isActive: boolean }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              About
            </NavLink>
          </div>
          <div className="nav-actions">
            <button
              className="button ghost theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${themeLabel.toLowerCase()} mode`}
            >
              <span className="theme-icon" aria-hidden="true">
                <ThemeIcon />
              </span>
              <span>{themeLabel} Mode</span>
            </button>
            {isAuthed ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }: { isActive: boolean }) =>
                    `button outline${isActive ? " active" : ""}`
                  }
                >
                  Dashboard
                </NavLink>
                <button className="button ghost" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }: { isActive: boolean }) =>
                    `button ghost${isActive ? " active" : ""}`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/get-started"
                  className={({ isActive }: { isActive: boolean }) =>
                    `button solid${isActive ? " active" : ""}`
                  }
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <p>© 2026 Local Market Inventory & Sales Management System</p>
        <div className="footer-links">
          <NavLink to="/features">Features</NavLink>
          <NavLink to="/how-it-works">How It Works</NavLink>
          <NavLink to="/about">About</NavLink>
        </div>
      </footer>
    </div>
  );
}