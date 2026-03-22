import express from "express";
import { authenticate } from "../auth.js";
import { getVendorById } from "../db/database.js";

const router = express.Router();

router.get("/me", authenticate, async (req, res) => {
  const vendor = await getVendorById(req.user.id);
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
