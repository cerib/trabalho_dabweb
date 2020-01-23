var express = require("express");
var router = express.Router();

const axios = require("axios");
const { ensureAuthenticated } = require("../config/auth");

router.get("*", function(req, res, next) {
  res.locals.authenticated = req.user ? true : false;
  next();
});

// GET /groups/:at - ver pagina de grupo

// POST /groups/ - criar novo grupo
// GET /groups/:at/edit - render pagina editar grupo
// POST /groups/:at/ - editar grupo (campos no body)

// POST /groups/:at/follow - seguir grupo
// POST /groups/:at/unfollow - para de seguir grupo

/* GET dashboard home. */
router.get("/", ensureAuthenticated, async (req, res) => {
  res.render("groups/groups_index");
});

router.post("/new", ensureAuthenticated, async (req, res) => {});

module.exports = router;
