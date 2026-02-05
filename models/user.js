const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  village: String,
  phone: String,
  interestRate: Number,

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
