const Group = require("../models/group");

module.exports.insertNew = fields => {
  return new Group(fields).save();
};

module.exports.findByAt = at => {
  return Group.findOne({ at: at });
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

module.exports.addFollower = (groupId, user) => {
  let userToAdd = {
    _id: user._id,
    name: user.name,
    email: user.email,
    at: user.at
  };
  return Group.updateOne(
    { _id: groupId },
    {
      $addToSet: { members: userToAdd },
      $pull: { invited: userToAdd }
    }
  );
};

module.exports.addInvited = (groupId, user) => {
  let userToAdd = {
    _id: user._id,
    name: user.name,
    email: user.email,
    at: user.at
  };
  return Group.updateOne(
    { _id: groupId },
    { $addToSet: { invited: userToAdd } }
  );
};

module.exports.removeFollower = (groupId, user) => {
  let userToRemove = {
    _id: user._id,
    name: user.name,
    email: user.email,
    at: user.at
  };
  return Group.updateOne(
    { _id: groupId },
    { $pull: { members: userToRemove, invited: userToRemove } }
  );
};

module.exports.removeInvite = (groupId, user) => {
  let userToRemove = {
    _id: user._id,
    name: user.name,
    email: user.email,
    at: user.at
  };
  return Group.updateOne(
    { _id: groupId },
    { $pull: { invited: userToRemove } }
  );
};

module.exports.editGroup = (group, newName, public) => {
  if (newName) {
    group.name = newName;
  }
  if (public) {
    group.public = public;
  }
  return group.save();
};

module.exports.userGroupsInfo = user => {
  return Group.aggregate([
    {
      $addFields: {
        membercount: { $size: "$members" }
      }
    },
    {
      $facet: {
        following: [
          { $match: { at: { $in: user.following } } },
          { $project: { posts: 0, members: 0 } }
        ],
        invites: [
          { $match: { at: { $in: user.invites } } },
          { $project: { posts: 0, members: 0 } }
        ]
      }
    }
  ]);

  let a = [
    {
      $addFields: {
        membercount: { $size: "$members" }
      }
    },
    {
      $facet: {
        created: [
          { $match: { at: { $in: ["csr1"] } } },
          { $project: { posts: 0, members: 0 } }
        ],
        followed: [
          { $match: { at: { $in: ["jcn"] } } },
          { $project: { posts: 0, members: 0 } }
        ],
        invited: [
          { $match: { at: { $in: ["cesarfans"] } } },
          { $project: { posts: 0, members: 0 } }
        ]
      }
    }
  ];
  //return Group.find
};
