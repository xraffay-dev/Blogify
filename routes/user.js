const { Router } = require("express");
const User = require("../models/user.js");
//  const {User} = ....................

const router = Router();

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    // console.log(`Token Generated: ${token}`);
    res.cookie("token", token).redirect("/");
  } catch (error) {
    console.error("Login error:", error.message);
    return res.render("signin", { error: "Incorrect Login or Password" });
  }
});

router.get("/signup", (req, res) => {
  res.render("signup");
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

router.get("/signout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
