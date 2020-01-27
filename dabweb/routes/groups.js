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

// POST /groups/ - criar novo grupo
// GET /groups/:at/edit - render pagina editar grupo
// POST /groups/:at/ - editar grupo (campos no body)

// GET /groups/:at/follow - seguir grupo/ aceita convite
// GET /groups/:at/unfollow - para de seguir grupo
// GET /groups/:at/reject - rejeita convite

//Depois adiciona-se o botão create grou que invoca este get.
router.get("/new", ensureAuthenticated, (req, res) => {
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
router.get("/:groupat/", ensureAuthenticated, async (req, res) => {
  try {
    let response = await axios.get(
      "http://localhost:5000/api/groups/" + req.params.groupat
    );
    let public = response.data.public;
    if (!public && !req.user.following.includes(req.params.groupat)) {
      res.jsonp({ error: "You don't have permissions to view this group" });
    } else {
      res.render("groups/group_view", {
        group: response.data,
        isownprofile: response.data.at === req.user.at,
        canpost:
          req.user.following.includes(req.params.groupat) &&
          (response.data.at !== response.data.at_creator ||
            response.data.at_creator === req.user.at)
      });
    }
  } catch (error) {
    res.jsonp(error.response.data);
  }
});

/*
router.get("", async (req, res, next) => {
  try {
  } catch (error) {
    res.jsonp(error.response.data);
  }
});
*/

/* Invite to group */
router.post("/:groupat/invite", ensureAuthenticated, async (req, res) => {
  try {
    // /api/groups/:groupat/invite/:invitedat
    let response = await axios.post(
      `http://localhost:5000/api/groups/${req.params.groupat}/invite/${req.body.invitedat}`
    );
    //dar alguma indicacao se deu bem ou mal
    res.redirect("/groups");
  } catch (error) {
    res.jsonp(error.response.data);
  }
});

/* Accept invite/ follow public group */
router.get("/:groupat/follow", ensureAuthenticated, async (req, res) => {
  try {
    let response = await axios.get(
      "http://localhost:5000/api/groups/" + req.params.groupat
    );
    let public = response.data.public;
    //verificar se utilizador esta na lista de convidados
    if (!public && !req.user.invites.includes(req.params.groupat)) {
      res.jsonp({ error: "You haven't been invited to that group" });
    } else {
      response = await axios.post(
        `http://localhost:5000/api/groups/follow/${req.params.groupat}/${req.user.at}`
      );
      res.redirect("/groups");
    }
  } catch (error) {
    res.jsonp(error.response.data);
  }
});

/* Unfollow group */
router.get("/:groupat/unfollow", ensureAuthenticated, async (req, res) => {
  //como a route utilizada para rejeitar o convite e a mesma do unfollow, e preciso verificar se o user tb nao e o criador do grupo
  try {
    let response = await axios.get(
      "http://localhost:5000/api/groups/" + req.params.groupat
    );

    if (response.data.at_creator === req.user.at) {
      res.jsonp({ error: "You can't unfollow your own group" });
    } else {
      response = await axios.delete(
        `http://localhost:5000/api/groups/unfollow/${req.params.groupat}/${req.user.at}`
      );
      res.redirect("/groups");
    }
  } catch (error) {
    res.jsonp(error.response.data);
  }
});

/* Reject invite */
router.get("/:groupat/reject", ensureAuthenticated, async (req, res) => {
  //como a route utilizada para rejeitar o convite e a mesma do unfollow, e preciso verificar se o user tb nao e o criador do grupo
  try {
    let response = await axios.post(
      `http://localhost:5000/api/groups/${req.params.groupat}/invite/${req.user.at}/reject`
    );
    res.redirect("/groups");
  } catch (error) {
    res.jsonp(error.response.data);
  }
});

/* GET groups home. */
router.get("/", ensureAuthenticated, async (req, res) => {
  // buscar informacao dos grupos relevante para o utilizador actual (convites, grupos que criou, grupos que segue)
  try {
    let response = await axios.get(
      "http://localhost:5000/api/groups/usergroups/" + req.user.at
    );

    // busca os grupos que criou e ao mesmo tempo preenche a lista dos grupos que nao criou mas segue
    let following = [];
    let created = response.data.following.filter(group => {
      if (group.at_creator !== req.user.at) {
        following.push(group);
      }
      return group.at_creator === req.user.at;
    });
    let invites = response.data.invites;
    //res.setHeader("Content-Type", "application/json");
    /* res.end(
      JSON.stringify(
        { following: following, created: created, invites: invites },
        null,
        3
      )
    ); */
    res.render("groups/groups_index", {
      following: following,
      created: created,
      invites: invites
    });
  } catch (error) {
    res.jsonp(error.response.data);
  }
  //let groups = res.render("groups/groups_index");
});

//router.post("/new", ensureAuthenticated, async (req, res) => {});

module.exports = router;
