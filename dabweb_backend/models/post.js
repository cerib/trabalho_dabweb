const mongoose = require("mongoose");

var fileSchema = new mongoose.Schema({
  date: String,
  name: String,
  originalname: String,
  mimetype: String,
  size: Number,
  userAt: String,
  path: String
});

const post = mongoose.Schema(
  {
    author: { type: String, required: true },
    authorAt: { type: String, required: true },
    groupAt: { type: String, required: true },
    text: { type: String },
    hashTags: [{ type: String, required: true }],
    files: [fileSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", post);
