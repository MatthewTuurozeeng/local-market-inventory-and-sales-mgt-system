import mongoose, { type Document, Schema } from "mongoose";
import type {
  InventorySettings,
  NotificationSettings,
} from "../types/settings.ts";

export interface VendorInput {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  phone: string;
  passwordHash: string;
  avatarUrl?: string | null;
  storeLogoUrl?: string | null;
  resetToken?: string | null;
  resetTokenExpires?: string | null;
  idType: string;
  idNumber: string;
  businessName: string;
  location: string;
  businessCategory?: string | null;
  productFocus?: string | null;
  shopDescription?: string | null;
  primaryProducts: string;
  staffCount: number;
  productTypes: string[] | string;
  otherProductTypes?: string | null;
  createdAt: string;
}

export interface VendorRecord extends VendorInput {
  id: string;
}

export interface VendorUpdateInput {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string | null;
  storeLogoUrl?: string | null;
  idType?: string;
  idNumber?: string;
  businessName?: string;
  location?: string;
  businessCategory?: string | null;
  productFocus?: string | null;
  shopDescription?: string | null;
  primaryProducts?: string;
  staffCount?: number;
  productTypes?: string[];
  otherProductTypes?: string | null;
}

export interface ProductInput {
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  createdAt?: string;
}

export interface ProductRecord extends ProductInput {
  id: string;
  vendorId: string;
}

export interface SaleInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  soldAt: string;
}

export interface SaleRecord extends SaleInput {
  id: string;
  vendorId: string;
}

export interface SalesSummary {
  revenue: number;
  units: number;
  salesCount: number;
}

export interface SalesReportRow {
  quantity: number;
  unitPrice: number;
  total: number;
  soldAt: string;
  productName: string;
  productCategory: string;
}

export interface SettingsInput {
  vendorId: string;
  notifications: NotificationSettings;
  inventory: InventorySettings;
}

export interface SettingsRecord extends SettingsInput {
  id: string;
}

export interface PublicStatsSummary {
  totalVendors: number;
  totalSales: number;
  totalUnits: number;
  totalTransactions: number;
  todayRevenue: number;
  topVendorRevenueToday: number;
}

interface VendorDocument extends VendorInput, Document {
  _id: mongoose.Types.ObjectId;
}

interface ProductDocument extends Omit<ProductInput, "createdAt">, Document {
  _id: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  createdAt: string;
}

interface SaleDocument extends Omit<SaleInput, "productId">, Document {
  _id: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
}

interface SettingsDocument extends Document {
  _id: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  notifications: NotificationSettings;
  inventory: InventorySettings;
}

const VendorSchema = new Schema<VendorDocument>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String },
  storeLogoUrl: { type: String },
  resetToken: { type: String },
  resetTokenExpires: { type: String },
  idType: { type: String, required: true },
  idNumber: { type: String, required: true },
  businessName: { type: String, required: true },
  location: { type: String, required: true },
  businessCategory: { type: String },
  productFocus: { type: String },
  shopDescription: { type: String },
  primaryProducts: { type: String, required: true },
  staffCount: { type: Number, required: true },
  productTypes: { type: [String], required: true },
  otherProductTypes: { type: String },
  createdAt: { type: String, required: true },
});

const ProductSchema = new Schema<ProductDocument>({
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  lowStockThreshold: { type: Number, required: true },
  createdAt: { type: String, required: true },
});

const SaleSchema = new Schema<SaleDocument>({
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
  soldAt: { type: String, required: true },
});

const SettingsSchema = new Schema<SettingsDocument>({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
    unique: true,
  },
  notifications: {
    smsEnabled: { type: Boolean, default: true },
    emailEnabled: { type: Boolean, default: true },
    saleConfirmation: { type: Boolean, default: true },
    lowStockAlerts: { type: Boolean, default: true },
    dailySummary: { type: Boolean, default: true },
  },
  inventory: {
    lowStockThreshold: { type: Number, default: 5 },
    defaultUnit: { type: String, default: "pieces" },
  },
});

const Vendor = mongoose.model<VendorDocument>("Vendor", VendorSchema);
const Product = mongoose.model<ProductDocument>("Product", ProductSchema);
const Sale = mongoose.model<SaleDocument>("Sale", SaleSchema);
const Settings = mongoose.model<SettingsDocument>("Settings", SettingsSchema);

