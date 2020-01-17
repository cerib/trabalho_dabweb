var express = require("express");
var router = express.Router();

const Groups = require("../controllers/groups");

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
});

module.exports = router;
