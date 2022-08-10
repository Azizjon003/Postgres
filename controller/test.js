const Db = require("../model");
const Test = Db.test;

console.log(Test);

const responseFunc = async (res, statusCode, status, data) => {
  res.status(statusCode).json({
    status: status,
    data: data,
  });
};
const add = async (req, res, next) => {
  try {
    const { savol, variant, variant1, variant2, togrijavob, userId, mavzuId } =
      req.body;
    const user = await Test.create({
      savol,
      variant,
      variant1,
      variant2,
      togrijavob,
      userId,
      mavzuId,
    });

    responseFunc(res, 201, "success", user);
  } catch (err) {
    responseFunc(res, 400, "error", err.message);
  }
};

const getAll = async (req, res, next) => {
  try {
    const users = await Test.findAll({
      include: {
        model: Db.mavzu,
        include: {
          model: Db.fan,
        },
      },
    });

    const all = await Test.findAll({
      include: Db.user,
    });
    console.log(all);
    responseFunc(res, 201, "success", users);
  } catch (err) {
    responseFunc(res, 400, "error", err.message);
  }
};
const getOne = async (req, res, next) => {
  try {
    const user = await Test.findByPk(req.params.id);
    responseFunc(res, 200, "success", user);
  } catch (err) {
    responseFunc(res, 400, "error", err.message);
  }
};
const update = async (req, res, next) => {
  try {
    const user = await Test.update(req.body, {
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
    const user = await Test.destroy({
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
