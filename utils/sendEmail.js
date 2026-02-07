const { Resend } = require("resend");

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY missing in .env");
}

const resend = new Resend(RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "Ledger App <onboarding@resend.dev>",
      to: [to],
      subject,
      html
    });
  } catch (err) {
    console.error("SEND EMAIL ERROR:", err);
    throw err;
  }
};

module.exports = sendEmail;
