import express, { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import { authenticate } from "../middleware/auth/index.ts";
import {
  createSale,
  getVendorById,
  listSales,
  updateProductStock,
} from "../models/database.ts";
import { createSaleValidators } from "../middleware/validators/salesValidators.ts";
import { notifyLowStock } from "../services/notificationService.ts";

const router = express.Router();

router.get("/", authenticate, async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.json({ sales: await listSales(vendorId) });
});

router.post(
  "/",
  authenticate,
  createSaleValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendorId = req.user?.id;
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const quantity = Number(req.body.quantity);
    const unitPrice = Number(req.body.unitPrice);
    const total = quantity * unitPrice;

    const sale = await createSale(vendorId, {
      productId: req.body.productId as string,
      quantity,
      unitPrice,
      total,
      soldAt: new Date().toISOString(),
    });

    const updatedProduct = await updateProductStock(
      vendorId,
      req.body.productId as string,
      -quantity
    );
    if (
      updatedProduct &&
      updatedProduct.stock <= updatedProduct.lowStockThreshold
    ) {
      const vendor = await getVendorById(vendorId);
      if (vendor) {
        await notifyLowStock(vendor, updatedProduct);
      }
    }

    return res.status(201).json({ id: sale.id });
  }
);

export default router;
