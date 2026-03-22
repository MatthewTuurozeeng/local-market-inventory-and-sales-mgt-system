import mongoose from "mongoose";

const { Schema } = mongoose;

const VendorSchema = new Schema({
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

const ProductSchema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  lowStockThreshold: { type: Number, required: true },
  createdAt: { type: String, required: true },
});

const SaleSchema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
  soldAt: { type: String, required: true },
});

const Vendor = mongoose.model("Vendor", VendorSchema);
const Product = mongoose.model("Product", ProductSchema);
const Sale = mongoose.model("Sale", SaleSchema);

const normalizeVendor = (vendor) =>
  vendor ? { ...vendor.toObject(), id: vendor._id.toString() } : null;

const normalizeProduct = (product) =>
  product ? { ...product.toObject(), id: product._id.toString() } : null;

const normalizeSale = (sale) =>
  sale ? { ...sale.toObject(), id: sale._id.toString() } : null;

const createVendor = async (payload) => {
  const vendor = await Vendor.create(payload);
  return vendor._id.toString();
};

const findVendorByEmail = async (email) => {
  const vendor = await Vendor.findOne({ email });
  return normalizeVendor(vendor);
};

const getVendorById = async (id) => {
  const vendor = await Vendor.findById(id);
  return normalizeVendor(vendor);
};

const listProducts = async (vendorId) => {
  const products = await Product.find({ vendorId }).sort({ createdAt: -1 });
  return products.map(normalizeProduct);
};

const createProduct = async (vendorId, data) => {
  const product = await Product.create({
    vendorId,
    createdAt: new Date().toISOString(),
    ...data,
  });
  return normalizeProduct(product);
};

const updateProductStock = async (vendorId, productId, delta) => {
  const product = await Product.findOne({ _id: productId, vendorId });
  if (!product) {
    return;
  }
  const nextStock = Math.max(0, Number(product.stock) + Number(delta));
  product.stock = Number(nextStock.toFixed(2));
  await product.save();
};

const createSale = async (vendorId, data) => {
  const sale = await Sale.create({
    vendorId,
    ...data,
  });
  return normalizeSale(sale);
};

const listSales = async (vendorId) => {
  const sales = await Sale.find({ vendorId }).sort({ soldAt: -1 });
  return sales.map(normalizeSale);
};

const getSalesSummary = async (vendorId) => {
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

export {
  createVendor,
  findVendorByEmail,
  getVendorById,
  listProducts,
  createProduct,
  updateProductStock,
  createSale,
  listSales,
  getSalesSummary,
};
