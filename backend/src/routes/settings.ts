import express, { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { authenticate } from "../middleware/auth/index.ts";
import {
  inventorySettingsValidators,
  notificationSettingsValidators,
  passwordSettingsValidators,
  profileSettingsValidators,
} from "../middleware/validators/settingsValidators.ts";
import {
  findVendorByEmail,
  getSettingsByVendorId,
  getVendorById,
  updateSettingsByVendorId,
  updateVendor,
  updateVendorPassword,
} from "../models/database.ts";
import type {
  InventorySettings,
  NotificationSettings,
} from "../types/settings.ts";

const router = express.Router();

router.get("/", authenticate, async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const [vendor, settings] = await Promise.all([
    getVendorById(vendorId),
    getSettingsByVendorId(vendorId),
  ]);

  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }

  return res.json({
    profile: {
      vendorName: `${vendor.firstName} ${vendor.lastName}`.trim(),
      shopName: vendor.businessName,
      phone: vendor.phone,
      email: vendor.email,
      location: vendor.location,
  businessCategory: vendor.businessCategory ?? "",
  productFocus: vendor.productFocus ?? "",
  shopDescription: vendor.shopDescription ?? "",
      avatarUrl: vendor.avatarUrl ?? null,
      storeLogoUrl: vendor.storeLogoUrl ?? null,
    },
    notifications: settings.notifications,
    inventory: settings.inventory,
  });
});

router.put(
  "/profile",
  authenticate,
  profileSettingsValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendorId = req.user?.id;
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const vendor = await getVendorById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const vendorName = req.body.vendorName as string | undefined;
    let firstName = vendor.firstName;
    let lastName = vendor.lastName;
    if (vendorName) {
      const parts = vendorName.trim().split(/\s+/).filter(Boolean);
      if (parts.length > 0) {
        firstName = parts.shift() ?? vendor.firstName;
        lastName = parts.join(" ") || vendor.lastName;
      }
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
      firstName: vendorName ? firstName : undefined,
      lastName: vendorName ? lastName : undefined,
      businessName: req.body.shopName as string | undefined,
      phone: req.body.phone as string | undefined,
      email: nextEmail,
      location: req.body.location as string | undefined,
      businessCategory: req.body.businessCategory as string | undefined,
      productFocus: req.body.productFocus as string | undefined,
      shopDescription: req.body.shopDescription as string | undefined,
    });

    if (!updated) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    return res.json({
      vendorName: `${updated.firstName} ${updated.lastName}`.trim(),
      shopName: updated.businessName,
      phone: updated.phone,
      email: updated.email,
      location: updated.location,
  businessCategory: updated.businessCategory ?? "",
  productFocus: updated.productFocus ?? "",
  shopDescription: updated.shopDescription ?? "",
      avatarUrl: updated.avatarUrl ?? null,
      storeLogoUrl: updated.storeLogoUrl ?? null,
    });
  }
);

router.put(
  "/notifications",
  authenticate,
  notificationSettingsValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendorId = req.user?.id;
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existing = await getSettingsByVendorId(vendorId);
    const payload: NotificationSettings = {
      smsEnabled:
        req.body.smsEnabled !== undefined
          ? Boolean(req.body.smsEnabled)
          : existing.notifications.smsEnabled,
      emailEnabled:
        req.body.emailEnabled !== undefined
          ? Boolean(req.body.emailEnabled)
          : existing.notifications.emailEnabled,
      saleConfirmation:
        req.body.saleConfirmation !== undefined
          ? Boolean(req.body.saleConfirmation)
          : existing.notifications.saleConfirmation,
      lowStockAlerts:
        req.body.lowStockAlerts !== undefined
          ? Boolean(req.body.lowStockAlerts)
          : existing.notifications.lowStockAlerts,
      dailySummary:
        req.body.dailySummary !== undefined
          ? Boolean(req.body.dailySummary)
          : existing.notifications.dailySummary,
    };

    const updated = await updateSettingsByVendorId(vendorId, {
      notifications: payload,
    });

    return res.json(updated.notifications);
  }
);

router.put(
  "/inventory",
  authenticate,
  inventorySettingsValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendorId = req.user?.id;
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existing = await getSettingsByVendorId(vendorId);
    const payload: InventorySettings = {
      lowStockThreshold:
        req.body.lowStockThreshold !== undefined
          ? Number(req.body.lowStockThreshold)
          : existing.inventory.lowStockThreshold,
      defaultUnit:
        req.body.defaultUnit !== undefined
          ? String(req.body.defaultUnit)
          : existing.inventory.defaultUnit,
    };

    const updated = await updateSettingsByVendorId(vendorId, {
      inventory: payload,
    });

    return res.json(updated.inventory);
  }
);

router.put(
  "/password",
  authenticate,
  passwordSettingsValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendorId = req.user?.id;
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const vendor = await getVendorById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const isValid = bcrypt.compareSync(
      req.body.oldPassword as string,
      vendor.passwordHash
    );

    if (!isValid) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const passwordHash = bcrypt.hashSync(req.body.newPassword as string, 10);
    await updateVendorPassword(vendorId, passwordHash);

    return res.json({ message: "Password updated successfully." });
  }
);

export default router;
