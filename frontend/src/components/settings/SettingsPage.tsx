import { useEffect, useState } from "react";
import {
  getProducts,
  getSales,
  getSettings,
  resolveMediaUrl,
  updateSettingsInventory,
  updateSettingsNotifications,
  updateSettingsPassword,
  updateSettingsProfile,
  uploadAvatar,
  uploadStoreLogo,
  type InventorySettings,
  type NotificationSettings,
  type VendorSettingsProfile,
} from "../../lib/api.ts";
import ProfileSettings from "./ProfileSettings.tsx";
import ThemeSettings from "./ThemeSettings.tsx";
import NotificationSettingsPanel from "./NotificationSettings.tsx";
import InventorySettingsPanel from "./InventorySettings.tsx";

type StatusTone = "success" | "error" | "";

type StatusState = {
  message: string;
  tone: StatusTone;
};

const defaultProfile: VendorSettingsProfile = {
  vendorName: "",
  shopName: "",
  phone: "",
  email: "",
  location: "",
  businessCategory: "",
  productFocus: "",
  shopDescription: "",
  avatarUrl: null,
  storeLogoUrl: null,
};

const defaultNotifications: NotificationSettings = {
  smsEnabled: true,
  emailEnabled: true,
  saleConfirmation: true,
  lowStockAlerts: true,
  dailySummary: true,
};

const defaultInventory: InventorySettings = {
  lowStockThreshold: 5,
  defaultUnit: "pieces",
};

const toCsv = (
  rows: Record<string, string | number | undefined>[],
  headers: { key: string; label: string }[]
) => {
  const escape = (value: string | number | undefined) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const lines = [headers.map((header) => escape(header.label)).join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((header) => escape(row[header.key])).join(","));
  });

  return lines.join("\n");
};

const downloadFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
};

