import { Link } from "react-router-dom";

export default function NotFound() { // the NotFound component serves as a user-friendly 404 error page that is displayed when a user tries to access a route that does not exist within the application.
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-title">
          <p className="eyebrow">404</p>
          <h2>We couldn't find that page.</h2>
        </div>
        <p>Head back to homepage.</p>
        <Link className="button solid" to="/">
          Go home
        </Link>
      </section>
    </div>
  );
}