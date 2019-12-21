var express = require("express");
var router = express.Router();
var axios = require("axios");
var bcrypt = require("bcryptjs");

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
  console.log(req.body);
  //hash password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error(err);
    } else {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          console.error(err);
        } else {
          axios
            .post("http://localhost:5000/users/register", {
              name: req.body.name,
              email: req.body.email,
              password: hash,
              course: req.body.course
            })
            .then(response => res.jsonp(response.data))
            .catch(e => console.error(e));
        }
      });
    }
  });
  //enviar tudo para o backend
  //receber respota do bakend (sucesso/insucesso) e agir de acordo com o resultado
});
module.exports = router;
