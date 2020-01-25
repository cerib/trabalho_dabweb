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

//só pra teste
router.get("/dab1", (req, res, next) => {
  res.redirect("/");
});

//por enquanto é necessário aceder pela página: http://localhost:7777/groups/new
//Depois adiciona-se o botão create grou que invoca este get.
router.get("/new", ensureAuthenticated, (req, res) => {
  console.log("\n\n\nInvocar a pagina de criar grupo\n\n");
  if (req.session.code) {
    let message = req.session.message;
    let body = req.session.body;
    req.session.body = null;
    req.session.message = null;
    req.session.code = null;
    res.render("groups/create_group", {
      ...body,
      message: message
    });
  } else if (req.session.message) {
    let message = req.session.message;
    req.session.message = null;
    res.render("groups/create_group", { message: message });
  } else {
    res.render("groups/create_group");
  }
});

router.post("/create", ensureAuthenticated, (req, res, next) => {
  //enviar tudo para o backend
  axios
    .post("http://localhost:5000/api/groups/", {
      name: req.body.name,
      at_creator: req.user.at,
      at: req.body.at,
      public: req.body.public == "1" ? true : false
    })
    .then(response => {
      req.session.message = "Grupo criado com sucesso!";
      res.redirect("/groups/new");
    })
    .catch(error => {
      let code = error.response.data.code;
      if (code === -1) {
        //at do user nao existe
        req.session.code = code;
        req.session.message = "At do user não existe";
        req.session.body = req.body;
        res.redirect("/groups/new");
      } else if (code === -2) {
        //at do grupo já utilizado
        req.session.code = code;
        req.session.message = "At do grupo já utilizado";
        req.session.body = req.body;
        res.redirect("/groups/new");
      } else {
        req.session.code = -3;
        req.session.message = "Ocorreu um erro";
        req.session.body = req.body;
        res.redirect("/groups/new");
      }
    });
});

// GET /groups/:at - ver pagina de grupo

// GET /groups/:at - ver pagina de grupo
router.get("/:at", ensureAuthenticated, async (req, res, next) => {
  try {
    //request ao backend de groups/at
    let response = await axios.get(
      `http://localhost:5000/api/groups/${req.url.split("/").pop()}`
    );
    res.locals.user = req.user;
    delete res.locals.user.password;
    //A pagina vai ser basicamente a mesma coisa
    res.render("./feed/feed", {
      posts: response.data.group.posts
    });
  } catch (error) {
    res.jsonp(error);
  }
});

// POST /groups/ - criar novo grupo
// GET /groups/:at/edit - render pagina editar grupo
// POST /groups/:at/ - editar grupo (campos no body)

// GET /groups/:at/follow - seguir grupo
// GET /groups/:at/unfollow - para de seguir grupo

/* GET dashboard home. */
router.get("/", ensureAuthenticated, async (req, res) => {
  res.render("groups/groups_index");
});

//router.post("/new", ensureAuthenticated, async (req, res) => {});

module.exports = router;
