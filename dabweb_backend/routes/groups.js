var express = require("express");
var router = express.Router();

const Groups = require("../controllers/groups");
const Users = require("../controllers/users");
// dar follow e unfollow a um grupo
// POST /api/groups/follow/:groupat/:userat
// DELETE /api/groups/unfollow/:groupat/:userat

// criar, apagar, editar, visualizar grupo
// POST /api/groups (no body tem os campos)
// DELETE /api/groups/:groupat
// PUT /api/groups/:groupat
// GET /api/groups/:groupat

// convidar para grupo
// POST /api/groups/:groupat/invite/:invitedat

/* Follow a group */
router.post("/follow/:groupat/:userat", async (req, res, next) => {
  try {
    let groupat = req.params.groupat;
    let userat = req.params.userat;
    let group = await Groups.findByAt(groupat);
    let user = await Users.Search(userat);
    if (!group) {
      res.status(400).jsonp({
        error: "Group with at '" + groupat + "' does not exist",
        code: -1
      });
    } else if (!user) {
      res.status(400).jsonp({
        error: "User with at '" + userat + "' does not exist",
        code: -2
      });
    } else {
      let groupRes = await Groups.addFollower(group._id, user);
      let userRes = await Users.followGroup(user._id, group.at);
      res.jsonp({ groupRes, userRes });
    }
  } catch (error) {
    res.jsonp(error);
  }
});

/* Unfollow a group */
router.delete("/unfollow/:groupat/:userat", async (req, res, next) => {
  try {
    let groupat = req.params.groupat;
    let userat = req.params.userat;
    let group = await Groups.findByAt(groupat);
    let user = await Users.Search(userat);
    if (!group) {
      res.status(400).jsonp({
        error: "Group with at '" + groupat + "' does not exist",
        code: -1
      });
    } else if (!user) {
      res.status(400).jsonp({
        error: "User with at '" + userat + "' does not exist",
        code: -2
      });
    } else {
      let groupRes = await Groups.removeFollower(group._id, user);
      let userRes = await Users.unfollowGroup(user._id, group.at);
      res.jsonp({ groupRes, userRes });
    }
  } catch (error) {
    res.jsonp(error);
  }
});

