const Post = require("../models/post");

module.exports.insertNew = fields => {
  new Post(fields).save();
};

module.exports.get = ammount => {
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
  }
};

module.exports.findById = id => {
  return Post.findOne({ _id: id });
};

module.exports.groupPosts = at => {
  return Post.find({ groupAt: at });
};

module.exports.deleteById = id => {
  return Post.deleteOne({ _id: id });
};

module.exports.editById = async (id, text, hashtags) => {
  let post = await Post.findById(id);
  if (!post) {
    throw { error: "post with id " + id + " does not exist" };
  }
  try {
    if (text) {
      post.text = text;
    }
    if (hashtags) {
      post.hashtags = hashtags;
    }
    return post.save();
  } catch (error) {
    throw error;
  }
};

module.exports.findByGroupAt = at => {
  return Post.find({ groupAt: at });
};
