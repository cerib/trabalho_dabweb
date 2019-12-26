var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  let registered = req.query.registered;
  if (registered) {
    console.log("---");
    console.log(registered);
    res.render("index", {
      authenticated: req.isAuthenticated(),
      message: "Registado com sucesso!"
    });
  } else if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.render("index");
  }
});

module.exports = router;
