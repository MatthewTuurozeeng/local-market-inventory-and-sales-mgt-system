import express from "express";
import { body, param, validationResult } from "express-validator";
import { authenticate } from "../auth.js";
import {
  createProduct,
  listProducts,
  updateProductStock,
} from "../db/database.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  return res.json({ products: await listProducts(req.user.id) });
});

router.post(
  "/",
  authenticate,
  [
    body("name").notEmpty(),
    body("category").notEmpty(),
    body("unit").notEmpty(),
    body("price").isFloat({ min: 0 }),
    body("stock").isFloat({ min: 0 }),
    body("lowStockThreshold").optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await createProduct(req.user.id, {
      name: req.body.name,
      category: req.body.category,
      unit: req.body.unit,
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
  [param("id").notEmpty(), body("delta").isFloat()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await updateProductStock(req.user.id, req.params.id, Number(req.body.delta));
    return res.json({ message: "Stock updated" });
  }
);

export default router;
