const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  serviceCategory: String,
  serviceNames: [String],
});

module.exports = mongoose.model("Service", serviceSchema);
