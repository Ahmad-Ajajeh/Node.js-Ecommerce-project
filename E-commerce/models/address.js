const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  alias: String,
  details: String,
  city: String,
  postalCode: String,
});

exports.address = addressSchema;
exports.Address = mongoose.model("Address", addressSchema);
