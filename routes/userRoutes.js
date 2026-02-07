const express = require("express");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =======================
// CREATE USER (OWNER-WISE)
// =======================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, village, phone, interestRate } = req.body;

    if (!name || !village) {
      return res.status(400).json({ message: "Name and village required" });
    }

    const user = await User.create({
      name,
      village,
      phone,
      interestRate: interestRate || 0,
      ownerId: req.ownerId
    });

    res.json(user);
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// GET ALL USERS (OWNER-WISE)
// =======================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ ownerId: req.ownerId }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// GET SINGLE USER (OWNER-WISE)
// =======================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      ownerId: req.ownerId
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GET USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// DELETE USER (OWNER-WISE)
// =======================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const result = await User.deleteOne({
      _id: req.params.id,
      ownerId: req.ownerId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
