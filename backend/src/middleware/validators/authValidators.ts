import { body } from "express-validator";

const emailRule = body("email")
  .isEmail()
  .withMessage("Invalid email")
  .normalizeEmail();

const registerValidators = [
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
];

const loginValidators = [emailRule, body("password").notEmpty()];
const resetValidators = [emailRule];
const resetConfirmValidators = [body("token").notEmpty(), body("password").isLength({ min: 8 })];

export {
  emailRule,
  loginValidators,
  registerValidators,
  resetConfirmValidators,
  resetValidators,
};
