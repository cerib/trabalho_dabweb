var express = require("express");
var router = express.Router();

const axios = require("axios");
const { ensureAuthenticated } = require("../config/auth");

router.get("*", function(req, res, next) {
  res.locals.authenticated = req.user ? true : false;
  res.locals.email = req.user ? req.user.email : null;
  next();
});

/* GET dashboard home. */
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    //posts de todos os grupos que o user segue
    let response = await axios.get(
      `http://localhost:5000/api/users/${req.user.at}/feed`
    );
    res.render("dashboard_main", {
      posts: response.data,
      ownGroup: req.user.following[0],
      groups: req.user.following.slice(1)
    });
  } catch (error) {
    res.jsonp(error);
  }
});

router.post("/posts/", ensureAuthenticated, (req, res) => {
  let maxPostLength = 1000;
  let textContent = req.body.text.slice(0, maxPostLength);
  let hashTags = req.body.text.match(/(#[A-z0-9]+)/g);
  //verificar se pode postar nesse grupo
  if (!req.user.following.includes(req.body.groupAt)) {
    res.jsonp({ error: "You can't post in groups you don't follow" });
  } else {
    axios
      .post("http://localhost:5000/api/posts/", {
        text: textContent,
        authorAt: req.user.at,
        author: req.user.name,
        groupAt: req.body.groupAt,
        hashTags: hashTags
      })
      .then(response => res.redirect("/dashboard"))
      .catch(e => {
        console.error(e);
        res.redirect("/");
      });
  }
});

router.get("/search", ensureAuthenticated, async (req, res) => {
  if (req.query.searchQuery.length > 2) {
    try {
      let query = req.query.searchQuery;
      let response = await axios.get(
        "http://localhost:5000/users/search?searchQuery=" + query
      );
      res.render("usersearchresults", { users: response.data });
    } catch (e) {
      console.log(e);
    }
  } else {
    res.redirect("/dashboard");
  }
});

module.exports = router;
