import type { ProductRecord, VendorRecord } from "../models/database.ts";
import { sendEmail } from "./emailService.ts";
import { sendSms } from "./smsService.ts";

const getFrontendUrl = () => process.env.FRONTEND_URL || "http://localhost:5173";

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

  return sendEmail({ to: vendor.email, subject, text, html });
};

const notifyLowStock = async (vendor: VendorRecord, product: ProductRecord) => {
  const subject = `Low stock alert: ${product.name}`;
  const text = `Hi ${vendor.firstName},\n\n${product.name} is low in stock.\nCurrent stock: ${product.stock}\nThreshold: ${product.lowStockThreshold}\n\nPlease restock soon.`;
  const html = `
    <p>Hi ${vendor.firstName},</p>
    <p><strong>${product.name}</strong> is low in stock.</p>
    <ul>
      <li>Current stock: ${product.stock}</li>
      <li>Threshold: ${product.lowStockThreshold}</li>
    </ul>
    <p>Please restock soon.</p>
  `;

  await sendEmail({ to: vendor.email, subject, text, html });

  if (vendor.phone) {
    await sendSms(
      vendor.phone,
      `Low stock: ${product.name} (${product.stock} left). Threshold: ${product.lowStockThreshold}.`
    );
  }
};

export { notifyLowStock, sendPasswordResetEmail };
