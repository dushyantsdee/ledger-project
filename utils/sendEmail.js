const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/*
|--------------------------------------------------------------------------
| SEND EMAIL UTILITY (RESEND)
|--------------------------------------------------------------------------
| Future changes:
| - custom templates
| - branded emails
*/
const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "Ledger App <onboarding@resend.dev>",
      to,
      subject,
      html
    });
  } catch (error) {
    console.error("Email send failed:", error);
    throw new Error("Email service failed");
  }
};

module.exports = sendEmail;
