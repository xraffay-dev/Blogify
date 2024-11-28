const { Router } = require("express");
const Blog = require("../models/blog");
// const user = require("../models/user"); CODE WORKING WITHOUT IT WHY HOW?
const multer = require("multer");
//WHY?
const path = require("path");
const router = Router();

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const fileID = `${Date.now()}-${file.originalname}`;
    cb(null, fileID);
  },
});

const upload = multer({ storage });

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  console.log(blog);
  return res.render("blog", {
    user: req.user,
    blog,
  });
});

//Why /
router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  //console.log(req.file); STUDY
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
