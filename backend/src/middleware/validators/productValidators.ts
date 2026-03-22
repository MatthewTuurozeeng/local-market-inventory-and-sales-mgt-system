import { body, param } from "express-validator";

const createProductValidators = [
  body("name").notEmpty(),
  body("category").notEmpty(),
  body("unit").notEmpty(),
  body("price").isFloat({ min: 0 }),
  body("stock").isFloat({ min: 0 }),
  body("lowStockThreshold").optional().isInt({ min: 0 }),
];

const updateStockValidators = [param("id").notEmpty(), body("delta").isFloat()];

export { createProductValidators, updateStockValidators };
