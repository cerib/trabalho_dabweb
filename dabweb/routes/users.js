var express = require("express");
var router = express.Router();

/* Redirect to home page */
router.get("/", (req, res, next) => {
  res.redirect("/");
});

/* GET users register page */
router.get("/register", function(req, res, next) {
  res.render("register_user", { cursos: ["MIEI"] });
});

/* Insert user in database */
router.post("/register", (req, res, next) => {
  //verificar no backend se pode registar
  res.send("Verificar no backend");
});
module.exports = router;
