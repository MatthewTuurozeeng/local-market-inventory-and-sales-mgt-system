import type { ProductRecord, VendorRecord } from "../models/database.ts";
import { sendEmail } from "./emailService.ts";
import { sendSms } from "./smsService.ts";

const getFrontendUrl = () => process.env.VITE_API_URL || "http://localhost:5173";

const sendPasswordResetEmail = async (vendor: VendorRecord, token: string) => {
  const resetLink = `${getFrontendUrl()}/reset-password/confirm?token=${token}`;
  const subject = "Reset your Local Market password";
  const text = `Hi ${vendor.firstName},\n\nUse the link below to reset your password:\n${resetLink}\n\nThis link expires in 30 minutes.`;
  const html = `
    <p>Hi ${vendor.firstName},</p>
    <p>Use the link below to reset your password:</p>
    <p><a href="${resetLink}">${resetLink}</a></p>
    <p>This link expires in 30 minutes.</p>
  `;

  try {
    return await sendEmail({ to: vendor.email, subject, text, html });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Password reset email failed.", error);
    return false;
  }
};

const notifyLowStock = async (vendor: VendorRecord, product: ProductRecord) => {
  const subject = `Low Stock Notification: Action Required for ${product.name}`;
  const text = `Dear ${vendor.firstName},\n\nThis is a friendly reminder that your product, "${product.name}", has reached a low stock level.\n\nCurrent Stock: ${product.stock}\nLow Stock Threshold: ${product.lowStockThreshold}\n\nTo avoid running out of stock and missing sales opportunities, please consider restocking this item as soon as possible.\n\nThank you for using Local Market.\n\nBest regards,\nLocal Market Team`;
  const html = `
    <p>Dear ${vendor.firstName},</p>
    <p>This is a friendly reminder that your product, <strong>${product.name}</strong>, has reached a low stock level.</p>
    <table style="border-collapse:collapse;margin:12px 0;">
      <tr><td style="padding:4px 8px;font-weight:bold;">Current Stock:</td><td style="padding:4px 8px;">${product.stock}</td></tr>
      <tr><td style="padding:4px 8px;font-weight:bold;">Low Stock Threshold:</td><td style="padding:4px 8px;">${product.lowStockThreshold}</td></tr>
    </table>
    <p>To avoid running out of stock and missing sales opportunities, please consider restocking this item as soon as possible.</p>
    <p>Thank you for using <strong>Daakye Vendor Space</strong>.<br/>Best regards,<br/>Daakye Vendor Space Team</p>
  `;

  await sendEmail({ to: vendor.email, subject, text, html });
  // SMS notification disabled for now. Only email will be sent for low stock alerts.
  // await sendSms(vendor.phone, `Low stock alert: "${product.name}" has only ${product.stock} left. Please restock soon.`);
  
};

export { notifyLowStock, sendPasswordResetEmail };