export default function SettingsPage() {
  const useMocks = import.meta.env.VITE_USE_MOCKS === "true";
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState<VendorSettingsProfile>(defaultProfile);
  const [notificationForm, setNotificationForm] =
    useState<NotificationSettings>(defaultNotifications);
  const [inventoryForm, setInventoryForm] =
    useState<InventorySettings>(defaultInventory);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileStatus, setProfileStatus] = useState<StatusState>({
    message: "",
    tone: "",
  });
  const [notificationStatus, setNotificationStatus] = useState<StatusState>({
    message: "",
    tone: "",
  });
  const [inventoryStatus, setInventoryStatus] = useState<StatusState>({
    message: "",
    tone: "",
  });
  const [passwordStatus, setPasswordStatus] = useState<StatusState>({
    message: "",
    tone: "",
  });
  const [exportStatus, setExportStatus] = useState<StatusState>({
    message: "",
    tone: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [inventorySaving, setInventorySaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState("");
  const [logoStatus, setLogoStatus] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [pendingAvatarUrl, setPendingAvatarUrl] = useState<string | null | undefined>(
    undefined
  );
  const [pendingLogoUrl, setPendingLogoUrl] = useState<string | null | undefined>(
    undefined
  );
  const [initialProfile, setInitialProfile] = useState<VendorSettingsProfile>(
    defaultProfile
  );

  const loadSettings = async () => {
    if (useMocks) {
      setProfileForm({
        vendorName: "Ama Mensah",
        shopName: "Ama Fresh Produce",
        phone: "+233 24 000 0000",
        email: "ama@market.com",
        location: "Makola Market, Accra",
        businessCategory: "Fresh produce",
        productFocus: "Tomatoes, onions, peppers",
        shopDescription: "A family-run stall serving fresh market produce.",
        avatarUrl: null,
        storeLogoUrl: null,
      });
      setNotificationForm(defaultNotifications);
      setInventoryForm(defaultInventory);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const settings = await getSettings();
      setProfileForm({
        ...settings.profile,
        avatarUrl: resolveMediaUrl(settings.profile.avatarUrl),
        storeLogoUrl: resolveMediaUrl(settings.profile.storeLogoUrl),
      });
      setInitialProfile({
        ...settings.profile,
        avatarUrl: resolveMediaUrl(settings.profile.avatarUrl),
        storeLogoUrl: resolveMediaUrl(settings.profile.storeLogoUrl),
      });
      setPendingAvatarUrl(undefined);
      setPendingLogoUrl(undefined);
      setNotificationForm(settings.notifications);
      setInventoryForm(settings.inventory);
    } catch (error) {
      setProfileStatus({
        message: (error as Error).message || "Unable to load settings.",
        tone: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileStatus({ message: "", tone: "" });
    if (useMocks) {
      setProfileStatus({ message: "Profile saved locally.", tone: "success" });
      setInitialProfile(profileForm);
      setPendingAvatarUrl(undefined);
      setPendingLogoUrl(undefined);
      return;
    }
    try {
      setProfileSaving(true);
      const nextAvatarUrl =
        pendingAvatarUrl !== undefined ? pendingAvatarUrl : profileForm.avatarUrl;
      const nextLogoUrl =
        pendingLogoUrl !== undefined ? pendingLogoUrl : profileForm.storeLogoUrl;
      const payload: VendorSettingsProfile = {
        ...profileForm,
        avatarUrl: nextAvatarUrl ?? null,
        storeLogoUrl: nextLogoUrl ?? null,
      };
      const updated = await updateSettingsProfile(payload);
      const normalizedProfile = {
        ...updated,
        avatarUrl: resolveMediaUrl(updated.avatarUrl),
        storeLogoUrl: resolveMediaUrl(updated.storeLogoUrl),
      };
      setProfileForm(normalizedProfile);
      setInitialProfile(normalizedProfile);
      setPendingAvatarUrl(undefined);
      setPendingLogoUrl(undefined);
      setProfileStatus({
        message: "Profile updated successfully.",
        tone: "success",
      });
    } catch (error) {
      setProfileStatus({
        message: (error as Error).message || "Unable to update profile.",
        tone: "error",
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setAvatarStatus("");
    if (useMocks) {
      setAvatarStatus("Photo ready. Save to apply.");
      return;
    }
    try {
      setAvatarUploading(true);
      const result = await uploadAvatar(file);
  setPendingAvatarUrl(resolveMediaUrl(result.avatarUrl) ?? null);
      setAvatarStatus("Photo ready. Save to apply.");
    } catch (error) {
      setAvatarStatus(
        (error as Error).message || "Unable to upload profile photo."
      );
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    setLogoStatus("");
    if (useMocks) {
      setLogoStatus("Logo ready. Save to apply.");
      return;
    }
    try {
      setLogoUploading(true);
      const result = await uploadStoreLogo(file);
  setPendingLogoUrl(resolveMediaUrl(result.storeLogoUrl) ?? null);
      setLogoStatus("Logo ready. Save to apply.");
    } catch (error) {
      setLogoStatus(
        (error as Error).message || "Unable to upload store logo."
      );
    } finally {
      setLogoUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setPendingAvatarUrl(null);
    setAvatarStatus("Photo removed. Save to apply.");
  };

  const handleRemoveLogo = () => {
    setPendingLogoUrl(null);
    setLogoStatus("Logo removed. Save to apply.");
  };

  const effectiveAvatarUrl =
    pendingAvatarUrl !== undefined ? pendingAvatarUrl : profileForm.avatarUrl;
  const effectiveLogoUrl =
    pendingLogoUrl !== undefined ? pendingLogoUrl : profileForm.storeLogoUrl;
  const currentProfileSnapshot = {
    ...profileForm,
    avatarUrl: effectiveAvatarUrl ?? null,
    storeLogoUrl: effectiveLogoUrl ?? null,
  };
  const initialProfileSnapshot = {
    ...initialProfile,
    avatarUrl: initialProfile.avatarUrl ?? null,
    storeLogoUrl: initialProfile.storeLogoUrl ?? null,
  };
  const hasUnsavedChanges =
    JSON.stringify(currentProfileSnapshot) !==
    JSON.stringify(initialProfileSnapshot);

  const handleNotificationSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setNotificationStatus({ message: "", tone: "" });
    if (useMocks) {
      setNotificationStatus({
        message: "Notification preferences saved locally.",
        tone: "success",
      });
      return;
    }
    try {
      setNotificationSaving(true);
      const updated = await updateSettingsNotifications(notificationForm);
      setNotificationForm(updated);
      setNotificationStatus({
        message: "Notification settings updated.",
        tone: "success",
      });
    } catch (error) {
      setNotificationStatus({
        message: (error as Error).message || "Unable to update notifications.",
        tone: "error",
      });
    } finally {
      setNotificationSaving(false);
    }
  };

  const handleInventorySubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setInventoryStatus({ message: "", tone: "" });
    if (useMocks) {
      setInventoryStatus({
        message: "Inventory settings saved locally.",
        tone: "success",
      });
      return;
    }
    try {
      setInventorySaving(true);
      const updated = await updateSettingsInventory(inventoryForm);
      setInventoryForm(updated);
      setInventoryStatus({
        message: "Inventory settings updated.",
        tone: "success",
      });
    } catch (error) {
      setInventoryStatus({
        message: (error as Error).message || "Unable to update inventory settings.",
        tone: "error",
      });
    } finally {
      setInventorySaving(false);
    }
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setPasswordStatus({ message: "", tone: "" });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ message: "Passwords do not match.", tone: "error" });
      return;
    }
    if (useMocks) {
      setPasswordStatus({
        message: "Password updated locally.",
        tone: "success",
      });
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      return;
    }
    try {
      setPasswordSaving(true);
      const response = await updateSettingsPassword(passwordForm);
      setPasswordStatus({ message: response.message, tone: "success" });
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setPasswordStatus({
        message: (error as Error).message || "Unable to update password.",
        tone: "error",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleExport = async () => {
    setExportStatus({ message: "", tone: "" });
    if (useMocks) {
      setExportStatus({
        message: "Exports are available when connected to the live API.",
        tone: "error",
      });
      return;
    }
    try {
      setExporting(true);
      const [salesData, productData] = await Promise.all([
        getSales(),
        getProducts(),
      ]);
      const salesCsv = toCsv(
        salesData.sales.map((sale) => ({
          id: sale.id,
          productId: sale.productId,
          quantity: sale.quantity,
          unitPrice: sale.unitPrice,
          total: sale.total,
          soldAt: sale.soldAt,
        })),
        [
          { key: "id", label: "Sale ID" },
          { key: "productId", label: "Product ID" },
          { key: "quantity", label: "Quantity" },
          { key: "unitPrice", label: "Unit price" },
          { key: "total", label: "Total" },
          { key: "soldAt", label: "Sold at" },
        ]
      );
      const inventoryCsv = toCsv(
        productData.products.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          unit: product.unit,
          price: product.price,
          stock: product.stock,
          lowStockThreshold: product.lowStockThreshold,
        })),
        [
          { key: "id", label: "Product ID" },
          { key: "name", label: "Product name" },
          { key: "category", label: "Category" },
          { key: "unit", label: "Unit" },
          { key: "price", label: "Price" },
          { key: "stock", label: "Stock" },
          { key: "lowStockThreshold", label: "Low stock threshold" },
        ]
      );
      downloadFile("sales-export.csv", salesCsv);
      downloadFile("inventory-export.csv", inventoryCsv);
      setExportStatus({
        message: "Sales and inventory exports downloaded.",
        tone: "success",
      });
    } catch (error) {
      setExportStatus({
        message: (error as Error).message || "Unable to export data.",
        tone: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <section className="section">
        <div className="panel">
          <p>Loading settings...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section grid two settings-grid">
      <ProfileSettings
        values={profileForm}
        onChange={setProfileForm}
        onSubmit={handleProfileSubmit}
        statusMessage={profileStatus.message}
        statusTone={profileStatus.tone}
        isSaving={profileSaving}
        isSaveDisabled={!hasUnsavedChanges}
        hasUnsavedChanges={hasUnsavedChanges}
        onAvatarUpload={handleAvatarUpload}
        onLogoUpload={handleLogoUpload}
        onRemoveAvatar={handleRemoveAvatar}
        onRemoveLogo={handleRemoveLogo}
        avatarPendingLabel={
          pendingAvatarUrl !== undefined
            ? pendingAvatarUrl
              ? "Pending save"
              : "Pending removal"
            : ""
        }
        logoPendingLabel={
          pendingLogoUrl !== undefined
            ? pendingLogoUrl
              ? "Pending save"
              : "Pending removal"
            : ""
        }
        avatarStatus={avatarStatus}
        logoStatus={logoStatus}
        isAvatarUploading={avatarUploading}
        isLogoUploading={logoUploading}
        passwordValues={passwordForm}
        onPasswordChange={setPasswordForm}
        onPasswordSubmit={handlePasswordSubmit}
        passwordStatus={passwordStatus.message}
        passwordTone={passwordStatus.tone}
        isPasswordSaving={passwordSaving}
      />
      <ThemeSettings />
      <NotificationSettingsPanel
        values={notificationForm}
        onChange={setNotificationForm}
        onSubmit={handleNotificationSubmit}
        statusMessage={notificationStatus.message}
        statusTone={notificationStatus.tone}
        isSaving={notificationSaving}
      />
      <InventorySettingsPanel
        values={inventoryForm}
        onChange={setInventoryForm}
        onSubmit={handleInventorySubmit}
        statusMessage={inventoryStatus.message}
        statusTone={inventoryStatus.tone}
        isSaving={inventorySaving}
      />
      <div className="panel">
        <h3>Data & exports</h3>
        <p className="subtext">
          Download your sales and inventory data for reporting or backups.
        </p>
        {exportStatus.message && (
          <p className={`form-alert ${exportStatus.tone}`}>
            {exportStatus.message}
          </p>
        )}
        <button
          className="button solid"
          type="button"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? "Preparing export..." : "Export sales & inventory"}
        </button>
      </div>
    </section>
  );
}
