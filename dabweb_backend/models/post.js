const mongoose = require("mongoose");

const post = mongoose.Schema(
  {
    author: { type: String, required: true },
    authorAt: { type: String, required: true },
    groupAt: { type: String, required: true },
    text: { type: String },
    hashTags: [{ type: String, required: true }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", post);
