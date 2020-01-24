var express = require("express");
var router = express.Router();

var axios = require("axios");
var bcrypt = require("bcryptjs");
const passport = require("passport");

const { ensureAuthenticated } = require("../config/auth");

router.get("*", function(req, res, next) {
  res.locals.authenticated = req.user ? true : false;
  next();
});

// GET "/" - Pagina inicial, se logged out mostrar form de registo, se logged in redireccionar para "/feed"
// POST "/register" - registo
// POST "/login" - login
// POST "/logout" - logout

// GET "/feed" - Pagina inicial quando logged in, mostra posts de todos os grupos que segue
// POST "/search" - procurar cenas, #=hashtags, @=ats de grupo ou pessoas, resto=nome de pessoa

/* GET home page. */
router.get("/", function(req, res, next) {
  let registered = req.query.registered;
  if (registered === "true") {
    res.render("register_user", {
      message: "Registado com sucesso!"
    });
  } else if (req.isAuthenticated()) {
    res.redirect("/feed");
  } else {
    res.render("register_user");
  }
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
              let code = error.response.data.code;
              if (code === -1) {
                //at ja existe
                res.render("register_user", {
                  message: "Esse handle já está em uso",
                  ...req.body
                });
              } else if (code === -2) {
                //email ja existe
                res.render("register_user", {
                  message: "Esse email já está em uso",
                  ...req.body
                });
              } else {
                res.render("register_user", {
                  message: "Ocorreu um erro"
                });
              }
            });
        }
      });
    }
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/feed",
    failureRedirect: "/"
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/feed", ensureAuthenticated, async (req, res) => {
  try {
    //posts de todos os grupos que o user segue
    let response = await axios.get(
      `http://localhost:5000/api/users/${req.user.at}/feed`
    );
    res.locals.user = req.user;
    delete res.locals.user.password;
    res.render("./feed/feed", {
      posts: response.data
    });
  } catch (error) {
    res.jsonp(error);
  }
});

router.get("/search", ensureAuthenticated, async (req, res) => {
  try {
    let searchterm = req.query.searchterm;
    console.log(searchterm.trim("#"));
    if (searchterm.length > 2) {
      if (searchterm[0] === "@") {
        // procura por grupos e utilizadores atraves do at
        let response = await axios.get(
          `http://localhost:5000/api/groups/${searchterm.slice(1)}`
        );
        res.jsonp(response.data);
      } else if (searchterm[0] === "#") {
        // procura por posts com a hashtag
        let response = await axios.get(
          `http://localhost:5000/api/posts/hashtags?hashtag=${searchterm.replace(
            /^#+/,
            ""
          )}`
        );
        res.jsonp(response.data);
      } else {
        // Procura por utilizadores atraves do nome
      }
    } else {
      res.redirect("/feed");
    }
  } catch (error) {
    res.jsonp(error);
  }
});

module.exports = router;
