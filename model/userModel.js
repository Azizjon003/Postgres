const validator = require("validator");
const bcrypt = require("bcryptjs");
let userModel = function (sequalize, DataTypes) {
  const user = sequalize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 5,
          max: 20,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isLowercase: true,
          emailIs: function (val) {
            if (!validator.isEmail(val)) {
              throw new Error("nu qiymat email emas");
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 8,
          max: 20,
          strongPass(value) {
            if (!validator.isStrongPassword(value)) {
              throw new Error(
                "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
              );
            }
          },
        },
      },
      passwordConfirm: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          min: 8,
          max: 20,
          passConfirm(value) {
            if (value !== this.password) {
              throw new Error("Only even values are allowed! bir xilku");
            }
          },
        },
      },
      role: {
        type: DataTypes.ENUM,
        values: ["admin", "user"],
        defaultValue: "user",
      },
      hashToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tokenExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      emailActiv: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      randomSon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emailExpires: {
        type: DataTypes.DATE,
      },
    },
    {
      createdAt: false,
      updatedAt: false,
      id: DataTypes.UUID,
    }
  );
  user.beforeSave(async function (user) {
    if (!user.changed("password")) return;
    const hashPass = await bcrypt.hash(user.password, 12);
    user.password = hashPass;
    user.passwordConfirm = undefined;
  });
  user.afterUpdate(async function (user) {
    console.log(user);
  });
  return user;
};

module.exports = userModel;
