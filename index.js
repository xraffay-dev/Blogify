const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require("./routes/user.js");

const app = express();
const PORT = 8000;

mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then((e) => console.log("MongoDB Connected"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
