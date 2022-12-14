const express = require("express");
const Router = express.Router();
const obj = require("../controller/userController");
const auth = require("../controller/authController");
Router.route("/signin").post(auth.signin);
Router.route("/signup").post(auth.login);
Router.route("/updateme").patch(auth.protect, auth.updateMe);
Router.route("/updatepassword").patch(auth.protect, auth.updatePassword);
Router.route("/emailverify").patch(auth.protect, auth.emailVerify);
Router.route("/phoneverify").patch(auth.protect, auth.sendNumberVerifyCode);
Router.route("/verifyphone").patch(auth.protect, auth.verifyCode);
Router.route("/forgotpassword").post(auth.forgotPassword);
Router.route("/resetpassword").patch(auth.resetPassword);
Router.route("/").post(obj.add).get(auth.protect, obj.getAll);
Router.route("/:id").get(obj.getOne).patch(obj.update).delete(obj.deleteData);

module.exports = Router;
