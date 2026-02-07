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

if (!JWT_SECRET || !BASE_URL) {
  throw new Error("JWT_SECRET or BASE_URL missing in .env");
}

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    if (!email || !password || !adminKey) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ message: "Invalid admin key" });
    }

    const exists = await Owner.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await Owner.create({
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { ownerId: owner._id, email: owner.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      ownerId: owner._id
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, owner.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { ownerId: owner._id, email: owner.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      ownerId: owner._id
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= AUTH ME =================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const owner = await Owner.findById(req.ownerId).select("_id email");
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.json(owner);
  } catch (err) {
    console.error("ME ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

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
      `<p>Click the link below to reset your password:</p>
       <a href="${resetLink}">${resetLink}</a>`
    );

    res.json({ message: "Reset link sent" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= RESET PASSWORD =================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Invalid request" });
    }

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
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= CHANGE PASSWORD =================
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const owner = await Owner.findById(req.ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const match = await bcrypt.compare(oldPassword, owner.password);
    if (!match) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    owner.password = await bcrypt.hash(newPassword, 10);
    await owner.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
