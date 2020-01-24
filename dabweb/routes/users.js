var express = require("express");
var router = express.Router();
var axios = require("axios");
var bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("*", function(req, res, next) {
  res.locals.authenticated = req.user ? true : false;
  next();
});

module.exports = router;

// GET "/users/:at" - ver página de utilizador

// GET "/users/edit" - render da pagina de editar utilizador
// POST "/users/edit" - editar utilizador

// POST "/users/:at/follow" - seguir utilizador
// POST "/users/:at/unfollow" - deixar de seguir utilizador

/*
router.get("/", (req, res, next) => {
  res.redirect("/");
});


router.get("/register", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
    //this return avoids error of "cannot set headers after they are sent to the client"
    //and also helps keep code clean so I don't have to wrap everything else in an else{} block
    return;
  }
  res.render("register_user");
});


router.post("/register", (req, res, next) => {
  //hash password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error(err);
    } else {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          console.error(err);
        } else {
          //enviar tudo para o backend
          axios
            .post("http://localhost:5000/api/users/", {
              name: req.body.name,
              email: req.body.email,
              password: hash,
              at: req.body.at
            })
            .then(response => {
              res.redirect("/?registered=true");
            })
            .catch(error => {
              console.log(error);
            });
          //receber respota do backend (sucesso/insucesso) e agir de acordo com o resultado
            .then(resdata => {
              if (resdata.data.added == true) {
                res.redirect("/?registered=true");
              } else {
                res.render("register_user", {
                  message: "Email já existe",
                  name: req.body.name,
                  email: req.body.email,
                  cursos: ["MIEI"]
                });
              }
            })
            .catch(e => console.error(e));
        }
      });
    }
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/"
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});
*/
