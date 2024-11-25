const { Router } = require("express");
const User = require("../models/user.js");
//  const {User} = ....................
const router = Router();

router.get("/signin", (req, res) => {
  res.render("signin.ejs");
});

router.post("/signin", async (req, res) => {
  const {email, password} = req.body;
  console.log(req.body);
  const token = await User.matchPassword(email, password);
  // console.log(token);
  res.redirect("/");
});

router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  res.redirect("signin");
});

module.exports = router;
