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
  res.render("groups/groups_index");
});

router.post("/new", ensureAuthenticated, async (req, res) => {});

module.exports = router;
