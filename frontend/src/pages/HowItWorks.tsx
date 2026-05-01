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

// the HowItWorks component provides a clear and concise overview of the key steps involved in using the platform. 
// it breaks down the onboarding process into three simple steps, making it easy for new users to understand how to get started and what to expect from the system. 
// each step is presented in a visually appealing way, with a title and description that highlights the main actions users need to take to successfully use the platform.
export default function HowItWorks() {
  return (
    <div className="page-content">
      <section className="section highlight">
        <div className="section-title">
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