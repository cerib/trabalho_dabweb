const mongoose = require("mongoose");

const user = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  course: { type: String, required: true }
});

module.exports = mongoose.model("user", user);
