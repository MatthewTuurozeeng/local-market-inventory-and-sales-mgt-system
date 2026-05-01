

import { useEffect, useMemo, useState } from "react"; // react hooks for managing component state and side effects
import { useNavigate } from "react-router-dom"; // for programmatic navigation between routes
import {
  adjustStock,
  createProduct,
  createSale,
  getProducts,
  getProfile,
  getSales,
  getSummary,
  hasToken,
  downloadSalesReport,
  resolveMediaUrl,
  type Product,
  type SalesSummary,
  type VendorProfile,
} from "../lib/api.ts";
import SettingsPage from "../components/settings/SettingsPage.tsx";
import DashboardSidebar from "./DashboardSidebar.tsx";

const emptySummary: SalesSummary = { revenue: 0, units: 0, salesCount: 0 };
const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

const mockProfile: VendorProfile = {
  id: "demo-vendor",
  firstName: "Ama",
  lastName: "Mensah",
  email: "ama@market.com",
  businessName: "Ama Fresh Produce",
  location: "Makola Market, Accra",
  primaryProducts: "Tomatoes, onions, peppers",
  staffCount: 3,
  productTypes: ["Fresh produce", "Spices & condiments"],
  otherProductTypes: "Citrus",
  avatarUrl: null,
  storeLogoUrl: null,
};

const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Tomatoes",
    category: "Fresh produce",
    unit: "crate",
    price: 180,
    stock: 12,
    lowStockThreshold: 5,
  },
  {
    id: "prod-2",
    name: "Red onions",
    category: "Fresh produce",
    unit: "bag",
    price: 95,
    stock: 4,
    lowStockThreshold: 6,
  },
  {
    id: "prod-3",
    name: "Chili peppers",
    category: "Spices & condiments",
    unit: "kg",
    price: 32,
    stock: 18,
    lowStockThreshold: 8,
  },
];

