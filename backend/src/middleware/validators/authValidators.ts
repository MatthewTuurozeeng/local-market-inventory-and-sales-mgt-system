import { body } from "express-validator"; // the body function from express-validator is used to define validation rules for specific fields in the request body.

const emailRule = body("email")
  .isEmail()
  .withMessage("Invalid email")
  .normalizeEmail();

  // the registerValidators array defines a set of validation rules for the registration endpoint. 
  // it checks for the presence and format of various fields such as first name, last name, email, phone number, password, ID type and number, business name, location, primary products, staff count, and product types. 
  // these validators ensure that the incoming registration data meets the required criteria before it is processed by the route handler, helping to maintain data integrity and provide meaningful error messages to the client when validation fails.
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
