const express = require("express");
const Ledger = require("../models/ledger");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// CREATE LEDGER ENTRY (OWNER-WISE)
// ===============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId, particular, amount, type, date } = req.body;

    if (!userId || !particular || !amount || !type || !date) {
      return res.status(400).json({ message: "All fields required" });
    }

    const entry = await Ledger.create({
      userId,
      particular,
      amount,
      type,
      date,
      ownerId: req.ownerId
    });

    res.json(entry);
  } catch (err) {
    console.error("CREATE LEDGER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// GET LEDGER BY USER (OWNER-WISE)
// ===============================
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const entries = await Ledger.find({
      userId: req.params.userId,
      ownerId: req.ownerId
    }).sort({ date: 1 });

    res.json(entries);
  } catch (err) {
    console.error("GET LEDGER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// UPDATE LEDGER ENTRY (OWNER-WISE)
// ===============================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Ledger.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.ownerId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE LEDGER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// DELETE LEDGER ENTRY (OWNER-WISE)
// ===============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Ledger.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.ownerId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Entry deleted" });
  } catch (err) {
    console.error("DELETE LEDGER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
