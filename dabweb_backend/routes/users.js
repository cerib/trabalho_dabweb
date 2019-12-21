var express = require("express");
var router = express.Router();

const Users = require("../controllers/users");

/* GET users listing. */
router.post("/register", async function(req, res, next) {
  let user = null;
  try {
    user = await Users.findOne(req.body.email);
    console.log("--- printing result of find user in db below ---");
    console.log(user);
    if (!user) {
      //can insert user
      let resdata = {
        added: ""
      };
      let { name, email, password, course } = req.body;
      let user = {
        name: name,
        email: email,
        password: password,
        course: course
      };
      Users.insertNew(user);
      resdata.added = true;
      res.jsonp(resdata);
    } else {
      resdata.added = false;
      res.jsonp(resdata);
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
