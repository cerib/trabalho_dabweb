var express = require("express");
var router = express.Router();

const axios = require("axios");
const { ensureAuthenticated } = require("../config/auth");

router.get("*", function(req, res, next) {
  res.locals.authenticated = req.user ? true : false;
  next();
});

/* GET dashboard home. */
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    let response = await axios.get("http://localhost:5000/posts");
    res.render("dashboard_main", {
      email: req.user.email,
      posts: response.data
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/posts/new", ensureAuthenticated, (req, res) => {
  let maxPostLength = 1000;
  let textContent = req.body.text.slice(0, maxPostLength);
  let hashTags = req.body.text.match(/(#[A-z0-9]+)/g);
  axios
    .post("http://localhost:5000/posts/new", {
      text: textContent,
      email: req.user.email,
      name: req.user.name,
      course: req.user.course,
      hashTags: hashTags
    })
    .then(response => res.redirect("/dashboard"))
    .catch(e => {
      console.error(e);
      res.redirect("/");
    });
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
