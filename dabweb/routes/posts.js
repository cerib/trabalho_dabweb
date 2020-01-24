var express = require("express");
var router = express.Router();

const axios = require("axios");
const { ensureAuthenticated } = require("../config/auth");

router.get("*", function(req, res, next) {
  res.locals.authenticated = req.user ? true : false;
  if (req.user) {
    res.locals.user = req.user;
    delete res.locals.user.password;
  }
  next();
});

router.post("/:groupat", ensureAuthenticated, async (req, res) => {
  if (!req.user.following.includes(req.params.groupat)) {
    res.jsonp({ error: "You can't post in a group you don't follow" });
  } else {
    try {
      let response = await axios.get(
        `http://localhost:5000/api/groups/${req.params.groupat}`
      );
      //verificar se o grupo se trata de uma pagina pessoal. Se sim, so deixa postar se for o dono da pagina
      let group = response.data;
      if (group.at === group.at_creator && req.user.at !== group.at_creator) {
        //nao dono da pagina pessoal a tentar postar
        res.jsonp({ error: "You can't post in someone else's profile" });
      } else {
        let postResponse = await axios.post(
          "http://localhost:5000/api/posts/",
          {
            ...req.body,
            author: req.user.name,
            authorAt: req.user.at,
            hashTags: req.body.text.match(/(#[A-z0-9]+)/g),
            groupAt: req.params.groupat
          }
        );
        res.redirect("back");
      }
    } catch (error) {
      res.status(400).jsonp(error);
    }
  }
});

// POST /posts/:groupat - postar um post
// POST /posts/:id/edit - editar um post
// POST /posts/:id/delete - apagar um post
// GET /posts/:id - visao geral do post

module.exports = router;
