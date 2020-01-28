var express = require("express");
var router = express.Router();
const Secret = require("../controllers/secret");
const Users = require("../controllers/users");
const Posts = require("../controllers/posts");
const Groups = require("../controllers/groups");
// criar, retrieve e editar user
// POST "/api/users/" (campos no body)
// GET "/api/users/:userat"
// PUT "api/users/:userat"

// visualizar perfil do user
// GET "/api/users/:at/profile"

/* Register user in DB. */
router.post("/", async function(req, res, next) {
  try {
    //verificar se os at estao disponiveis para o grupo e para o utilizador
    let group = await Groups.findByAt(req.body.at);
    let user = await Users.Search(req.body.at);
    let userEmail = await Users.findByEmail(req.body.email);
    //se nao, enviar erro
    if (group || user) {
      res.status(400).jsonp({
        error: "user or group with that at handle already exists",
        code: -1 //codigo serve apenas para ver se o erro e do mongo ou e do "at", no front end faz-se "if(response.data.code...)"
      });
    } else if (userEmail) {
      res.status(400).jsonp({
        error: "taht email already is in use",
        code: -2
      });
    } else {
      //se sim, inserir utilizador e criar um grupo com at igual ao at do utilizador

      //confirma que o utilizador segue a sua propria pagina
      //caso nao exista este array no body, cria-o
      if (!req.body.following) {
        req.body.following = [req.body.at];
      } else if (!req.body.following.includes(req.body.at)) {
        //caso o array esista mas este at nao esteja dentro, adiciona este ao array
        req.body.following.push(req.body.at);
      }

      let user = await Users.insertNew(req.body);
      user.password = "";
      let groupFields = {
        name: "Página de " + req.body.name,
        at_creator: req.body.at,
        at: req.body.at,
        members: [
          {
            _id: user._id,
            name: req.body.name,
            email: req.body.email,
            at: req.body.at
          }
        ],
        invited: [],
        public: true
      };
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

/* Search user by "email" field */
router.get("/email/:email", async (req, res, next) => {
  try {
    res.jsonp(await Users.findByEmail(req.params.email));
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
    let posts = await Posts.findByGroupAt(req.params.at);
    res.jsonp({ user, posts });
  } catch (e) {
    res.status(400).jsonp(error);
  }
});

/* Fetch posts from groups where user belongs */
router.get("/:at/feed", async (req, res, next) => {
  if (req.query.apikey == Secret.apikey) {
    try {
      let user = await Users.Search(req.params.at);
      let posts = await Posts.findByGroupArray(user.following);
      res.jsonp(posts);
    } catch (e) {
      res.status(400).jsonp(error);
    }
  } else {
    res.status(403).send("API key inválida");
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
