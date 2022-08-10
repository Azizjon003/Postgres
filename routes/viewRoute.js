const Router = require("express").Router();
const password = require("passport");
Router.get("/", (req, res) => {});

Router.get("/home", (req, res) => {
  res.render("signup");
});
Router.get("/user", (req, res) => {
  res.render("user");
});
Router.get("/failed", (req, res) => {
  res.send("wrong google authentificate");
});
Router.get(
  "/login",
  password.authenticate("google", { scope: ["profile", "email"] })
);
Router.get(
  "/login/callback",
  password.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    console.log("req.user", req.user);
    res.redirect("/user");
  }
);
Router.get("/verify", (req, res, next) => {
  console.log(req.cookies);
  res.render("verify");
});
Router.get("/verifySms", (req, res, next) => {
  res.render("verifySms");
});

module.exports = Router;