const normalizeVendor = (vendor: VendorDocument | null): VendorRecord | null =>
  vendor ? { ...(vendor.toObject() as VendorInput), id: vendor._id.toString() } : null;

const normalizeProduct = (product: ProductDocument | null): ProductRecord | null =>
  product
    ? {
        ...(product.toObject() as ProductInput),
        id: product._id.toString(),
        vendorId: product.vendorId.toString(),
      }
    : null;

const normalizeSale = (sale: SaleDocument | null): SaleRecord | null =>
  sale
    ? {
        ...(sale.toObject() as SaleInput),
        id: sale._id.toString(),
        vendorId: sale.vendorId.toString(),
      }
    : null;

const normalizeSettings = (
  settings: SettingsDocument | null
): SettingsRecord | null =>
  settings
    ? {
        vendorId: settings.vendorId.toString(),
        notifications: settings.notifications,
        inventory: settings.inventory,
        id: settings._id.toString(),
      }
    : null;

const createVendor = async (payload: VendorInput): Promise<string> => {
  const vendor = await Vendor.create(payload);
  return vendor._id.toString();
};

const findVendorByEmail = async (email: string): Promise<VendorRecord | null> => {
  const normalizedEmail = email.trim().toLowerCase();
  const vendor = await Vendor.findOne({ email: normalizedEmail });
  return normalizeVendor(vendor);
};

const setVendorResetToken = async (
  email: string,
  token: string,
  expiresAt: string
): Promise<void> => {
  await Vendor.updateOne(
    { email },
    { resetToken: token, resetTokenExpires: expiresAt }
  );
};

const findVendorByResetToken = async (
  token: string
): Promise<VendorRecord | null> => {
  const vendor = await Vendor.findOne({ resetToken: token });
  return normalizeVendor(vendor);
};

const updateVendorPassword = async (
  vendorId: string,
  passwordHash: string
): Promise<void> => {
  await Vendor.updateOne(
    { _id: vendorId },
    { passwordHash, resetToken: null, resetTokenExpires: null }
  );
};

const getVendorById = async (id: string): Promise<VendorRecord | null> => {
  const vendor = await Vendor.findById(id);
  return normalizeVendor(vendor);
};

const updateVendor = async (
  vendorId: string,
  updates: VendorUpdateInput
): Promise<VendorRecord | null> => {
  const payload = { ...updates } as VendorUpdateInput;
  if (payload.email) {
    payload.email = payload.email.trim().toLowerCase();
  }
  const entries = Object.entries(payload).filter(([, value]) => value !== undefined);
  if (entries.length === 0) {
    return getVendorById(vendorId);
  }
  await Vendor.updateOne(
    { _id: vendorId },
    { $set: Object.fromEntries(entries) }
  );
  return getVendorById(vendorId);
};

const getSettingsByVendorId = async (
  vendorId: string
): Promise<SettingsRecord> => {
  const existing = await Settings.findOne({ vendorId });
  if (existing) {
    return normalizeSettings(existing) as SettingsRecord;
  }
  const created = await Settings.create({ vendorId });
  return normalizeSettings(created) as SettingsRecord;
};

const updateSettingsByVendorId = async (
  vendorId: string,
  updates: Partial<SettingsInput>
): Promise<SettingsRecord> => {
  const updated = await Settings.findOneAndUpdate(
    { vendorId },
    { $set: updates },
    { new: true, upsert: true }
  );
  return normalizeSettings(updated) as SettingsRecord;
};

const listProducts = async (vendorId: string): Promise<ProductRecord[]> => {
  const products = await Product.find({ vendorId }).sort({ createdAt: -1 });
  return products
    .map((product) => normalizeProduct(product))
    .filter((product): product is ProductRecord => Boolean(product));
};

const createProduct = async (
  vendorId: string,
  data: ProductInput
): Promise<ProductRecord> => {
  const product = await Product.create({
    vendorId,
    createdAt: new Date().toISOString(),
    ...data,
  });
  return normalizeProduct(product) as ProductRecord;
};

const updateProductStock = async (
  vendorId: string,
  productId: string,
  delta: number
): Promise<ProductRecord | null> => {
  const product = await Product.findOne({ _id: productId, vendorId });
  if (!product) {
    return null;
  }
  const nextStock = Math.max(0, Number(product.stock) + Number(delta));
  product.stock = Number(nextStock.toFixed(2));
  await product.save();
  return normalizeProduct(product) as ProductRecord;
};

