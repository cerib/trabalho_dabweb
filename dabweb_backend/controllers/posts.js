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
