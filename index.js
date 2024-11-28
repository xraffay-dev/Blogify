const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require("./routes/user.js");
const blogRouter = require("./routes/blog.js");

const cookieParser = require("cookie-parser");
const checkForAuthentication = require("./middlewares/user.js");
const Blog = require("./models/blog.js");

const app = express();
const PORT = 8000;

mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (err) {
    console.error("Error fetching blogs:", err);
  }
});

app.use("/user", userRoute);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
