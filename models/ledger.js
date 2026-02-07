const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true
    },

    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    particular: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Ledger", ledgerSchema);
