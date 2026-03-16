const steps = [
  {
    title: "Set up your stall",
    description: "Add products once and organize them by category for quick access.",
  },
  {
    title: "Record every sale",
    description: "Tap to capture transactions and automatically update stock counts.",
  },
  {
    title: "Review and grow",
    description: "Check insights and share reports with partners or bookkeepers.",
  },
];

export default function HowItWorks() {
  return (
    <div className="page-content">
      <section className="section highlight">
        <div className="section-title">
          <p className="eyebrow">How it works</p>
          <h2>Get started in three simple steps.</h2>
        </div>
        <div className="grid three">
          {steps.map((step, index) => (
            <article key={step.title} className="panel step">
              <span className="step-index">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}