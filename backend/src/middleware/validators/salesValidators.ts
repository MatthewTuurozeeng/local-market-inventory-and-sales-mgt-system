import { body } from "express-validator";

const createSaleValidators = [
  body("productId").notEmpty(),
  body("quantity").isFloat({ min: 0.01 }),
  body("unitPrice").isFloat({ min: 0 }),
];

export { createSaleValidators };
