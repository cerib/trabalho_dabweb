var express = require("express");
var router = express.Router();

var multer = require("multer");
var upload = multer({ dest: "uploads/" });

const Posts = require("../controllers/posts");
const Groups = require("../controllers/groups");

// POST /api/files/addfile/:postid
// GET /api/files/getfile/:fileid/:postid

router.post(
  "/addfile/:postid",
  upload.single("file"),
  async (req, res, next) => {
    try {
      let fileFields = {
        date: new Date(),
        name: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        userAt: req.body.userat
      };
      let addFileRes = await Posts.addFile(req.params.postid, fileFields);
      res.redirect("back");
    } catch (error) {
      res.jsonp(error);
    }
  }
);

module.exports = router;
