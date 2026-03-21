const featureHighlights = [
  {
    title: "Smart Inventory",
    description: "Track stock levels in real time and get low-stock alerts before you run out.",
  },
  {
    title: "Sales in Seconds",
    description: "Record sales quickly with a mobile-first flow tailored for busy markets.",
  },
  {
    title: "Actionable Insights",
    description: "See daily summaries, top sellers, and trends that help you restock wisely.",
  },
];

export default function Home() {
  return (
    <div className="page-content">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <p className="eyebrow">Built for Ghanaian market vendors</p>
            <h1>Run your stall with clarity, speed, and confidence.</h1>
            <p className="subtext">
              Local Market Inventory & Sales helps you track stock, record sales, and
              understand your best-performing products—all from your phone.
            </p>
            <div className="hero-actions">
              <button className="button solid">Start free trial</button>
              <button className="button outline">Watch a demo</button>
            </div>
            <div className="hero-stats">
              <div>
                <h3>20% faster</h3>
                <p>daily sales reporting</p>
              </div>
              <div>
                <h3>5 mins</h3>
                <p>setup time</p>
              </div>
              <div>
                <h3>24/7</h3>
                <p>inventory visibility</p>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <div className="card-header">
              <h4>Today's Snapshot</h4>
              <span>Tue</span>
            </div>
            <div className="card-grid">
              <div>
                <p className="card-label">Sales</p>
                <h3>₵ 1,240</h3>
                <span className="card-tag">+12%</span>
              </div>
              <div>
                <p className="card-label">Orders</p>
                <h3>36</h3>
                <span className="card-tag">steady</span>
              </div>
            </div>
            <div className="card-footer">
              <div>
                <p className="card-label">Top seller</p>
                <h4>Fresh tomatoes</h4>
              </div>
              <button className="button small">View report</button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <p className="eyebrow">Highlights</p>
          <h2>See the most-loved features at a glance.</h2>
        </div>
        <div className="grid three">
          {featureHighlights.map((item) => (
            <article key={item.title} className="panel">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}