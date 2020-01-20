const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSemPw = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  at: { type: String, required: true }
});

const group = mongoose.Schema(
  {
    name: { type: String, required: true },
    at_creator: { type: String, required: true },
    at: { type: String, required: true },
    members: [{ type: UserSemPw, unique: true }],
    invited: [{ type: UserSemPw, unique: true }],
    public: { type: Boolean, required: true }
  },
  { timestamps: true }
);
group.plugin(uniqueValidator);

module.exports = mongoose.model("group", group);
