const express = require("express");
const errorController = require("../controller/errorController");
const app = express();
const Router = require("../routes/userRoute");
const viewRouter = require("../routes/viewRoute");
const password = require("passport");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(express.static(`${__dirname}/../public`));
app.use(cookieParser());
app.set("view engine", "pug");
app.set("views", `${__dirname}/../views`);

app.use(cors());
require("../controller/googleAuth");
app.use("/api/v1/users", Router);

app.use(
  expressSession({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);
app.use(password.initialize());
app.use(password.session());
app.use("/", viewRouter);
app.use(errorController);
module.exports = app;
