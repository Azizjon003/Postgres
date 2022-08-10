const Db = require("../model");
const Mavzu = Db.mavzu;

console.log(Mavzu);

const responseFunc = async (res, statusCode, status, data) => {
  res.status(statusCode).json({
    status: status,
    data: data,
  });
};
const add = async (req, res, next) => {
  try {
    const { mavzu, fanId } = req.body;
    const user = await Mavzu.create({
      mavzu,
      fanId,
    });

    responseFunc(res, 201, "success", user);
  } catch (err) {
    responseFunc(res, 400, "error", err.message);
  }
};

const getAll = async (req, res, next) => {
  try {
    const users = await Mavzu.findAll({
      include: Db.fan,
    });
    responseFunc(res, 201, "success", users);
  } catch (err) {
    responseFunc(res, 400, "error", err.message);
  }
};
const getOne = async (req, res, next) => {
  try {
    const user = await Mavzu.findByPk(req.params.id);
    responseFunc(res, 200, "success", user);
  } catch (err) {
    responseFunc(res, 400, "error", err.message);
  }
};
const update = async (req, res, next) => {
  try {
    const user = await Mavzu.update(req.body, {
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
    const user = await Mavzu.destroy({
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
