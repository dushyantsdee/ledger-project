const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    village: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      default: ""
    },

    interestRate: {
      type: Number,
      default: 0
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
