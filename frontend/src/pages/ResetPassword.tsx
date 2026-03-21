import { Link } from "react-router-dom";

export default function ResetPassword() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-title">
          <p className="eyebrow">Reset password</p>
          <h2>Get a secure reset link.</h2>
        </div>
        <div className="panel form-panel">
          <p>Enter your email and we will send instructions to reset your password.</p>
          <form className="form-stack">
            <label>
              <span>Email address</span>
              <input
                type="email"
                placeholder="you@market.com" 
                required
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                title="Enter a valid email address"
              />
            </label>
            <button className="button solid" type="submit">
              Send reset link
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
