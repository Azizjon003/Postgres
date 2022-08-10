let dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const { Sequelize, DataTypes, Op } = require("sequelize");
const db = process.env.DB;
const db_User = process.env.DB_USER;
const db_Pass = process.env.DB_PASS;
let sequialize = new Sequelize(db, db_User, db_Pass, {
  host: "localhost",
  dialect: "postgres",
});

sequialize
  .authenticate()
  .then(() => {
    console.log("Postgresql connected succesfully");
  })
  .catch((err) => {
    console.log(err.message);
  });
let Db = {};

Db.sequialize = sequialize;
Db.Op = Op;
Db.user = require("./userModel")(sequialize, DataTypes);
Db.googleUser = require("./googleUser")(sequialize, DataTypes);
Db.test = require("./test")(sequialize, DataTypes);
Db.mavzu = require("./mavzu")(sequialize, DataTypes);
// Db.sequialize
//   .sync({
//     force: true,
//     alter: true,
//   })
//   .then(() => {
//     console.log("ishla");
//   });

module.exports = Db;
