var express = require("express");
var router = express.Router();

const axios = require("axios");
const { ensureAuthenticated } = require("../config/auth");

/* GET dashboard home. */
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    let response = await axios.get("http://localhost:5000/posts/");
    res.render("dashboard_main", {
      authenticated: req.isAuthenticated(),
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
  axios
    .post("http://localhost:5000/posts/new", {
      text: textContent,
      email: req.user.email,
      name: req.user.name,
      course: req.user.course
    })
    .then(response => res.redirect("/dashboard"))
    .catch(e => {
      console.error(e);
      res.redirect("/");
    });
});
module.exports = router;
