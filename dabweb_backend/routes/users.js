var express = require("express");
var router = express.Router();

const Users = require("../controllers/users");

/* Get user from DB */

router.get("/finduserbyid/:id", async (req, res, next) => {
  let id = req.params.id;
  try {
    user = await Users.findById(id);
    res.jsonp(user);
  } catch (err) {
    console.loge(err);
    res.sendStatus(400);
  }
});

router.get("/finduser/:email", async (req, res, next) => {
  let email = req.params.email;
  try {
    user = await Users.findOne(email);
    res.jsonp(user);
  } catch (error) {
    console.loge(err);
    res.sendStatus(400);
  }
});

/* Register user in DB. */
router.post("/register", async function(req, res, next) {
  let user = null;
  try {
    user = await Users.findOne(req.body.email);
    console.log("--- printing result of find user in db below ---");
    console.log(user);
    let resdata = {
      added: ""
    };
    if (!user) {
      //can insert user
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

router.get("/search", async (req, res, next) => {
  try {
    console.log("finding users called " + req.query.searchQuery);
    res.jsonp(await Users.Search(req.query.searchQuery));
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
