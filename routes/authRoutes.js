const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const Owner = require("../models/owner");
const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;      // baad me .env
const ADMIN_SECRET = "LEDGER_ADMIN_2026";      // sirf admin ke liye
const REGISTER_ENABLED = true;                 // false = register band

// =======================
// REGISTER OWNER (ADMIN ONLY + AUTO LOGIN)
// =======================
  router.post("/register", async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    if (!REGISTER_ENABLED) {
      return res.status(403).json({ message: "Registration disabled" });
    }

    if (!email || !password || !adminKey) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (adminKey !== ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid admin key" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password too weak" });
    }

    const existing = await Owner.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const owner = new Owner({ email, password: hashed });
    await owner.save();

    const token = jwt.sign(
      { ownerId: owner._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}); 

// =======================
// LOGIN OWNER
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { ownerId: owner._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// GET LOGGED-IN OWNER
// =======================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const owner = await Owner.findById(req.ownerId).select("-password");
    res.json(owner);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// CHANGE PASSWORD
// =======================
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password too weak" });
    }

    const owner = await Owner.findById(req.ownerId);

    const isMatch = await bcrypt.compare(oldPassword, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    owner.password = await bcrypt.hash(newPassword, 10);
    await owner.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// FORGOT PASSWORD (SEND MAIL)
// =======================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    owner.resetToken = token;
    owner.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await owner.save();

    const resetLink =
      `http://localhost:3000/reset-password.html?token=${token}`;

    await sendEmail(
      email,
      "Reset your Ledger password",
      `
        <p>You requested a password reset.</p>
        <p>This link is valid for 15 minutes.</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    );

    res.json({ message: "Reset link sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// RESET PASSWORD
// =======================
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

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password too weak" });
    }

    owner.password = await bcrypt.hash(newPassword, 10);
    owner.resetToken = null;
    owner.resetTokenExpiry = null;

    await owner.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
