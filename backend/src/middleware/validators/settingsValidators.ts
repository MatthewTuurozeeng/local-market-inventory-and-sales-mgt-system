import { body } from "express-validator";

// the profileSettingsValidators array defines a set of validation rules for the profile settings update endpoint.
const profileSettingsValidators = [
  body("vendorName").optional().isString().notEmpty(),
  body("shopName").optional().isString().notEmpty(),
  body("phone").optional().isString().notEmpty(),
  body("email").optional().isEmail().normalizeEmail(),
  body("location").optional().isString().notEmpty(),
  body("businessCategory").optional({ checkFalsy: true }).isString(),
  body("productFocus").optional({ checkFalsy: true }).isString(),
  body("shopDescription").optional({ checkFalsy: true }).isString(),
  body("avatarUrl").optional({ nullable: true, checkFalsy: true }).isString(),
  body("storeLogoUrl").optional({ nullable: true, checkFalsy: true }).isString(),
];

// the notificationSettingsValidators array defines a set of validation rules for the notification settings update endpoint.
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
