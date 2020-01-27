var express = require("express");
var router = express.Router();

const axios = require("axios");
const { ensureAuthenticated } = require("../config/auth");
const fs = require("fs-extra");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });

router.get("*", function(req, res, next) {
  res.locals.authenticated = req.user ? true : false;
  if (req.user) {
    res.locals.user = req.user;
    delete res.locals.user.password;
  }
  next();
});

// POST /posts/:groupat - postar um post
// GET /posts/:id/edit - pag de ver edit post - nao esta feita porque temos modal
// POST /posts/:id/edit - editar um post
// POST /posts/:id/delete - apagar um post
// GET /posts/:id - visao geral do post

router.post("/:groupat", ensureAuthenticated, async (req, res) => {
  if (!req.user.following.includes(req.params.groupat)) {
    res.jsonp({ error: "You can't post in a group you don't follow" });
  } else {
    try {
      let response = await axios.get(
        `http://localhost:5000/api/groups/${req.params.groupat}`
      );
      //verificar se o grupo se trata de uma pagina pessoal. Se sim, so deixa postar se for o dono da pagina
      let group = response.data;
      if (group.at === group.at_creator && req.user.at !== group.at_creator) {
        //nao dono da pagina pessoal a tentar postar
        res.jsonp({ error: "You can't post in someone else's profile" });
      } else {
        let postResponse = await axios.post(
          "http://localhost:5000/api/posts/",
          {
            ...req.body,
            author: req.user.name,
            authorAt: req.user.at,
            hashTags: req.body.text.match(/(#[A-z0-9]+)/g),
            groupAt: req.params.groupat
          }
        );
        res.redirect("back");
      }
    } catch (error) {
      res.status(400).jsonp(error);
    }
  }
});

router.post("/:id/edit", ensureAuthenticated, async (req, res) => {
  try {
    //verifica se e o autor do post
    let post = await axios.get(
      "http://localhost:5000/api/posts/" + req.params.id
    );
    if (post.data.authorAt !== req.user.at) {
      res.status(400).jsonp({ error: "You can't edit someone else's post" });
    } else {
      let response = await axios.put(
        "http://localhost:5000/api/posts/" + req.params.id,
        {
          text: req.body.text,
          hashTags: req.body.text.match(/(#[A-z0-9]+)/g)
        }
      );
      res.sendStatus(200);
    }
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

router.post("/:id/delete", ensureAuthenticated, async (req, res) => {
  try {
    //verifica se e o autor do post
    let post = await axios.get(
      "http://localhost:5000/api/posts/" + req.params.id
    );
    if (post.data.authorAt !== req.user.at) {
      res.status(400).jsonp({ error: "You can't delete someone else's post" });
    } else {
      let response = await axios.delete(
        "http://localhost:5000/api/posts/" + req.params.id
      );
      res.redirect(req.get("referer"));
    }
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

router.get("/downloadfile/:fileid/", ensureAuthenticated, async (req, res) => {
  try {
    let fileInfo = await axios.get(
      `http://localhost:5000/api/files/getfile/${req.params.fileid}/`
    );
    res.jsonp(fileInfo.data);
  } catch (error) {
    res.jsonp(error.response.data);
  }
});

router.post(
  "/:postid/uploadfile",
  upload.single("file"),
  ensureAuthenticated,
  async (req, res) => {
    try {
      //verifica se e o autor do post
      let post = await axios.get(
        "http://localhost:5000/api/posts/" + req.params.postid
      );

      if (post.data.authorAt !== req.user.at) {
        res.status(400).jsonp({ error: "You can't edit someone else's post" });
      } else {
        let oldPath = __dirname + "/../" + req.file.path;
        let newPath = `${__dirname}/../public/ficheiros/${req.user.at}/${req.file.filename}`;

        if (
          !fs.pathExistsSync(`${__dirname}/../public/ficheiros/${req.user.at}/`)
        ) {
          fs.mkdirsSync(`${__dirname}/../public/ficheiros/${req.user.at}/`);
        }

        fs.rename(oldPath, newPath, function(err) {
          if (err) {
            throw err;
          }
        });

        let fileFields = {
          date: new Date(),
          name: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          userAt: req.body.userat,
          path: `/../public/ficheiros/${req.user.at}/${req.file.filename}`
        };
        let response = await axios.post(
          `http://localhost:5000/api/files/addfile/${req.params.postid}`,
          fileFields
        );
        res.redirect(req.get("referer"));
      }
    } catch (error) {
      res.status(400).jsonp(error);
    }
  }
);

module.exports = router;
