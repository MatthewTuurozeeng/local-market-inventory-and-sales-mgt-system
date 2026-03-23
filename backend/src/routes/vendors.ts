import express, { type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import { validationResult } from "express-validator";
import { authenticate } from "../middleware/auth/index.ts";
import { updateProfileValidators } from "../middleware/validators/vendorValidators.ts";
import { findVendorByEmail, getVendorById, updateVendor } from "../models/database.ts";

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
    phone: vendor.phone,
  businessName: vendor.businessName,
  avatarUrl: vendor.avatarUrl,
    storeLogoUrl: vendor.storeLogoUrl,
    location: vendor.location,
  businessCategory: vendor.businessCategory,
  productFocus: vendor.productFocus,
  shopDescription: vendor.shopDescription,
    primaryProducts: vendor.primaryProducts,
    staffCount: vendor.staffCount,
    productTypes: vendor.productTypes || [],
    otherProductTypes: vendor.otherProductTypes,
  });
});

router.patch(
  "/me",
  authenticate,
  updateProfileValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendorId = req.user?.id;
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const nextEmail = req.body.email
      ? String(req.body.email).trim().toLowerCase()
      : undefined;
    if (nextEmail) {
      const existing = await findVendorByEmail(nextEmail);
      if (existing && existing.id !== vendorId) {
        return res.status(409).json({ message: "Email already registered" });
      }
    }

    const updated = await updateVendor(vendorId, {
      firstName: req.body.firstName as string | undefined,
      middleName: req.body.middleName as string | undefined,
      lastName: req.body.lastName as string | undefined,
      email: nextEmail,
      phone: req.body.phone as string | undefined,
      businessName: req.body.businessName as string | undefined,
      location: req.body.location as string | undefined,
      primaryProducts: req.body.primaryProducts as string | undefined,
      staffCount:
        req.body.staffCount !== undefined
          ? Number(req.body.staffCount)
          : undefined,
      productTypes: req.body.productTypes as string[] | undefined,
      otherProductTypes: req.body.otherProductTypes as string | undefined,
    });

    if (!updated) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    return res.json({
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      phone: updated.phone,
    businessName: updated.businessName,
    avatarUrl: updated.avatarUrl,
      storeLogoUrl: updated.storeLogoUrl,
      location: updated.location,
  businessCategory: updated.businessCategory,
  productFocus: updated.productFocus,
  shopDescription: updated.shopDescription,
      primaryProducts: updated.primaryProducts,
      staffCount: updated.staffCount,
      productTypes: updated.productTypes || [],
      otherProductTypes: updated.otherProductTypes,
    });
  }
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "..", "uploads");

const storage = multer.diskStorage({
  destination: async (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".png";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".png";
    cb(null, `avatar-${Date.now()}${safeExt}`);
  },
});

const logoStorage = multer.diskStorage({
  destination: async (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".png";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".png";
    cb(null, `logo-${Date.now()}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed."));
      return;
    }
    cb(null, true);
  },
});

const logoUpload = multer({
  storage: logoStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed."));
      return;
    }
    cb(null, true);
  },
});

router.post(
  "/me/avatar",
  authenticate,
  upload.single("avatar"),
  async (req: Request, res: Response) => {
    const vendorId = req.user?.id;
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Avatar file is required." });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const updated = await updateVendor(vendorId, { avatarUrl });
    if (!updated) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    return res.json({ avatarUrl });
  }
);

router.post(
  "/me/logo",
  authenticate,
  logoUpload.single("logo"),
  async (req: Request, res: Response) => {
    const vendorId = req.user?.id;
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Logo file is required." });
    }

    const storeLogoUrl = `/uploads/${req.file.filename}`;
    const updated = await updateVendor(vendorId, { storeLogoUrl });
    if (!updated) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    return res.json({ storeLogoUrl });
  }
);

export default router;
