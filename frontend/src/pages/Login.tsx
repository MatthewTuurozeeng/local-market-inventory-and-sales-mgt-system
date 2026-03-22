import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../lib/api.ts";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      const destination =
        (location.state as { from?: { pathname?: string } })?.from?.pathname ||
        "/dashboard";
      navigate(destination);
    } catch (err) {
      setError((err as Error).message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <section className="section">
        <div className="section-title">
          <p className="eyebrow">Login</p>
          <h2>Welcome back Daakye Vendor Space.</h2>
        </div>
        <div className="panel form-panel">
          <p>Sign in to continue managing your inventory and sales.</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            <label>
              <span>Email</span>
              <input
                type="email"
                placeholder="you@market.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                required
              />
            </label>
            {error && <p className="form-alert error">{error}</p>}
            <button className="button solid" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
          <p className="form-helper">
            <Link to="/reset-password">Forgot password?</Link>
          </p>
          <p className="form-helper">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </section>
    </div>
  );
}