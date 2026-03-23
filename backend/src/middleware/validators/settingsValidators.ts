import { body } from "express-validator";

const profileSettingsValidators = [
  body("vendorName").optional().isString().notEmpty(),
  body("shopName").optional().isString().notEmpty(),
  body("phone").optional().isString().notEmpty(),
  body("email").optional().isEmail().normalizeEmail(),
  body("location").optional().isString().notEmpty(),
  body("businessCategory").optional().isString().notEmpty(),
  body("productFocus").optional().isString().notEmpty(),
  body("shopDescription").optional().isString().notEmpty(),
];

const notificationSettingsValidators = [
  body("smsEnabled").optional().isBoolean().toBoolean(),
  body("emailEnabled").optional().isBoolean().toBoolean(),
  body("saleConfirmation").optional().isBoolean().toBoolean(),
  body("lowStockAlerts").optional().isBoolean().toBoolean(),
  body("dailySummary").optional().isBoolean().toBoolean(),
];

const inventorySettingsValidators = [
  body("lowStockThreshold").optional().isInt({ min: 0 }).toInt(),
  body("defaultUnit").optional().isString().notEmpty(),
];

const passwordSettingsValidators = [
  body("oldPassword").notEmpty(),
  body("newPassword").isLength({ min: 8 }),
  body("confirmPassword").isLength({ min: 8 }),
];

export {
  profileSettingsValidators,
  notificationSettingsValidators,
  inventorySettingsValidators,
  passwordSettingsValidators,
};
