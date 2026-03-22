import express, { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import { authenticate } from "../middleware/auth/index.ts";
import {
  createProduct,
  listProducts,
  updateProductStock,
} from "../models/database.ts";
import {
  createProductValidators,
  updateStockValidators,
} from "../middleware/validators/productValidators.ts";

const router = express.Router();

router.get("/", authenticate, async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.json({ products: await listProducts(vendorId) });
});

router.post(
  "/",
  authenticate,
  createProductValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendorId = req.user?.id;
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const product = await createProduct(vendorId, {
      name: req.body.name as string,
      category: req.body.category as string,
      unit: req.body.unit as string,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      lowStockThreshold:
        req.body.lowStockThreshold !== undefined
          ? Number(req.body.lowStockThreshold)
          : 5,
    });

    return res.status(201).json({ id: product.id });
  }
);

router.patch(
  "/:id/stock",
  authenticate,
  updateStockValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendorId = req.user?.id;
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await updateProductStock(vendorId, req.params.id, Number(req.body.delta));
    return res.json({ message: "Stock updated" });
  }
);

export default router;
