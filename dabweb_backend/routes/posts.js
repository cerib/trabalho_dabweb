var express = require("express");
var router = express.Router();

const Posts = require("../controllers/posts");
const Groups = require("../controllers/groups");
// criar post, apagar, editar, visualizar um, visualizar todos de um grupo

// POST /api/posts/ (campos no body)
// DELETE /api/posts/:postid
// PUT /api/posts/:postid
// GET /api/posts/:postid
// GET /api/posts/groups/:groupat

//apagar isto e fazer a route /api/users/:at/feed, ir buscar ao user a partir do at o array
/* router.post("/groups/multiple", async (req, res, next) => {
  try {
    let posts = await Posts.findByGroupArray(req.body.groups);
    res.jsonp(posts);
  } catch (error) {
    res.jsonp(error);
  }
}); */

router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    let postRes = await Posts.insertNew(req.body.groupAt, req.body);
    if (postRes.n === 0) {
      res.status(400).jsonp({
        error: `Group with at ${req.body.groupAt} probably does not exist`,
        code: -1
      });
    } else {
      res.jsonp(postRes);
    }
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

router.delete("/:postid", async (req, res, next) => {
  try {
    await Posts.deleteById(req.params.postid);
    res.sendStatus(200);
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

router.put("/:postid", async (req, res, next) => {
  try {
    await Posts.editById(req.params.postid, req.body.text, req.body.hashTags);
    res.sendStatus(200);
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

router.get("/hashtags/:hashtag", async (req, res, next) => {
  try {
    let hashtag = "#" + req.params.hashtag;
    res.jsonp(await Posts.findByHashTag(hashtag));
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let post = await Posts.findById(req.params.id);
    res.jsonp(post[0]);
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

router.get("/groups/:groupat", async (req, res, next) => {
  try {
    let posts = await Posts.findByGroupAt(req.params.groupat);
    res.jsonp(posts);
  } catch (error) {
    res.status(400).jsonp(error);
  }
});

module.exports = router;
