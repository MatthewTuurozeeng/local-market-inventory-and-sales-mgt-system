import { body, param } from "express-validator";

// the createProductValidators array defines a set of validation rules for the product creation endpoint. 
// it checks that the name, category, and unit fields are not empty, and that the price and stock fields are valid floating-point numbers greater than or equal to 0. 
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
