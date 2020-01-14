const mongoose = require("mongoose");

const group = mongoose.Schema(
  {
    name: { type: String, required: true },
    creator: { type: String, required: true },
    members: [{ type: String, required: true }],
    public: { type: Boolean, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("group", group);
