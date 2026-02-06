const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Owner = require("../models/owner");
const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL;

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    if (!email || !password || !adminKey) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (adminKey !== "LEDGER_ADMIN_2026") {
      return res.status(403).json({ message: "Invalid admin key" });
    }

    const exists = await Owner.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const owner = await Owner.create({
      email,
      password: hashed
    });

    const token = jwt.sign(
      { ownerId: owner._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, owner.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { ownerId: owner._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    owner.resetToken = token;
    owner.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await owner.save();

    const resetLink = `${BASE_URL}/reset-password.html?token=${token}`;

    await sendEmail(
      email,
      "Reset your password",
      `<p>Click below to reset password:</p><a href="${resetLink}">${resetLink}</a>`
    );

    res.json({ message: "Reset link sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= RESET PASSWORD =================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const owner = await Owner.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!owner) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    owner.password = await bcrypt.hash(newPassword, 10);
    owner.resetToken = null;
    owner.resetTokenExpiry = null;
    await owner.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
