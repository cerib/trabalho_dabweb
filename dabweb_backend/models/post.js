const mongoose = require("mongoose");

const post = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    group: { type: String },
    text: { type: String },
    hashTags: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", post);
