var express = require("express");
var router = express.Router();

const Users = require("../controllers/users");
const Posts = require("../controllers/posts");
const Groups = require("../controllers/groups");
// criar, retrieve e editar user
// POST "/api/users/" (campos no body) v
// GET "/api/users/:userat" v
// PUT "api/users/:userat"

// visualizar perfil do user
// GET "/api/users/:at/profile"

/* Register user in DB. */
router.post("/", async function(req, res, next) {
  try {
    //verificar se os at estao disponiveis para o grupo e para o utilizador
    let group = await Groups.findByAt(req.body.at);
    let user = await Users.Search(req.body.at);
    //se nao, enviar erro
    if (group || user) {
      res.status(400).jsonp({
        error: "user or group with that at handle already exists",
        code: -1 //codigo serve apenas para ver se o erro e do mongo ou e do "at", no front end faz-se "if(response.data.at)"
      });
    } else {
      //se sim, inserir utilizador e criar um grupo com at igual ao at do utilizador
      let groupFields = {
        name: "Página de " + req.body.name,
        at_creator: req.body.at,
        at: req.body.at,
        members: [
          { name: req.body.name, email: req.body.email, at: req.body.at }
        ],
        invited: [],
        public: true
      };
      let user = await Users.insertNew(req.body);
      user.password = "removed for security reasons";
      let group = await Groups.insertNew(groupFields);
      res.jsonp({ user, group });
    }
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

//pode editar o nome e/ou a password apenas
router.put("/:at", async (req, res, next) => {
  try {
    await Users.editByAt(req.params.at, req.body.name, req.body.password);
    res.sendStatus(200);
  } catch (error) {
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
