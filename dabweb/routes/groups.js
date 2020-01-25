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

// GET /groups/:at - ver pagina de grupo

// POST /groups/ - criar novo grupo
// GET /groups/:at/edit - render pagina editar grupo
// POST /groups/:at/ - editar grupo (campos no body)

// GET /groups/:at/follow - seguir grupo
// GET /groups/:at/unfollow - para de seguir grupo

/* GET dashboard home. */
router.get("/", ensureAuthenticated, async (req, res) => {
  res.render("groups/groups_index");
});

router.post("/new", ensureAuthenticated, async (req, res) => {});

module.exports = router;
