import express, { type Request, type Response } from "express";
import { authenticate } from "../middleware/auth/index.ts";
import { getVendorById } from "../models/database.ts";

const router = express.Router();

router.get("/me", authenticate, async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const vendor = await getVendorById(vendorId);
  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }
  return res.json({
    id: vendor.id,
    firstName: vendor.firstName,
    lastName: vendor.lastName,
    email: vendor.email,
    businessName: vendor.businessName,
    location: vendor.location,
    primaryProducts: vendor.primaryProducts,
    staffCount: vendor.staffCount,
    productTypes: vendor.productTypes || [],
    otherProductTypes: vendor.otherProductTypes,
  });
});

export default router;
