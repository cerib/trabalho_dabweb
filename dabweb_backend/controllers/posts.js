const mongoose = require("mongoose");
const Group = require("../models/group");
const Post = require("../models/post");
const File = require("../models/file");

module.exports.insertNew = (groupAt, fields) => {
  let post = new Post(fields);
  return Group.updateOne(
    { at: groupAt },
    {
      $push: { posts: { $each: [post], $position: 0 } }
    }
  );
};

module.exports.addFile = async (postId, fileFields) => {
  console.log("Dentro de addfile");
  let objId = mongoose.Types.ObjectId(postId);

  let file = await new File(fileFields).save();

  let post = await Group.aggregate([
    { $unwind: "$posts" },
    { $match: { "posts._id": objId } },
    { $replaceWith: "$posts" }
  ]);
  file._id = `ObjectId("${file._id}")`;
  post[0].files.push(file);
  let files = post[0].files;

  return Group.updateOne(
    { posts: { $elemMatch: { _id: objId } } },
    { $set: { "posts.$.files": files } }
  );
};

module.exports.getFileById = fileId => {
  let objId = mongoose.Types.ObjectId(fileId);
  return Group.aggregate([
    { $unwind: "$posts" },
    { $unwind: "$posts.files" },
    { $match: { "posts.files._id": objId } },
    { $replaceWith: "$posts.files" }
  ]);
};

module.exports.findById = id => {
  let objId = mongoose.Types.ObjectId(id);
  return Group.aggregate([
    { $unwind: "$posts" },
    { $match: { "posts._id": objId } },
    { $replaceWith: "$posts" }
  ]);
};

module.exports.deleteById = id => {
  let objId = mongoose.Types.ObjectId(id);
  Group.findOne({ "posts._id": objId }, (err, res) => {
    res.posts.pull({ _id: id });
    return res.save();
  });
};

module.exports.editById = (id, text, hashTags) => {
  let objId = mongoose.Types.ObjectId(id);
  if (text && hashTags) {
    return Group.updateOne(
      { posts: { $elemMatch: { _id: objId } } },
      { $set: { "posts.$.text": text, "posts.$.hashTags": hashTags } }
    );
  } else if (text) {
    return Group.updateOne(
      { posts: { $elemMatch: { _id: objId } } },
      { $set: { "posts.$.text": text } }
    );
  } else if (hashTags) {
    return Group.updateOne(
      { posts: { $elemMatch: { _id: objId } } },
      { $set: { "posts.$.hashTags": hashTags } }
    );
  }
};

module.exports.findByGroupAt = groupAt => {
  return Group.aggregate([
    { $match: { at: "" + groupAt } },
    { $project: { posts: 1 } },
    { $unwind: "$posts" },
    { $replaceWith: "$posts" },
    { $sort: { createdAt: -1 } }
  ]);
};

module.exports.findByGroupArray = groups => {
  return Group.aggregate([
    { $match: { at: { $in: groups } } },
    { $project: { posts: 1 } },
    { $unwind: "$posts" },
    { $replaceWith: "$posts" },
    { $sort: { createdAt: -1 } }
  ]);
};

module.exports.findByHashTag = hashtag => {
  return Group.aggregate([
    { $unwind: "$posts" },
    { $match: { "posts.hashTags": hashtag } },
    { $replaceWith: "$posts" }
  ]);
};

/* module.exports.get = (ammount) => {
  //o id armazena o timestamp se for o predefinido do mongo
  //no nosso caso queremos que os novos posts estejam em cima por
  //isso ordenamos de forma crescente
  sort = { _id: -1 };
     if (!ammount) {
    return Post.find({}).sort(sort);
  } else {
  return Post.find({})
    .limit(ammount)
    .sort(sort);
  //}
}; */
