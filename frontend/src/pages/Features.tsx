const featureItems = [
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
  {
    title: "Order Tracking",
    description: "Stay on top of customer orders with clear statuses and notes.",
  },
  {
    title: "Low Stock Alerts",
    description: "Get notified before you run out so you can restock in time.",
  },
  {
    title: "Analytics Dashboard",
    description: "Visualize weekly performance and top-selling items instantly.",
  },
];

// the Features component highlights the key features of the platform in a visually appealing way. 
// It uses a simple grid layout to display each feature with a title and description, making it easy for users to understand the benefits of using the system. 
export default function Features() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-title">
          <h2>Everything you need to manage a busy market day.</h2>
        </div>
        <div className="grid three">
          {featureItems.map((item) => (
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