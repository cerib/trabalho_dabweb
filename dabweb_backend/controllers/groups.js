const Group = require("../models/group");

module.exports.insertNew = fields => {
  new Group(fields).save();
};

module.exports.findByEmail = email => {
  return Group.find({
    $or: [{ creator: email }, { members: email }]
  });
};
