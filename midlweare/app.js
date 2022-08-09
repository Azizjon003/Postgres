const express = require("express");
const errorController = require("../controller/errorController");
const app = express();
const Router = require("../routes/userRoute");
const password = require("passport");
const cookeiSession = require("cookie-session");

app.use(express.json());
app.use(express.static(`${__dirname}/../public`));

app.set("view engine", "pug");
app.set("views", `${__dirname}/../views`);

require("../controller/googleAuth");
app.use("/api/v1/users", Router);

app.use(password.initialize());
app.use(password.session());
app.use(
  cookeiSession({
    name: "tuto-session",
    keys: ["key1", "key2"],
  })
);
app.get("/home", (req, res) => {
  res.render("login");
});
app.get("/user", (req, res) => {
  res.render("user");
});
app.get("/failed", (req, res) => {
  res.send("wrong google authentificate");
});
app.get(
  "/login",
  password.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/login/callback",
  password.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    res.redirect("/user");
  }
);
app.use(errorController);
module.exports = app;
