import twilio from "twilio";

const createClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    return null;
  }
  return twilio(accountSid, authToken);
};

const sendSms = async (to: string, body: string): Promise<boolean> => {
  const client = createClient();
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!client || !from) {
    // eslint-disable-next-line no-console
    console.warn("SMS service not configured. Skipping SMS send.");
    return false;
  }

  await client.messages.create({ to, from, body });
  return true;
};

export { sendSms };
