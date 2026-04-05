import dotenv from "dotenv";
import mongoose, { type Document } from "mongoose";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

// Load env from backend/.env if present
const envPath = join(dirname(fileURLToPath(import.meta.url)), "..", ".env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/local-market";

interface VendorDocument extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  passwordHash: string;
  idType: string;
  idNumber: string;
  businessName: string;
  location: string;
  primaryProducts: string;
  staffCount: number;
  productTypes: string[];
  otherProductTypes?: string;
  createdAt: string;
}

interface ProductDocument extends Document {
  vendorId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  createdAt: string;
}

interface SaleDocument extends Document {
  vendorId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  total: number;
  soldAt: string;
}

const { Schema } = mongoose;

const VendorSchema = new Schema<VendorDocument>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  idType: { type: String, required: true },
  idNumber: { type: String, required: true },
  businessName: { type: String, required: true },
  location: { type: String, required: true },
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

const Vendor = mongoose.model<VendorDocument>("Vendor", VendorSchema);
const Product = mongoose.model<ProductDocument>("Product", ProductSchema);
const Sale = mongoose.model<SaleDocument>("Sale", SaleSchema);

const seed = async () => {
  await mongoose.connect(MONGODB_URI);

  await Sale.deleteMany({});
  await Product.deleteMany({});
  await Vendor.deleteMany({ email: "vendor@market.com" });

  const passwordHash = bcrypt.hashSync("Test@1234", 10);

  const vendor = await Vendor.create({
    firstName: "Ama",
    middleName: "Kofi",
    lastName: "Mensah",
    email: "vendor@market.com",
    phone: "0240000000",
    passwordHash,
    idType: "ghana",
    idNumber: "GHA-123456789-0",
    businessName: "Ama Fresh Produce",
    location: "Makola Market, Accra",
    primaryProducts: "Tomatoes, onions, peppers",
    staffCount: 3,
    productTypes: ["Fresh produce", "Spices & condiments"],
    otherProductTypes: "Citrus",
    createdAt: new Date().toISOString(),
  });

  const products = await Product.create([
    {
      vendorId: vendor._id,
      name: "Tomatoes",
      category: "Fresh produce",
      unit: "crate",
      price: 180,
      stock: 12,
      lowStockThreshold: 5,
      createdAt: new Date().toISOString(),
    },
    {
      vendorId: vendor._id,
      name: "Red onions",
      category: "Fresh produce",
      unit: "bag",
      price: 95,
      stock: 4,
      lowStockThreshold: 6,
      createdAt: new Date().toISOString(),
    },
    {
      vendorId: vendor._id,
      name: "Chili peppers",
      category: "Spices & condiments",
      unit: "kg",
      price: 32,
      stock: 18,
      lowStockThreshold: 8,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [tomatoes, onions, peppers] = products;
  const now = Date.now();

  await Sale.create([
    {
      vendorId: vendor._id,
      productId: tomatoes._id,
      quantity: 2,
      unitPrice: 180,
      total: 360,
      soldAt: new Date(now).toISOString(),
    },
    {
      vendorId: vendor._id,
      productId: onions._id,
      quantity: 1,
      unitPrice: 95,
      total: 95,
      soldAt: new Date(now - 86400000).toISOString(),
    },
    {
      vendorId: vendor._id,
      productId: peppers._id,
      quantity: 6,
      unitPrice: 32,
      total: 192,
      soldAt: new Date(now - 2 * 86400000).toISOString(),
    },
  ]);

  // eslint-disable-next-line no-console
  console.log("Seed complete. Login: vendor@market.com / Test@1234");
  await mongoose.disconnect();
};

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Seed failed", error);
  process.exit(1);
});
