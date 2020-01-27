const mongoose = require("mongoose");

var ficheiroSchema = new mongoose.Schema({
  date: String,
  name: String,
  originalname: String,
  mimetype: String,
  size: Number,
  userAt: String,
  path: String
});

module.exports = mongoose.model("file", ficheiroSchema);
