const Group = require("../models/group");

module.exports.insertNew = fields => {
  return new Group(fields).save();
};

module.exports.findByEmail = email => {
  return Group.find({
    $or: [{ creator: email }, { members: email }]
  });
};

module.exports.findByName = name => {
  return Group.find({ name: name });
};

module.exports.findByNameAndCreator = (name, creator) => {
  return Group.findOne({ name: name, creator: creator });
};

module.exports.updateGroup = group => {
  return Group.replaceOne({ _id: group._id }, group);
};
