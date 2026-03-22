export default function About() {
  return (
    <div className="page-content">
      <section className="section about">
        <div className="about-text">
          <p className="eyebrow">About</p>
          <h2>Built for local market vendors in Ghana.</h2>
          <p>
            Our platform is a simple and powerful sales and inventory management system
            designed specifically for local market vendors in Ghana. It helps vendors
            efficiently manage their daily business activities—from tracking stock and
            recording sales to monitoring performance—all in one place.
          </p>
          <p>
            We understand the unique challenges faced by small and medium-scale traders,
            including limited access to digital tools, language barriers, and the need
            for simplicity. That’s why this platform is built with a user-friendly
            interface and includes features like light and dark mode for a more
            comfortable user experience in different environments.
          </p>
          <p>With this system, vendors can:</p>
          <ul className="about-list">
            <li>Record and track sales in real time</li>
            <li>Manage inventory and receive low-stock alerts</li>
            <li>Access business insights to make better decisions</li>
            <li>Receive notifications via SMS and email</li>
          </ul>
          <p>
            Our goal is to digitally empower local businesses, improve record-keeping,
            and support vendors in growing and sustaining their enterprises.
          </p>
        </div>
        <div className="about-card">
          <h3>Trusted by community markets</h3>
          <ul>
            <li>Offline-friendly daily logs</li>
            <li>Multi-language ready</li>
            <li>Safe cloud backups</li>
          </ul>
        </div>
      </section>
    </div>
  );
}