/* Create group */
router.post("/", async (req, res, next) => {
  try {
    let fields = ({ name, at_creator, at, public } = req.body);
    let user = await Users.Search(at_creator);
    if (!user) {
      res.status(400).jsonp({
        error: "User with at '" + at_creator + "' does not exist",
        code: -1
      });
    } else {
      let group = await Groups.findByAt(at);
      if (group) {
        res.status(400).jsonp({
          error: "Group with at '" + at + "' already exists",
          group: group,
          code: -2
        });
      } else {
        fields.members = [
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            at: user.at
          }
        ];
        let newGroup = await Groups.insertNew(fields);
        let userRes = await Users.followGroup(user._id, newGroup.at);
        res.jsonp({ newGroup, userRes });
      }
    }
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

/* Delete Group */
router.delete("/:groupat", (req, res, next) => {
  res.status(403).jsonp({ error: "Resource not yet available" });
});

/* Edit Gtoup */
router.put("/:groupat", async (req, res, next) => {
  try {
    let group = await Groups.findByAt(req.params.groupat);
    if (!group) {
      res.status(400).jsonp({
        error: `Group with at ${req.params.groupat} does not exist`,
        code: -1
      });
    } else {
      await Groups.editGroup(group, req.body.name, req.body.public);
      res.sendStatus(200);
    }
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

/* Get Group */
router.get("/:groupat", async (req, res, next) => {
  console.log(req.params.groupat);
  try {
    let group = await Groups.findByAt(req.params.groupat);
    if (!group) {
      res.status(400).jsonp({
        error: `Group with at ${req.params.groupat} does not exist`,
        code: -1
      });
    } else {
      res.jsonp({ group });
    }
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

/* Invite User To Group */
router.post("/:groupat/invite/:invitedat", async (req, res, next) => {
  try {
    let group = await Groups.findByAt(req.params.groupat);
    if (!group) {
      res.status(400).jsonp({
        error: `Group with at ${req.params.groupat} does not exist`,
        code: -1
      });
    } else {
      let user = await Users.Search(req.params.invitedat);
      if (!user) {
        res.status(400).jsonp({
          error: `User with at ${req.params.invitedat} does not exist`,
          code: -2
        });
      } else {
        let groupRes = await Groups.addInvited(group._id, user);
        let userRes = await Users.addInvite(user._id, group.at);
        res.jsonp({ groupRes, userRes });
      }
    }
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

/* 
//route de teste insercao de grupo, com erros correctamente devolvidos na API
router.post("/teste", async (req, res, next) => {
  try {
    let fields = req.body;
    console.log(fields);
    let group = await Groups.insertNew(fields);
    res.jsonp(group);
    console.log(group);
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

router.get("/findbyemail", async (req, res, next) => {
  try {
    let email = req.query.email;
    if (email) {
      let groups = await Groups.findByEmail(email);
      res.jsonp(groups);
    } else {
      res.jsonp([]);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    let name = req.query.groupname;
    let searcher = req.query.searcher;
    if (name && searcher) {
      let groups = await Groups.findByName(name);
      let filtered = groups.filter(group => {
        return (
          group.public == true ||
          group.creator === searcher ||
          group.members.includes(searcher) ||
          group.invited.includes(searcher)
        );
      });
      res.jsonp(filtered);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    let group = await Groups.insertNew(req.body);
    console.log(group);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post("/acceptinvite", async (req, res, next) => {
  try {
    let groupName = req.body.group;
    let creator = req.body.creator;
    let email = req.body.invitedemail;
    if (groupName && creator && email) {
      let group = await Groups.findByNameAndCreator(groupName, creator);
      if (group && group.invited.includes(email)) {
        group.members.push(email);
        group.invited = group.invited.filter(member => member !== email);
        await Groups.updateGroup(group);
        res.jsonp({ accepted: true, reason: "accepted invite" });
      } else {
        res.jsonp({
          accepted: false,
          reason: "group does not exist or user does not belong in invited list"
        });
      }
    } else {
      res.jsonp({ accepted: false, reason: "some fields not filled" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post("/rejectinvite", async (req, res, next) => {
  try {
    let groupName = req.body.group;
    let creator = req.body.creator;
    let email = req.body.invitedemail;
    if (groupName && creator && email) {
      let group = await Groups.findByNameAndCreator(groupName, creator);
      if (group && group.invited.includes(email)) {
        group.invited = group.invited.filter(member => member !== email);
        await Groups.updateGroup(group);
        res.jsonp({ rejected: true, reason: "rejected invite" });
      } else {
        res.jsonp({
          rejected: true,
          reason: "group does not exist or user does not belong in invited list"
        });
      }
    } else {
      res.jsonp({ rejected: false, reason: "some fields not filled" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post("/addinvite", async (req, res, next) => {
  try {
    let groupName = req.body.group;
    let inviter = req.body.inviter;
    let email = req.body.invitedemail;
    if (groupName && inviter && email) {
      let group = await Groups.findByNameAndCreator(groupName, inviter);
      if (group && group.creator == inviter) {
        if (group.members.includes(email) || group.invited.includes(email)) {
          res.jsonp({
            invited: false,
            reason: "user is already a member or user is already in invite list"
          });
        } else {
          group.invited.push(email);
          await Groups.updateGroup(group);
          res.jsonp({ invited: true, reason: "user added to invited list" });
        }
      } else {
        res.jsonp({
          invited: false,
          reason: "group does not exist or user is not the creator"
        });
      }
    } else {
      res.jsonp({ invited: false, reason: "some fields not filled" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}); */

module.exports = router;
