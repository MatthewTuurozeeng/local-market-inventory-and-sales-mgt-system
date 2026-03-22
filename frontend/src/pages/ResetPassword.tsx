import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../lib/api.ts";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message || "Reset link sent.");
    } catch (err) {
      setError((err as Error).message || "Unable to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <section className="section">
        <div className="section-title">
          <p className="eyebrow">Reset password</p>
          <h2>Get a secure reset link.</h2>
        </div>
        <div className="panel form-panel">
          <p>Enter your email and we will send instructions to reset your password.</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            <label>
              <span>Email address</span>
              <input
                type="email"
                placeholder="you@market.com" 
                required
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                title="Enter a valid email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            {error && <p className="form-alert error">{error}</p>}
            {message && <p className="form-alert success">{message}</p>}
            <button className="button solid" type="submit">
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
          <p className="form-helper">
            If you remember your password, go back to <Link to="/login">Login</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
