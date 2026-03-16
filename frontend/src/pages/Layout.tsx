import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="page">
      <header className="site-header">
        <nav className="navbar">
          <Link to="/" className="brand">
            <span className="brand-mark"></span>
            <span>Local Market</span>
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