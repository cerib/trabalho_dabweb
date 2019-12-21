var express = require("express");
var router = express.Router();

const Users = require("../controllers/users");

/* GET users listing. */
router.post("/register", async function(req, res, next) {
  let user = await Users.findOne(req.body.email);
  console.log(user);
  let resdata = {
    added: ""
  };
  if (!user) {
    //can insert user
    let { name, email, password, course } = req.body;
    let user = { name: name, email: email, password: password, course: course };
    Users.insertNew(user);
    resdata.added = true;
    res.jsonp(resdata);
  } else {
    resdata.added = false;
    res.jsonp(resdata);
  }
});

module.exports = router;
