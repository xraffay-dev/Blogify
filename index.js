const express = require("express");
const path = require("path");

const app = express();
const PORT = 8000;

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
