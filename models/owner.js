const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  // 🔐 FORGOT PASSWORD
  resetToken: {
    type: String,
    default: null
  },

  resetTokenExpiry: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Owner", ownerSchema);
