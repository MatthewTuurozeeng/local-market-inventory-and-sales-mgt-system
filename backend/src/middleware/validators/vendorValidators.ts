import { body } from "express-validator";

const updateProfileValidators = [
  body("firstName").optional().notEmpty(),
  body("middleName").optional().isString(),
  body("lastName").optional().notEmpty(),
  body("email").optional().isEmail().normalizeEmail(),
  body("phone").optional().notEmpty(),
  body("businessName").optional().notEmpty(),
  body("location").optional().notEmpty(),
  body("primaryProducts").optional().notEmpty(),
  body("staffCount").optional().isInt({ min: 1 }),
  body("productTypes").optional().isArray({ min: 1 }),
  body("otherProductTypes").optional().isString(),
];

export { updateProfileValidators };
