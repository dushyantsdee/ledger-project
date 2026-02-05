const express = require("express");
const Ledger = require("../models/ledger");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ ownerId: req.ownerId });
    const ledgers = await Ledger.find({ ownerId: req.ownerId });

    let totalCredit = 0;
    let totalDebit = 0;

    ledgers.forEach(l => {
      if (l.type === "credit") totalCredit += l.amount;
      else totalDebit += l.amount;
    });

    res.json({
      totalUsers: users.length,
      totalCredit,
      totalDebit,
      balance: totalCredit - totalDebit
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
