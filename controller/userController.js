const Db = require("../model");
const User = Db.user;
const responseFunc = async (res, statusCode, status, data) => {
  res.status(statusCode).json({
    status: status,
    data: data,
  });
};
const add = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, role } = req.body;
    // if (password !== passwordConfirm) {
    //   return responseFunc(
    //     res,
    //     400,
    //     "error",
    //     "Password and confirm password not match"
    //   );
    // }

    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
    });

    responseFunc(res, 201, "success", user);
  } catch (err) {
    responseFunc(res, 400, "error", err.message);
  }
};

const getAll = async (req, res, next) => {
  try {
    const users = await User.findAll();
    responseFunc(res, 201, "success", users);
  } catch (err) {
    responseFunc(res, 400, "error", err.message);
  }
};
const getOne = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    responseFunc(res, 200, "success", user);
  } catch (err) {
    responseFunc(res, 400, "error", err.message);
  }
};
const update = async (req, res, next) => {
  try {
    const user = await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    responseFunc(res, 200, "success", user);
  } catch (err) {
    responseFunc(res, 400, "error", err.message);
  }
};

const deleteData = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.destroy({
      where: {
        id,
      },
    });
    responseFunc(res, 204, "success", user);
  } catch (err) {
    responseFunc(res, 400, "error", err.message);
  }
};
module.exports = { add, getAll, getOne, update, deleteData };
