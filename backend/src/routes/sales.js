import express from "express";
import { body, validationResult } from "express-validator";
import { authenticate } from "../auth.js";
import {
  createSale,
  listSales,
  updateProductStock,
} from "../db/database.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  return res.json({ sales: await listSales(req.user.id) });
});

router.post(
  "/",
  authenticate,
  [
    body("productId").notEmpty(),
    body("quantity").isFloat({ min: 0.01 }),
    body("unitPrice").isFloat({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const quantity = Number(req.body.quantity);
    const unitPrice = Number(req.body.unitPrice);
    const total = quantity * unitPrice;

    const sale = await createSale(req.user.id, {
      productId: req.body.productId,
      quantity,
      unitPrice,
      total,
      soldAt: new Date().toISOString(),
    });

    await updateProductStock(req.user.id, req.body.productId, -quantity);

    return res.status(201).json({ id: sale.id });
  }
);

export default router;
