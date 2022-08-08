const express = require("express");
const errorController = require("../controller/errorController");
const app = express();
const Router = require("../routes/userRoute");

app.use(express.json());
app.use(express.static(`${__dirname}/../public`));
app.set("view engine", "pug");
app.set("views", `${__dirname}/../views`);
app.use("/api/v1/users", Router);
app.use("/home", (req, res) => {
  res.render("reset");
});

app.use(errorController);
module.exports = app;
