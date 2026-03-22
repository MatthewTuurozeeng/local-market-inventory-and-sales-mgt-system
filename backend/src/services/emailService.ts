import nodemailer from "nodemailer";

const buildTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
};

const sendEmail = async (options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<boolean> => {
  const transporter = buildTransport();
  if (!transporter) {
    // eslint-disable-next-line no-console
    console.warn("Email service not configured. Skipping email send.");
    return false;
  }

  const fromName = process.env.EMAIL_FROM_NAME || "Local Market";
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || "no-reply@local-market";

  await transporter.sendMail({
    from: `${fromName} <${fromAddress}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  return true;
};

export { sendEmail };
