const express = require("express");
const errorController = require("../controller/errorController");
const app = express();

const Router = require("../routes/userRoute");
const viewRouter = require("../routes/viewRoute");
const fanRouter = require("../routes/fan");
const themeRouter = require("../routes/themeRoute");
const testRouter = require("../routes/testRoute");

const password = require("passport");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Api = require("twilio/lib/rest/Api");

app.use(express.json());
app.use(express.static(`${__dirname}/../public`));
app.use(cookieParser());
app.set("view engine", "pug");
app.set("views", `${__dirname}/../views`);

app.use(cors());
require("../controller/googleAuth");

app.use("/api/v1/users", Router);
app.use("/api/v1/fan", fanRouter);
app.use("/api/v1/theme", themeRouter);
app.use("/api/v1/test", testRouter);
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
