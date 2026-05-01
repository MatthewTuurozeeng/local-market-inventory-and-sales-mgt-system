import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../lib/api.ts"; // the Home component serves as the landing page for the application, providing an overview of the platform's features and benefits. 
// It also fetches and displays public statistics about the platform, such as total vendors, sales, and transactions. 
// The component uses React hooks to manage state and side effects, and it includes a hero section with a call to action, as well as a highlights section that showcases key features of the system.

type PublicStats = {
  totalVendors: number;
  totalSales: number;
  totalUnits: number;
  totalTransactions: number;
  todayRevenue: number;
  topVendorRevenueToday: number;
  snapshotDayLabel: string;
};

const defaultStats: PublicStats = {
  totalVendors: 0,
  totalSales: 0,
  totalUnits: 0,
  totalTransactions: 0,
  todayRevenue: 0,
  topVendorRevenueToday: 0,
  snapshotDayLabel: new Date().toLocaleDateString("en-GH", { weekday: "short" }),
};

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
  const [stats, setStats] = useState<PublicStats>(defaultStats);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
  const response = await fetch(`${API_BASE_URL}/api/public/stats`); // Fetch public stats from the API
        if (!response.ok) {
          throw new Error("Unable to load stats");
        }
        const data = (await response.json()) as PublicStats;
        if (isMounted) {
          setStats(data);
        }
      } catch (err) {
        if (isMounted) {
          setStatsError((err as Error).message || "Unable to load stats");
        }
      }
    };

    fetchStats(); // Fetch stats on component mount
    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const snapshotLabel = useMemo(
    () => stats.snapshotDayLabel || defaultStats.snapshotDayLabel,
    [stats.snapshotDayLabel]
  );

  return (
    <div className="page-content">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <p className="eyebrow">Built for market vendors</p>
            <h1>Run your stall with clarity, speed, and confidence.</h1>
            <p className="subtext">
              Daakye Vendor Space Inventory & Sales helps you track stock, record sales, and
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
                <h3>3 mins</h3>
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
              <span>{snapshotLabel}</span>
            </div>
            <div className="card-grid">
              <div>
                <p className="card-label">Sales</p>
                <h3>{formatCurrency(stats.todayRevenue)}</h3>
                <span className="card-tag">live</span>
              </div>
              <div>
                <p className="card-label">Transactions</p>
                <h3>{stats.totalTransactions}</h3>
                <span className="card-tag">platform</span>
              </div>
            </div>
            <div className="card-footer">
              <div>
                <p className="card-label">Top vendor sales today</p>
                <h4>{formatCurrency(stats.topVendorRevenueToday)}</h4>
                <p className="card-meta">{stats.totalVendors} vendors onboarded</p>
              </div>
              <Link className="button small" to="/report">
                View report
              </Link>
            </div>
            {statsError && <p className="form-alert error">{statsError}</p>}
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