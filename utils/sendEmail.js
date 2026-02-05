const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,        // 🔑 IMPORTANT
      secure: true,     // 🔑 must be true for 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
    });

    await transporter.sendMail({
      from: `"Ledger App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (err) {
    console.error("EMAIL SEND ERROR:", err);
    throw err;
  }
};

module.exports = sendEmail;
