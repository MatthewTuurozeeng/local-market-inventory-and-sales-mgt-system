import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-title">
          <p className="eyebrow">404</p>
          <h2>We couldn’t find that page.</h2>
        </div>
        <p>Try heading back to the homepage.</p>
        <Link className="button solid" to="/">
          Go home
        </Link>
      </section>
    </div>
  );
}