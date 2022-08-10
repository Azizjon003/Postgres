const express = require("express");
const Router = express.Router();
const obj = require("../controller/theme");
const auth = require("../controller/authController");
Router.route("/").post(obj.add).get(auth.protect, obj.getAll);
Router.route("/:id").get(obj.getOne).patch(obj.update).delete(obj.deleteData);

module.exports = Router;
