export interface NotificationSettings {
  smsEnabled: boolean;
  emailEnabled: boolean;
  saleConfirmation: boolean;
  lowStockAlerts: boolean;
  dailySummary: boolean;
}

export interface InventorySettings { // the InventorySettings interface defines the structure of the inventory settings for a vendor. It includes a low stock threshold, which determines when low stock alerts should be triggered, and a default unit of measurement for products.
  lowStockThreshold: number;
  defaultUnit: string;
}

export interface VendorSettings {
  notifications: NotificationSettings;
  inventory: InventorySettings;
}
