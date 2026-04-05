import {
  FiBarChart2,
  FiBox,
  FiFileText,
  FiGrid,
  FiSettings,
  FiShoppingCart,
} from "react-icons/fi";
import type { SalesSummary, VendorProfile } from "../lib/api.ts";

type DashboardSection =
  | "overview"
  | "inventory"
  | "sales"
  | "analytics"
  | "reports"
  | "settings";

type DashboardSidebarProps = {
  activeSection: DashboardSection;
  onSelect: (section: DashboardSection) => void;
  profile: VendorProfile | null;
  summary: SalesSummary;
  formatCurrency: (value: number) => string;
};

const getInitials = (profile: VendorProfile | null) => {
  if (!profile) {
    return "VS";
  }
  const first = profile.firstName?.[0] ?? "";
  const last = profile.lastName?.[0] ?? "";
  const initials = `${first}${last}`.trim();
  return initials || profile.businessName?.[0] || "VS";
};

export default function DashboardSidebar({
  activeSection,
  onSelect,
  profile,
  summary,
  formatCurrency,
}: DashboardSidebarProps) {
  const vendorName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : "Vendor Dashboard";
  const shopName = profile?.businessName ?? "Vendor space";

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={vendorName}
              className="sidebar-avatar"
            />
          ) : (
            <div className="sidebar-avatar sidebar-avatar--placeholder">
              {getInitials(profile)}
            </div>
          )}
          {profile?.storeLogoUrl ? (
            <img
              src={profile.storeLogoUrl}
              alt={`${shopName} logo`}
              className="sidebar-logo"
            />
          ) : (
            <div className="sidebar-logo sidebar-logo--placeholder">Logo</div>
          )}
        </div>
        <p className="eyebrow">Vendor space</p>
        <h3>{shopName}</h3>
        <p className="sidebar-subtext">{vendorName}</p>
      </div>
      <nav className="sidebar-nav">
        <button
          className={activeSection === "overview" ? "active" : ""}
          onClick={() => onSelect("overview")}
          type="button"
        >
          <FiGrid className="sidebar-icon" aria-hidden />
          Overview
        </button>
        <button
          className={activeSection === "inventory" ? "active" : ""}
          onClick={() => onSelect("inventory")}
          type="button"
        >
          <FiBox className="sidebar-icon" aria-hidden />
          Inventory
        </button>
        <button
          className={activeSection === "sales" ? "active" : ""}
          onClick={() => onSelect("sales")}
          type="button"
        >
          <FiShoppingCart className="sidebar-icon" aria-hidden />
          Sales
        </button>
        <button
          className={activeSection === "analytics" ? "active" : ""}
          onClick={() => onSelect("analytics")}
          type="button"
        >
          <FiBarChart2 className="sidebar-icon" aria-hidden />
          Analytics
        </button>
        <button
          className={activeSection === "reports" ? "active" : ""}
          onClick={() => onSelect("reports")}
          type="button"
        >
          <FiFileText className="sidebar-icon" aria-hidden />
          Reports
        </button>
        <button
          className={activeSection === "settings" ? "active" : ""}
          onClick={() => onSelect("settings")}
          type="button"
        >
          <FiSettings className="sidebar-icon" aria-hidden />
          Settings
        </button>
      </nav>
      <div className="sidebar-quick">
        <p className="sidebar-label">Quick analytics</p>
        <div className="sidebar-metric">
          <span>Total revenue</span>
          <strong>{formatCurrency(summary.revenue)}</strong>
        </div>
        <div className="sidebar-metric">
          <span>Units sold</span>
          <strong>{summary.units}</strong>
        </div>
        <div className="sidebar-metric">
          <span>Sales recorded</span>
          <strong>{summary.salesCount}</strong>
        </div>
      </div>
    </aside>
  );
}
