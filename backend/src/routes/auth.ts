import express, { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import {
  createVendor,
  findVendorByEmail,
  findVendorByResetToken,
  getVendorById,
  setVendorResetToken,
  updateVendorPassword,
} from "../models/database.ts";
import { signToken } from "../middleware/auth/index.ts";
import {
  loginValidators,
  registerValidators,
  resetConfirmValidators,
  resetValidators,
} from "../middleware/validators/authValidators.ts";

const router = express.Router();

router.post("/register", registerValidators, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const existing = await findVendorByEmail(req.body.email as string);
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = bcrypt.hashSync(req.body.password as string, 10);
  const vendorId = await createVendor({
    firstName: req.body.firstName as string,
    middleName: (req.body.middleName as string) || null,
    lastName: req.body.lastName as string,
    email: req.body.email as string,
    phone: req.body.phone as string,
    passwordHash,
    idType: req.body.idType as string,
    idNumber: req.body.idNumber as string,
    businessName: req.body.businessName as string,
    location: req.body.location as string,
    primaryProducts: req.body.primaryProducts as string,
    staffCount: Number(req.body.staffCount),
    productTypes: JSON.stringify(req.body.productTypes),
    otherProductTypes: (req.body.otherProductTypes as string) || null,
    createdAt: new Date().toISOString(),
  });

  const vendor = await getVendorById(vendorId);
  if (!vendor) {
    return res.status(500).json({ message: "Vendor creation failed" });
  }

  const token = signToken({
    id: vendor.id,
    email: vendor.email,
    businessName: vendor.businessName,
  });

  return res.status(201).json({
    token,
    vendor: {
      id: vendor.id,
      firstName: vendor.firstName,
      lastName: vendor.lastName,
      email: vendor.email,
      businessName: vendor.businessName,
    },
  });
});

router.post("/login", loginValidators, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const vendor = await findVendorByEmail(req.body.email as string);
  if (!vendor || !bcrypt.compareSync(req.body.password as string, vendor.passwordHash)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({
    id: vendor.id,
    email: vendor.email,
    businessName: vendor.businessName,
  });
  return res.json({
    token,
    vendor: {
      id: vendor.id,
      firstName: vendor.firstName,
      lastName: vendor.lastName,
      email: vendor.email,
      businessName: vendor.businessName,
    },
  });
});

router.post("/reset", resetValidators, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const vendor = await findVendorByEmail(req.body.email as string);
  if (!vendor) {
    return res.status(200).json({ message: "If the email exists, a reset link was sent." });
  }
  const resetToken = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();
  await setVendorResetToken(req.body.email as string, resetToken, expiresAt);
  return res.json({
    message: "Reset link sent (demo).",
    resetToken,
    expiresAt,
  });
});

router.post(
  "/reset/confirm",
  resetConfirmValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendor = await findVendorByResetToken(req.body.token as string);
    if (!vendor || !vendor.resetTokenExpires) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    if (new Date(vendor.resetTokenExpires) < new Date()) {
      return res.status(400).json({ message: "Reset token has expired." });
    }

    const passwordHash = bcrypt.hashSync(req.body.password as string, 10);
    await updateVendorPassword(vendor.id, passwordHash);
    return res.json({ message: "Password reset successful." });
  }
);

export default router;
