const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const checkForAuthentication = require("./middlewares/user.js");

const app = express();
const PORT = 8000;

mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.set("view engine", "ejs");

//app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication("token"));

app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
  });
});

app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
