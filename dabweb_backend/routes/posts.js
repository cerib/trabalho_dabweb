var express = require("express");
var router = express.Router();

const Posts = require("../controllers/posts");

// criar post, apagar, editar, visualizar um, visualizar todos de um grupo

// POST /api/posts/ (campos no body)
// DELETE /api/posts/:postid
// PUT /api/posts/:postid
// GET /api/posts/:postid
// GET /api/posts/group/:groupat

router.post("/", async (req, res, next) => {
  try {
    res.jsonp(await Posts.insertNew(req.body));
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

router.delete("/:postid", async (req, res, next) => {
  try {
    res.jsonp(await Posts.deleteById(req.params.postid));
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

router.put("/:postid", async (req, res, next) => {
  try {
    await Posts.editById(req.params.postid, req.body.text, req.body.hashtags);
    res.sendStatus(200);
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    res.jsonp(await Posts.findById(req.params.id));
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

router.get("/group/:groupat", async (req, res, next) => {
  try {
    res.jsonp(await Posts.findByGroupAt(req.params.groupat));
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

module.exports = router;