const mockSales = [
  {
    id: "sale-1",
    productId: "prod-1",
    quantity: 2,
    unitPrice: 180,
    total: 360,
    soldAt: new Date().toISOString(),
  },
  {
    id: "sale-2",
    productId: "prod-2",
    quantity: 1,
    unitPrice: 95,
    total: 95,
    soldAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "sale-3",
    productId: "prod-3",
    quantity: 6,
    unitPrice: 32,
    total: 192,
    soldAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

// the dashboard component is the main interface for vendors to manage their inventory, record sales, and view analytics.
//  It uses various React hooks to manage state and side effects, and it interacts with the backend API to fetch and update data. 
// The dashboard includes sections for an overview of sales activity, inventory management, sales recording, analytics, report generation, and settings. 

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(
    "overview" as
      | "overview"
      | "inventory"
      | "sales"
      | "analytics"
      | "reports"
      | "settings"
  );
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [summary, setSummary] = useState<SalesSummary>(emptySummary);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<
    { id: string; productId: string; quantity: number; unitPrice: number; total: number; soldAt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    unit: "",
    price: "",
    stock: "",
    lowStockThreshold: "5",
  });
  const [saleForm, setSaleForm] = useState({
    productId: "",
    quantity: "",
    unitPrice: "",
  });
  const [stockForm, setStockForm] = useState({ productId: "", delta: "" });
  const [reportForm, setReportForm] = useState({
    startDate: "",
    endDate: "",
    format: "pdf" as "pdf" | "xlsx",
    fields: ["product", "quantity", "unitPrice", "total", "soldAt"],
  });
  const [reportStatus, setReportStatus] = useState("");

  const reportFields = [
    { key: "product", label: "Product" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Quantity" },
    { key: "unitPrice", label: "Unit price" },
    { key: "total", label: "Total" },
    { key: "soldAt", label: "Date" },
  ];

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  const dailyRevenue = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const dateKey = date.toISOString().slice(0, 10);
      return {
        label: date.toLocaleDateString("en-GH", { month: "short", day: "numeric" }),
        dateKey,
        revenue: 0,
      };
    });

    sales.forEach((sale) => {
      const saleKey = sale.soldAt?.slice(0, 10);
      const bucket = days.find((day) => day.dateKey === saleKey);
      if (bucket) {
        bucket.revenue += Number(sale.total);
      }
    });

    return days;
  }, [sales]);

  const topProducts = useMemo(() => {
    const totals = new Map<string, number>();
    sales.forEach((sale) => {
      totals.set(
        sale.productId,
        (totals.get(sale.productId) || 0) + Number(sale.total)
      );
    });
    return Array.from(totals.entries())
      .map(([productId, total]) => ({
        productId,
        name: productMap.get(productId)?.name ?? "Unknown",
        total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [productMap, sales]);

  const maxDailyRevenue = Math.max(
    1,
    ...dailyRevenue.map((day) => day.revenue)
  );
  const maxTopRevenue = Math.max(1, ...topProducts.map((item) => item.total));

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const loadData = async () => {
    if (useMocks) {
      const mockSummary = mockSales.reduce(
        (acc, sale) => ({
          revenue: acc.revenue + Number(sale.total),
          units: acc.units + Number(sale.quantity),
          salesCount: acc.salesCount + 1,
        }),
        { revenue: 0, units: 0, salesCount: 0 }
      );
      setProfile({
        ...mockProfile,
        avatarUrl: resolveMediaUrl(mockProfile.avatarUrl),
        storeLogoUrl: resolveMediaUrl(mockProfile.storeLogoUrl),
      });
      setSummary(mockSummary);
      setProducts(mockProducts);
      setSales(mockSales);
      setLoading(false);
      return;
    }
    if (!hasToken()) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [profileData, summaryData, productsData, salesData] = await Promise.all([
        getProfile(),
        getSummary(),
        getProducts(),
        getSales(),
      ]);
      setProfile({
        ...profileData,
        avatarUrl: resolveMediaUrl(profileData.avatarUrl),
        storeLogoUrl: resolveMediaUrl(profileData.storeLogoUrl),
      });
      setSummary(summaryData.summary ?? emptySummary);
      setProducts(productsData.products ?? []);
      setSales(salesData.sales ?? []);
    } catch (err) {
      setError((err as Error).message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProductSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await createProduct({
        name: productForm.name,
        category: productForm.category,
        unit: productForm.unit,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        lowStockThreshold: Number(productForm.lowStockThreshold),
      });
      setProductForm({
        name: "",
        category: "",
        unit: "",
        price: "",
        stock: "",
        lowStockThreshold: "5",
      });
      await loadData();
    } catch (err) {
      setError((err as Error).message || "Unable to add product.");
    }
  };
// the handleProductSubmit function is called when the vendor submits the form to add a new product. 
// It prevents the default form submission behavior, clears any existing error messages, and then attempts to create a new product using the createProduct API function. 
// If the product is created successfully, it resets the form fields and reloads the dashboard data to reflect the new product. 
// If there is an error during this process, it sets an error message to inform the user.
  const handleSaleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await createSale({
        productId: saleForm.productId,
        quantity: Number(saleForm.quantity),
        unitPrice: Number(saleForm.unitPrice),
      });
      setSaleForm({ productId: "", quantity: "", unitPrice: "" });
      await loadData();
    } catch (err) {
      setError((err as Error).message || "Unable to record sale.");
    }
  };

  const handleStockAdjust = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await adjustStock(stockForm.productId, Number(stockForm.delta));
      setStockForm({ productId: "", delta: "" });
      await loadData();
    } catch (err) {
      setError((err as Error).message || "Unable to adjust stock.");
    }
  };

  const toggleReportField = (field: string) => {
    setReportForm((prev) => {
      const exists = prev.fields.includes(field);
      return {
        ...prev,
        fields: exists
          ? prev.fields.filter((item) => item !== field)
          : [...prev.fields, field],
      };
    });
  };

  const handleReportGenerate = async (event: React.FormEvent) => {
    event.preventDefault();
    setReportStatus("");
    if (useMocks) {
      setReportStatus("Reports are available when using the live API.");
      return;
    }
    if (reportForm.fields.length === 0) {
      setReportStatus("Select at least one field for the report.");
      return;
    }
    try {
      const blob = await downloadSalesReport({
        startDate: reportForm.startDate || undefined,
        endDate: reportForm.endDate || undefined,
        fields: reportForm.fields,
        format: reportForm.format,
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `sales-report.${reportForm.format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      setReportStatus("Report downloaded successfully.");
    } catch (err) {
      setReportStatus((err as Error).message || "Unable to generate report.");
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <section className="section">
          <div className="panel">
            <p>Loading your dashboard...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="dashboard-layout">
        <DashboardSidebar
          activeSection={activeSection}
          onSelect={setActiveSection}
          profile={profile}
          summary={summary}
          formatCurrency={formatCurrency}
        />
        <div className="dashboard-main">
          <section className="section dashboard-hero">
            <div className="dashboard-header">
              <div>
                <p className="eyebrow">Vendor dashboard</p>
                <h2>{profile ? `Welcome, ${profile.firstName}` : "Welcome back"}.</h2>
                <p className="subtext">
                  Track inventory, record sales, and stay ahead of low-stock alerts.
                </p>
              </div>
            </div>
            {error && <p className="form-alert error">{error}</p>}
            <div className="dashboard-cards">
              <div className="panel dashboard-card">
                <p>Total revenue</p>
                <h3>{formatCurrency(summary.revenue)}</h3>
              </div>
              <div className="panel dashboard-card">
                <p>Units sold</p>
                <h3>{summary.units}</h3>
              </div>
              <div className="panel dashboard-card">
                <p>Sales recorded</p>
                <h3>{summary.salesCount}</h3>
              </div>
            </div>
          </section>

          {activeSection === "overview" && (
            <section className="section dashboard-analytics">
              <div className="panel">
                <h3>Sales activity (last 7 days)</h3>
                <div className="chart-list">
                  {dailyRevenue.map((day) => {
                    const percent = Math.round(
                      (day.revenue / maxDailyRevenue) * 100
                    );
                    return (
                      <div className="chart-row" key={day.dateKey}>
                        <span className="chart-label">{day.label}</span>
                        <div className="chart-track">
                          <div
                            className="chart-fill"
                            style={{
                              width:
                                day.revenue === 0 ? 0 : `${Math.max(6, percent)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="chart-value">
                          {formatCurrency(day.revenue)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="panel">
                <h3>Top products by revenue</h3>
                <div className="chart-list">
                  {topProducts.length === 0 && <p>No sales yet to analyze.</p>}
                  {topProducts.map((item) => {
                    const percent = Math.round(
                      (item.total / maxTopRevenue) * 100
                    );
                    return (
                      <div className="chart-row" key={item.productId}>
                        <span className="chart-label">{item.name}</span>
                        <div className="chart-track">
                          <div
                            className="chart-fill"
                            style={{
                              width:
                                item.total === 0 ? 0 : `${Math.max(6, percent)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="chart-value">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
          

          {activeSection === "inventory" && (
            <section className="section dashboard-grid">
              <div className="panel">
                <h3>Inventory overview</h3>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Unit</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={6}>No products yet. Add your first item.</td>
                        </tr>
                      )}
                      {products.map((product) => {
                        const lowStock = product.stock <= product.lowStockThreshold;
                        return (
                          <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.unit}</td>
                            <td>{formatCurrency(product.price)}</td>
                            <td>{product.stock}</td>
                            <td>
                              <span
                                className={`status-pill ${lowStock ? "danger" : "ok"}`}
                              >
                                {lowStock ? "Low stock" : "Healthy"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel">
                <h3>Add a new product</h3>
                <form className="form-stack" onSubmit={handleProductSubmit}>
                  <label>
                    <span>Product name</span>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(event) =>
                        setProductForm({ ...productForm, name: event.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    <span>Category</span>
                    <input
                      type="text"
                      value={productForm.category}
                      onChange={(event) =>
                        setProductForm({
                          ...productForm,
                          category: event.target.value,
                        })
                      }
                      required
                    />
                  </label>
                  <label>
                    <span>Unit (e.g. crate, kg)</span>
                    <input
                      type="text"
                      value={productForm.unit}
                      onChange={(event) =>
                        setProductForm({ ...productForm, unit: event.target.value })
                      }
                      required
                    />
                  </label>
                  <div className="form-grid">
                    <label>
                      <span>Price per unit (GHS)</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={productForm.price}
                        onChange={(event) =>
                          setProductForm({
                            ...productForm,
                            price: event.target.value,
                          })
                        }
                        required
                      />
                    </label>
                    <label>
                      <span>Opening stock</span>
                      <input
                        type="number"
                        min="0"
                        value={productForm.stock}
                        onChange={(event) =>
                          setProductForm({
                            ...productForm,
                            stock: event.target.value,
                          })
                        }
                        required
                      />
                    </label>
                  </div>
                  <label>
                    <span>Low stock alert threshold</span>
                    <input
                      type="number"
                      min="0"
                      value={productForm.lowStockThreshold}
                      onChange={(event) =>
                        setProductForm({
                          ...productForm,
                          lowStockThreshold: event.target.value,
                        })
                      }
                    />
                  </label>
                  <button className="button solid" type="submit">
                    Add product
                  </button>
                </form>
              </div>
            </section>
          )}

          {activeSection === "sales" && (
            <section className="section dashboard-grid">
              <div className="panel">
                <h3>Record a sale</h3>
                <form className="form-stack" onSubmit={handleSaleSubmit}>
                  <label>
                    <span>Product sold</span>
                    <select
                      value={saleForm.productId}
                      onChange={(event) =>
                        setSaleForm({ ...saleForm, productId: event.target.value })
                      }
                      required
                    >
                      <option value="" disabled>
                        Select a product
                      </option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.stock} in stock)
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="form-grid">
                    <label>
                      <span>Quantity sold</span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={saleForm.quantity}
                        onChange={(event) =>
                          setSaleForm({ ...saleForm, quantity: event.target.value })
                        }
                        required
                      />
                    </label>
                    <label>
                      <span>Unit price (GHS)</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={saleForm.unitPrice}
                        onChange={(event) =>
                          setSaleForm({
                            ...saleForm,
                            unitPrice: event.target.value,
                          })
                        }
                        required
                      />
                    </label>
                  </div>
                  <button className="button solid" type="submit">
                    Save sale
                  </button>
                </form>
              </div>

              <div className="panel">
                <h3>Adjust stock</h3>
                <form className="form-stack" onSubmit={handleStockAdjust}>
                  <label>
                    <span>Product</span>
                    <select
                      value={stockForm.productId}
                      onChange={(event) =>
                        setStockForm({
                          ...stockForm,
                          productId: event.target.value,
                        })
                      }
                      required
                    >
                      <option value="" disabled>
                        Select a product
                      </option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Stock change (+/-)</span>
                    <input
                      type="number"
                      step="1"
                      value={stockForm.delta}
                      onChange={(event) =>
                        setStockForm({ ...stockForm, delta: event.target.value })
                      }
                      required
                    />
                  </label>
                  <button className="button solid" type="submit">
                    Update stock
                  </button>
                </form>
              </div>
            </section>
          )}

          {activeSection === "sales" && (
            <section className="section">
              <div className="panel">
                <h3>Recent sales</h3>
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Unit price</th>
                        <th>Total</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.length === 0 && (
                        <tr>
                          <td colSpan={5}>No sales yet.</td>
                        </tr>
                      )}
                      {sales.map((sale) => (
                        <tr key={sale.id}>
                          <td>{productMap.get(sale.productId)?.name ?? "Unknown"}</td>
                          <td>{sale.quantity}</td>
                          <td>{formatCurrency(sale.unitPrice)}</td>
                          <td>{formatCurrency(sale.total)}</td>
                          <td>{new Date(sale.soldAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeSection === "analytics" && (
            <section className="section dashboard-analytics">
              <div className="panel">
                <h3>Sales activity (last 7 days)</h3>
                <div className="chart-list">
                  {dailyRevenue.map((day) => {
                    const percent = Math.round(
                      (day.revenue / maxDailyRevenue) * 100
                    );
                    return (
                      <div className="chart-row" key={day.dateKey}>
                        <span className="chart-label">{day.label}</span>
                        <div className="chart-track">
                          <div
                            className="chart-fill"
                            style={{
                              width:
                                day.revenue === 0 ? 0 : `${Math.max(6, percent)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="chart-value">
                          {formatCurrency(day.revenue)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="panel">
                <h3>Top products by revenue</h3>
                <div className="chart-list">
                  {topProducts.length === 0 && <p>No sales yet to analyze.</p>}
                  {topProducts.map((item) => {
                    const percent = Math.round(
                      (item.total / maxTopRevenue) * 100
                    );
                    return (
                      <div className="chart-row" key={item.productId}>
                        <span className="chart-label">{item.name}</span>
                        <div className="chart-track">
                          <div
                            className="chart-fill"
                            style={{
                              width:
                                item.total === 0 ? 0 : `${Math.max(6, percent)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="chart-value">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </section>
          )}

          {activeSection === "reports" && (
            <section className="section dashboard-analytics">
              <div className="panel">
                <h3>Generate sales report</h3>
                <p className="form-helper">
                  Choose the period, fields, and format for your report.
                </p>
                <form className="form-stack" onSubmit={handleReportGenerate}>
                  <div className="form-grid">
                    <label>
                      <span>Start date</span>
                      <input
                        type="date"
                        value={reportForm.startDate}
                        onChange={(event) =>
                          setReportForm({
                            ...reportForm,
                            startDate: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      <span>End date</span>
                      <input
                        type="date"
                        value={reportForm.endDate}
                        onChange={(event) =>
                          setReportForm({ ...reportForm, endDate: event.target.value })
                        }
                      />
                    </label>
                  </div>
                  <label>
                    <span>Report format</span>
                    <select
                      value={reportForm.format}
                      onChange={(event) =>
                        setReportForm({
                          ...reportForm,
                          format: event.target.value as "pdf" | "xlsx",
                        })
                      }
                    >
                      <option value="pdf">PDF</option>
                      <option value="xlsx">Excel (XLSX)</option>
                    </select>
                  </label>
                  <label>
                    <span>Include fields</span>
                    <div className="checkbox-group">
                      {reportFields.map((field) => (
                        <label key={field.key}>
                          <input
                            type="checkbox"
                            checked={reportForm.fields.includes(field.key)}
                            onChange={() => toggleReportField(field.key)}
                          />
                          {field.label}
                        </label>
                      ))}
                    </div>
                  </label>
                  {reportStatus && <p className="form-alert">{reportStatus}</p>}
                  <button className="button solid" type="submit">
                    Download report
                  </button>
                </form>
              </div>

              <div className="panel">
                <h3>Report tips</h3>
                <ul className="report-tips">
                  <li>Use a date range to limit the report period.</li>
                  <li>Select only the fields you need for a cleaner document.</li>
                  <li>PDF is best for sharing, Excel for deeper analysis.</li>
                </ul>
              </div>
            </section>
          )}

          {activeSection === "settings" && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}
