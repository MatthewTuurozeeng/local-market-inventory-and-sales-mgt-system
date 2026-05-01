
// The GetStarted component provides a simple, step-by-step guide for new users to quickly set up their digital stall and start selling. 
// It uses a clean layout with clear instructions to help users understand the onboarding process and get started with the platform in just a few minutes.

export default function GetStarted() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-title">
          <h2>Launch your digital stall in minutes.</h2>
        </div>
        <div className="grid two">
          <article className="panel">
            <h3>Step 1: Create your profile</h3>
            <p>Add your shop name, location, and preferred language.</p>
          </article>
          <article className="panel">
            <h3>Step 2: Add your products</h3>
            <p>Upload inventory with prices, categories, and starting quantities.</p>
          </article>
          <article className="panel">
            <h3>Step 3: Start selling</h3>
            <p>Record sales, track cash flow, and stay on top of stock.</p>
          </article>
          <article className="panel">
            <h3>Step 4: Review insights</h3>
            <p>Use the analytics dashboard to grow your business with confidence.</p>
          </article>
        </div>
      </section>
    </div>
  );
}