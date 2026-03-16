export default function About() {
  return (
    <div className="page-content">
      <section className="section about">
        <div className="about-text">
          <p className="eyebrow">About</p>
          <h2>Designed with local commerce in mind.</h2>
          <p>
            We’re building a lightweight, mobile-first tool for market vendors across
            Ghana. It works on low-end phones, supports offline workflows, and keeps
            data secure so you can focus on your customers.
          </p>
          <button className="button solid">Join the waitlist</button>
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