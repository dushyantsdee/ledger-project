const express = require("express");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =======================
// CREATE USER (OWNER-WISE)
// =======================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      village: req.body.village,
      phone: req.body.phone,
      interestRate: req.body.interestRate || 0,

      // 🔥 OWNER LINK
      ownerId: req.ownerId
    });

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// GET ALL USERS (OWNER-WISE) ✅ VERY IMPORTANT
// =======================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ ownerId: req.ownerId });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// GET SINGLE USER BY ID (OWNER-WISE)
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
    res.status(500).json({ error: err.message });
  }
});


// =======================
// DELETE USER (OWNER-WISE)
// =======================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await User.deleteOne({
      _id: req.params.id,
      ownerId: req.ownerId
    });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