const createSale = async (
  vendorId: string,
  data: SaleInput
): Promise<SaleRecord> => {
  const sale = await Sale.create({
    vendorId,
    ...data,
  });
  return normalizeSale(sale) as SaleRecord;
};

const listSales = async (vendorId: string): Promise<SaleRecord[]> => {
  const sales = await Sale.find({ vendorId }).sort({ soldAt: -1 });
  return sales
    .map((sale) => normalizeSale(sale))
    .filter((sale): sale is SaleRecord => Boolean(sale));
};

const getSalesSummary = async (vendorId: string): Promise<SalesSummary> => {
  const summary = await Sale.aggregate([
    { $match: { vendorId: new mongoose.Types.ObjectId(vendorId) } },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$total" },
        units: { $sum: "$quantity" },
        salesCount: { $sum: 1 },
      },
    },
  ]);
  return summary[0] || { revenue: 0, units: 0, salesCount: 0 };
};

const listVendorMediaUrls = async (): Promise<string[]> => {
  const vendors = await Vendor.find({}, { avatarUrl: 1, storeLogoUrl: 1 })
    .lean()
    .exec();
  const urls: string[] = [];
  vendors.forEach((vendor) => {
    if (vendor.avatarUrl) {
      urls.push(String(vendor.avatarUrl));
    }
    if (vendor.storeLogoUrl) {
      urls.push(String(vendor.storeLogoUrl));
    }
  });
  return urls;
};

const getPublicStatsSummary = async (): Promise<PublicStatsSummary> => {
  const [totalVendors, totals] = await Promise.all([
    Vendor.countDocuments(),
    Sale.aggregate<SalesSummary>([
      {
        $group: {
          _id: null,
          revenue: { $sum: "$total" },
          units: { $sum: "$quantity" },
          salesCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const summary = totals[0] || { revenue: 0, units: 0, salesCount: 0 };
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();

  const [todaySummary, topVendor] = await Promise.all([
    Sale.aggregate([
      { $match: { soldAt: { $gte: todayIso } } },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$total" },
        },
      },
    ]),
    Sale.aggregate([
      { $match: { soldAt: { $gte: todayIso } } },
      {
        $group: {
          _id: "$vendorId",
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 1 },
    ]),
  ]);

  return {
    totalVendors,
    totalSales: summary.revenue ?? 0,
    totalUnits: summary.units ?? 0,
    totalTransactions: summary.salesCount ?? 0,
    todayRevenue: todaySummary[0]?.revenue ?? 0,
    topVendorRevenueToday: topVendor[0]?.revenue ?? 0,
  };
};

const listSalesByDateRange = async (
  vendorId: string,
  startDate: string | null,
  endDate: string | null
): Promise<SalesReportRow[]> => {
  const match: Record<string, unknown> = {
    vendorId: new mongoose.Types.ObjectId(vendorId),
  };
  if (startDate || endDate) {
    match.soldAt = {};
    if (startDate) {
      (match.soldAt as Record<string, string>).$gte = startDate;
    }
    if (endDate) {
      (match.soldAt as Record<string, string>).$lte = endDate;
    }
  }

  const rows = await Sale.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        quantity: 1,
        unitPrice: 1,
        total: 1,
        soldAt: 1,
        productName: "$product.name",
        productCategory: "$product.category",
      },
    },
    { $sort: { soldAt: -1 } },
  ]);

  return rows.map((row: SalesReportRow) => ({
    quantity: row.quantity,
    unitPrice: row.unitPrice,
    total: row.total,
    soldAt: row.soldAt,
    productName: row.productName || "Unknown",
    productCategory: row.productCategory || "",
  }));
};

export {
  createVendor,
  findVendorByEmail,
  setVendorResetToken,
  findVendorByResetToken,
  updateVendorPassword,
  getVendorById,
  updateVendor,
  getSettingsByVendorId,
  updateSettingsByVendorId,
  listProducts,
  createProduct,
  updateProductStock,
  createSale,
  listSales,
  listSalesByDateRange,
  getSalesSummary,
  getPublicStatsSummary,
  listVendorMediaUrls,
};
