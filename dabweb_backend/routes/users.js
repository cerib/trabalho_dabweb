var express = require("express");
var router = express.Router();

const Users = require("../controllers/users");
const Posts = require("../controllers/posts");

// criar, retrieve e editar user
// POST "/api/users/" (campos no body)
// GET "/api/users/:userat"
// PUT "api/users/:userat"

// visualizar perfil do user
// GET "/api/users/:at/profile"

/* Register user in DB. */
//falta verificar se o at do grupo esta disponivel, o que acontece quando o at nao esta disponivel, criar grupo, etc
router.post("/", async function(req, res, next) {
  try {
    let user = await Users.insertNew(req.body);
    console.log(user);
    res.sendStatus(200);
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

/* Search user by "at" field */
router.get("/:at", async (req, res, next) => {
  try {
    res.jsonp(await Users.Search(req.params.at));
  } catch (e) {
    res.status(400).jsonp(error);
  }
});

/* Fetch user and posts to view profile */
router.get("/:at/profile", async (req, res, next) => {
  try {
    let user = await Users.Search(req.params.at);
    let posts = await Posts.groupPosts(req.params.at);
    res.jsonp({ user, posts });
  } catch (e) {
    res.status(400).jsonp(error);
  }
});

/* router.get("/finduser/:email", async (req, res, next) => {
  let email = req.params.email;
  try {
    user = await Users.findOne(email);
    res.jsonp(user);
  } catch (error) {
    console.loge(err);
    res.sendStatus(400);
  }
}); */

/* 
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
*/

module.exports = router;
