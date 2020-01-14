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

router.post("/new", async (req, res, next) => {
  console.log(req.body);
  res.jsonp(req.body);
});

module.exports = router;
