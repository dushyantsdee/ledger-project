const express = require("express");
const Ledger = require("../models/ledger");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// DASHBOARD STATS (OWNER-WISE)
// ===============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ ownerId: req.ownerId });

    const ledgers = await Ledger.find({ ownerId: req.ownerId });

    let totalCredit = 0;
    let totalDebit = 0;

    ledgers.forEach(entry => {
      if (entry.type === "credit") {
        totalCredit += entry.amount;
      } else if (entry.type === "debit") {
        totalDebit += entry.amount;
      }
    });

    res.json({
      totalUsers,
      totalCredit,
      totalDebit,
      balance: totalCredit - totalDebit
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
