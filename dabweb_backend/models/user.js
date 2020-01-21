const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const user = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  at: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  following: [{ type: String }]
});
user.plugin(uniqueValidator);

module.exports = mongoose.model("user", user);
