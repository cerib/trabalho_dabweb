var express = require("express");
var router = express.Router();

var axios = require("axios");
var bcrypt = require("bcryptjs");
const passport = require("passport");

const { ensureAuthenticated } = require("../config/auth");

router.get("*", function(req, res, next) {
  res.locals.authenticated = req.user ? true : false;
  if (req.user) {
    res.locals.user = req.user;
    delete res.locals.user.password;
  }
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

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/feed", ensureAuthenticated, async (req, res) => {
  try {
    //posts de todos os grupos que o user segue
    let response = await axios.get(
      `http://localhost:5000/api/users/${req.user.at}/feed`
    );
    res.render("./feed/feed", {
      posts: response.data
    });
  } catch (error) {
    res.jsonp(error.response.data);
  }
});

router.get("/search", ensureAuthenticated, async (req, res) => {
  try {
    let searchterm = req.query.searchterm;
    if (searchterm.length > 2) {
      if (searchterm[0] === "@") {
        // procura por grupos e utilizadores atraves do at
        let type = 0;
        try {
          let response = await axios.get(
            `http://localhost:5000/api/groups/search/${searchterm.slice(1)}/${
              req.user.at
            }`
          );
          //type = 0 - user nao segue user
          //type = 1 - user foi convidado
          //type = 2 - user pertence ao grupo
          //type = 3 - user nao pertence mas grupo é publico
          //type = 4 - user segue user
          //console.log(response == "");
          //console.log(response.data.members.some(m => m.at == req.user.at));
          //retira o proprio user
          if (req.user.at != response.data.at) {
            //se for um grupo
            if (response.data.at != response.data.at_creator) {
              //e o user estiver invited
              if (response.data.invited.some(i => i.at == req.user.at)) {
                type = 1;
                //group.members.some(m => m.at === req.params.userat
              } else if (response.data.members.some(m => m.at == req.user.at)) {
                //e o user pertencer ao grupo
                type = 2;
              } else {
                //grupo publico
                type = 3;
              }
              //se nao for um grupo é um usergroup
            } else {
              if (response.data.members.some(m => m.at == req.user.at)) {
                //alguem a quem o user já deu follow
                type = 4;
              } else {
                //ja nao preciso deste caso mas vou deixar estar anyways
                type = 0; //alguém que o user ainda nao seguiu
              }
            }
          } else {
            //response.data = "";
            type = -1;
          }

          console.log(response.data);
          res.render("searchresults", { result: response.data, type: type });
        } catch (error) {
          type = -1;
          res.render("searchresults", { result: "", type: type });
        }

        //console.log("Response\n");
        //console.log("rd: ");
      } else if (searchterm[0] === "#") {
        // procura por posts com a hashtag (remove o # porque se nao nao funciona)
        let response = await axios.get(
          `http://localhost:5000/api/posts/hashtags/${searchterm.replace(
            /^#+/,
            ""
          )}`
        );
        //res.header("Content-Type", "application/json");
        //res.send(JSON.stringify(response.data, null, 4));
        console.log(response.data);
        let allowedToViewPosts = response.data.filter(post =>
          req.user.following.includes(post.groupAt)
        );
        res.render("searchresultsht", { result: allowedToViewPosts });
      } else {
        //ta mal nao estamos a pesquisar grupos aqui
        res.jsonp({ error: "Search without @ or # not available yet" });
      }
    } else {
      res.redirect("/feed");
    }
  } catch (error) {
    res.jsonp(error.response.data);
  }
});

module.exports = router;
