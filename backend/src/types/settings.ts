export interface NotificationSettings {
  smsEnabled: boolean;
  emailEnabled: boolean;
  saleConfirmation: boolean;
  lowStockAlerts: boolean;
  dailySummary: boolean;
}

export interface InventorySettings {
  lowStockThreshold: number;
  defaultUnit: string;
}

export interface VendorSettings {
  notifications: NotificationSettings;
  inventory: InventorySettings;
}
