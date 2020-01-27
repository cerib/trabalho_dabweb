var express = require("express");
var router = express.Router();

const Posts = require("../controllers/posts");
const Groups = require("../controllers/groups");

// POST /api/files/addfile/:postid
// GET /api/files/getfile/:fileid/

router.post("/addfile/:postid", async (req, res, next) => {
  try {
    let addFileRes = await Posts.addFile(req.params.postid, req.body);
    res.jsonp(addFileRes);
  } catch (error) {
    res.jsonp(error);
  }
});

router.get("/getfile/:fileid/", async (req, res, next) => {
  try {
    let file = await Posts.getFileById(req.params.fileid);
    res.jsonp(file[0]);
  } catch (error) {
    res.jsonp(error);
  }
});

module.exports = router;
