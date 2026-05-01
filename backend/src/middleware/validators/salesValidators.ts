import { body } from "express-validator";

// the createSaleValidators array defines a set of validation rules for the sale creation endpoint.
const createSaleValidators = [
  body("productId").notEmpty(),
  body("quantity").isFloat({ min: 0.01 }),
  body("unitPrice").isFloat({ min: 0 }),
];

export { createSaleValidators };
