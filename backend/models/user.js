const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  services: [
    {
      type: String,
    },
  ],
  termsAndCondition: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
