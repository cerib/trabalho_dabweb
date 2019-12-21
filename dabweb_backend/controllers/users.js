const User = require("../models/user");

module.exports.findOne = email => {
  return User.findOne({ email: email });
};

module.exports.insertNew = fields => {
  let newUser = new User(fields);
  newUser.save();
};
