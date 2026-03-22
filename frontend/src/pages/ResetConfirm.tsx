import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset } from "../lib/api.ts";

export default function ResetConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectDelayMs = 1200;

  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (!token) {
      setError("Reset token is required.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await confirmPasswordReset({ token, password });
      setStatus(response.message || "Password reset successful.");
    } catch (err) {
      setError((err as Error).message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!status || error) {
      return;
    }

    const timeoutId = window.setTimeout(() => navigate("/login"), redirectDelayMs);
    return () => window.clearTimeout(timeoutId);
  }, [status, error, navigate, redirectDelayMs]);

  return (
    <div className="page-content">
      <section className="section">
        <div className="section-title">
          <p className="eyebrow">New password</p>
          <h2>Set a new password.</h2>
        </div>
        <div className="panel form-panel">
          <p>Paste your reset token and choose a new password.</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            <label>
              <span>Reset token</span>
              <input
                type="text"
                placeholder="Paste token"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                required
              />
            </label>
            <label>
              <span>New password</span>
              <input
                type="password"
                placeholder="Create a strong password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <label>
              <span>Confirm password</span>
              <input
                type="password"
                placeholder="Re-enter password"
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </label>
            {status && (
              <p className="form-alert success">
                {status} Redirecting to login…
              </p>
            )}
            {error && <p className="form-alert error">{error}</p>}
            <button className="button solid" type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
          <p className="form-helper">
            Back to <Link to="/login">Login</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
