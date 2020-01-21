const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const arrayUniquePlugin = require("mongoose-unique-array");

const UserSemPw = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  at: { type: String, required: true }
});

const group = mongoose.Schema(
  {
    name: { type: String, required: true },
    at_creator: { type: String, required: true },
    at: { type: String, required: true, unique: true },
    members: [{ type: UserSemPw }],
    invited: [{ type: UserSemPw }],
    public: { type: Boolean, required: true }
  },
  { timestamps: true }
);
group.plugin(uniqueValidator);
group.plugin(arrayUniquePlugin);

module.exports = mongoose.model("group", group);
