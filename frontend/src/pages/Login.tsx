import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-title">
          <p className="eyebrow">Login</p>
          <h2>Welcome back to Local Market.</h2>
        </div>
        <div className="panel form-panel">
          <p>Sign in to continue managing your inventory and sales.</p>
          <div className="form-stack">
            <label>
              <span>Email</span>
              <input type="email" placeholder="you@market.com" />
            </label>
            <label>
              <span>Password</span>
              <input type="password" placeholder="••••••••" />
            </label>
            <button className="button solid">Login</button>
          </div>
          <p className="form-helper">
            Don’t have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </section>
    </div>
  );
}