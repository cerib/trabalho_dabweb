var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  let registered = req.query.registered;
  if (registered) {
    console.log("---");
    console.log(registered);
    res.render("index", { message: "Registado com sucesso!" });
  } else {
    res.render("index");
  }
});

module.exports = router;
