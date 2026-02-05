const express = require("express");
const Ledger = require("../models/ledger");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ===============================
   CREATE LEDGER ENTRY
   =============================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId, particular, amount, type, date } = req.body;

    const entry = new Ledger({
      userId: userId,
      particular: particular,
      amount: amount,
      type: type,
      date: date,
      ownerId: req.ownerId
    });

    await entry.save();
    res.json(entry);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   GET LEDGER BY USER (OWNER WISE)
   =============================== */
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const data = await Ledger.find({
      userId: req.params.userId,
      ownerId: req.ownerId
    }).sort({ date: 1 });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   DELETE LEDGER ENTRY (OWNER WISE)
   =============================== */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Ledger.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.ownerId
    });

    res.json({ message: "Entry deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   UPDATE LEDGER ENTRY (OWNER WISE)
   =============================== */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Ledger.findOneAndUpdate(
      {
        _id: req.params.id,
        ownerId: req.ownerId
      },
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
