import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import {
  createVendor,
  findVendorByEmail,
  getVendorById,
} from "../db/database.js";
import { signToken } from "../auth.js";

const router = express.Router();

const emailRule = body("email")
  .isEmail()
  .withMessage("Invalid email")
  .normalizeEmail();

router.post(
  "/register",
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    emailRule,
    body("phone").notEmpty(),
    body("password").isLength({ min: 8 }),
    body("idType").isIn(["ghana", "voter"]),
    body("idNumber").notEmpty(),
    body("businessName").notEmpty(),
    body("location").notEmpty(),
    body("primaryProducts").notEmpty(),
    body("staffCount").isInt({ min: 1 }),
    body("productTypes").isArray({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existing = await findVendorByEmail(req.body.email);
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = bcrypt.hashSync(req.body.password, 10);
    const vendorId = await createVendor({
      firstName: req.body.firstName,
      middleName: req.body.middleName || null,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      passwordHash,
      idType: req.body.idType,
      idNumber: req.body.idNumber,
      businessName: req.body.businessName,
      location: req.body.location,
      primaryProducts: req.body.primaryProducts,
      staffCount: Number(req.body.staffCount),
      productTypes: JSON.stringify(req.body.productTypes),
      otherProductTypes: req.body.otherProductTypes || null,
      createdAt: new Date().toISOString(),
    });

  const vendor = await getVendorById(vendorId);
    const token = signToken(vendor);

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
  }
);

router.post("/login", [emailRule, body("password").notEmpty()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const vendor = await findVendorByEmail(req.body.email);
  if (!vendor || !bcrypt.compareSync(req.body.password, vendor.passwordHash)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(vendor);
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

router.post("/reset", [emailRule], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const vendor = await findVendorByEmail(req.body.email);
  if (!vendor) {
    return res.status(200).json({ message: "If the email exists, a reset link was sent." });
  }
  return res.json({ message: "Reset link sent (demo)." });
});

export default router;
