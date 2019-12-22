const User = require("../models/user");

module.exports.findOne = email => {
  return User.findOne({ email: email });
};

module.exports.insertNew = fields => {
  let newUser = new User(fields);
  newUser.save();
};

module.exports.findById = id => {
  return User.findById(id);
};
