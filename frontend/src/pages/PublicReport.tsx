import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../lib/api.ts";

// the PublicReport component serves as a public-facing page that showcases key statistics and highlights about the platform's impact. 
// it fetches public statistics from the API and displays them in a visually appealing way, along with insights into how vendors are benefiting from using the platform. 
// the component includes a hero section with a call to action for new vendors to join, as well as sections that highlight the real-time performance signals and overall platform impact. 
// error handling is implemented to manage any issues that arise during data fetching, ensuring a smooth user experience even when there are problems with loading the statistics.
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

const impactHighlights = [
  {
    title: "Faster stock decisions",
    description:
      "Vendors keep shelves full with low-stock alerts and daily sales summaries.",
  },
  {
    title: "Confident pricing",
    description:
      "Daily revenue trends help sellers refine prices and maximize margins.",
  },
  {
    title: "Proof of growth",
    description:
      "Every sale logged adds to a story you can show lenders, partners, and staff.",
  },
];

export default function PublicReport() {
  const [stats, setStats] = useState<PublicStats>(defaultStats);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
  const response = await fetch(`${API_BASE_URL}/api/public/stats`);
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

    fetchStats();
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

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-GH", {
      maximumFractionDigits: 0,
    }).format(value || 0);

  const snapshotLabel = useMemo(
    () => stats.snapshotDayLabel || defaultStats.snapshotDayLabel,
    [stats.snapshotDayLabel]
  );

  const averageRevenuePerVendor = stats.totalVendors
    ? stats.totalSales / stats.totalVendors
    : 0;
  const averageUnitsPerTransaction = stats.totalTransactions
    ? stats.totalUnits / stats.totalTransactions
    : 0;

  return (
    <div className="page-content">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <p className="eyebrow">Market Momentum Report</p>
            <h1>See what vendors are achieving with Daakye Vendor Space.</h1>
            <p className="subtext">
              Every number below is powered by real market stalls using the platform to
              track inventory, record sales, and grow customer trust. Join them and show
              your own progress in days.
            </p>
            <div className="hero-actions">
              <Link className="button solid" to="/signup">
                Join the vendor list
              </Link>
              <Link className="button outline" to="/get-started">
                See how it works
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <h3>{formatNumber(stats.totalVendors)}</h3>
                <p>vendors onboarded</p>
              </div>
              <div>
                <h3>{formatCurrency(stats.totalSales)}</h3>
                <p>sales recorded</p>
              </div>
              <div>
                <h3>{formatCurrency(stats.todayRevenue)}</h3>
                <p>platform revenue today</p>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <div className="card-header">
              <h4>Today's snapshot</h4>
              <span>{snapshotLabel}</span>
            </div>
            <div className="card-grid">
              <div>
                <p className="card-label">Top vendor sales</p>
                <h3>{formatCurrency(stats.topVendorRevenueToday)}</h3>
                <span className="card-tag">leading today</span>
              </div>
              <div>
                <p className="card-label">Transactions</p>
                <h3>{formatNumber(stats.totalTransactions)}</h3>
                <span className="card-tag">tracked</span>
              </div>
            </div>
            <div className="card-footer">
              <div>
                <p className="card-label">Average revenue per vendor</p>
                <h4>{formatCurrency(averageRevenuePerVendor)}</h4>
                <p className="card-meta">
                  {formatNumber(stats.totalUnits)} units sold across the platform
                </p>
              </div>
            </div>
            {statsError && <p className="form-alert error">{statsError}</p>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <p className="eyebrow">Why vendors stay</p>
          <h2>Real-time performance signals keep vendors confident and motivated.</h2>
        </div>
        <div className="grid three">
          {impactHighlights.map((item) => (
            <article key={item.title} className="panel">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <p className="eyebrow">Platform impact</p>
          <h2>Numbers that prove momentum.</h2>
        </div>
        <div className="grid two">
          <article className="panel">
            <h3>{formatNumber(stats.totalVendors)} vendors</h3>
            <p>have already signed up and are actively tracking their stalls.</p>
          </article>
          <article className="panel">
            <h3>{formatCurrency(stats.totalSales)} in sales</h3>
            <p>recorded so far, showing customers and lenders verified performance.</p>
          </article>
          <article className="panel">
            <h3>{formatNumber(stats.totalTransactions)} transactions</h3>
            <p>logged with receipt-ready detail for quick restocking decisions.</p>
          </article>
          <article className="panel">
            <h3>{formatNumber(averageUnitsPerTransaction)} units per sale</h3>
            <p>on average, revealing the volume vendors move every market day.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
