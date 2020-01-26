const User = require("../models/user");

module.exports.findOne = email => {
  return User.findOne({ email: email });
};

module.exports.insertNew = fields => {
  let newUser = new User(fields);
  return newUser.save();
};

module.exports.findById = id => {
  return User.findById(id);
};

module.exports.editByAt = async (at, name, password) => {
  console.log(at + " " + name + " " + password);
  let user = await User.findOne({ at: at });
  if (!user) {
    throw { error: "User with at '" + at + "' does not exist" };
  }
  try {
    if (name) {
      user.name = name;
    }
    if (password) {
      user.password = password;
    }
    user.save();
  } catch (error) {
    throw error;
  }
};

module.exports.findByEmail = email => {
  return User.findOne({
    email: email
  });
};

module.exports.Search = at => {
  return User.findOne({ at: at });
};

module.exports.followGroup = (userId, groupAt) => {
  return User.updateOne(
    { _id: userId },
    {
      $addToSet: { following: groupAt },
      $pull: { invites: groupAt }
    }
  );
};

module.exports.unfollowGroup = (userId, groupAt) => {
  return User.updateOne(
    { _id: userId },
    { $pull: { following: groupAt, invites: groupAt } }
  );
};

module.exports.addInvite = (userId, groupAt) => {
  return User.updateOne({ _id: userId }, { $addToSet: { invites: groupAt } });
};

/*
module.exports.Search = query => {
  return User.find(
    {
      $or: [
        { course: query },
        { name: { $regex: query, $options: "i" } },
        {
          email: query
        },
        {
          email: new RegExp(`^${query}@.{0,20}\..{0,10}`)
        }
      ]
    },
    { password: 0 }
  );
};
*/
