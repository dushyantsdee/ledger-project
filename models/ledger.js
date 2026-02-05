const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true
  },

  type: String,
  amount: Number,
  date: String,
  particular: String
});


module.exports = mongoose.model("Ledger", ledgerSchema);
