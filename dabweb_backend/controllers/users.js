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

module.exports.findByEmail = email => {
  return User.find(
    {
      email: email
    },
    { password: 0 }
  );
};

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
