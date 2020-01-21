var express = require("express");
var router = express.Router();

const Posts = require("../controllers/posts");

// criar post, apagar, editar, visualizar um, visualizar todos de um grupo

// POST /api/posts/ (campos no body)
// DELETE /api/posts/:postid
// PUT /api/posts/:postid
// GET /api/posts/:postid
// GET /api/posts/group/:groupat

router.get("/", async (req, res, next) => {
  try {
    let posts = await Posts.get();
    res.jsonp(posts);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    req.body.text = req.body.text.trim();
    let post = await Posts.insertNew(req.body);
    console.log("New post inserted by " + req.body.email);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

module.exports = router;
