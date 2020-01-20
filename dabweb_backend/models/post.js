const mongoose = require("mongoose");

const post = mongoose.Schema(
  {
    author: { type: String, required: true },
    authorAt: { type: String, required: true },
    groupAt: { type: String },
    text: { type: String },
    hashTags: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", post);
