const { Resend } = require("resend");

// Render ENV se key lega
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    console.log("📨 Sending email to:", to);

    const response = await resend.emails.send({
      from: "Ledger App <onboarding@resend.dev>",
      to: [to], // 👈 array IMPORTANT
      subject,
      html
    });

    console.log("✅ Email sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Resend error:", error);
    throw error;
  }
};

module.exports = sendEmail;
