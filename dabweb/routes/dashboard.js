var express = require("express");
var router = express.Router();

const { ensureAuthenticated } = require("../config/auth");

/* GET dashboard home. */
router.get("/", ensureAuthenticated, function(req, res) {
  res.render("dashboard_main", { authenticated: true, email: req.user.email });
});

module.exports = router;
