const Db = require("../model");
const AppError = require("../utility/appError");
const catchAsync = require("../utility/catchAsync");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Mail = require("../utility/email");
console.log(Db);

const User = Db.user;
function resJson(user) {
  const token = jwt.sign({ id: user.id }, process.env.SECRET, {
    expiresIn: "1d",
  });
  return token;
}
const signin = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  const randomNum = Math.round(Math.random() * 100000 + 1);
  const getTime = String(new Date().getTime() + randomNum);
  let randomSon = [];
  for (let i = 0; i < 2; i++) {
    let son = Math.round(Math.random() * 6 + 6);
    randomSon.push(getTime[son]);
  }
  for (let i = 0; i < 3; i++) {
    let son = Math.round(Math.random() * 10);
    randomSon.push(son);
  }

  const random = randomSon.join("");
  const emailExpires = new Date().getTime() + 2 * 60 * 1000;
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    randomSon: random,
    emailExpires,
  });
  await new Mail(user, random).emailVerify();
  const token = resJson(user);
  res.status(201).json({
    status: "success",
    token,
    message: "email verify code sended succsesfully",
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide an email and password", 400));
  }
  const data = await User.findOne({
    where: {
      email,
    },
  });
  if (!data) {
    return next(new AppError("Incorrect email", 400));
  }
  const pass = data.dataValues.password;
  let shart = await bcrypt.compare(password, pass);
  if (!shart) {
    return next(new AppError("Invalid  password", 400));
  }

  const token = resJson(data.dataValues);
  res.status(200).json({
    status: "success",
    token,
  });
});
const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(
      new AppError("Please log in to get access Bearer token not found", 401)
    );
  }

  const decod = await jwt.verify(token, process.env.SECRET);
  if (!decod) {
    return next(new AppError("Invalid tokencha ", 401));
  }

  const user = await User.findByPk(decod.id);
  if (!user) {
    return next(new AppError("Invalid token", 401));
  }

  req.user = user.dataValues;

  next();
});
const role = (roles) => {
  return catchAsync(async (req, res, next) => {
    const user = req.user;

    if (!roles.includes(user.role)) {
      return next(new AppError("Siz kirish huquqiga ega emassiz", 401));
    }
    next();
  });
};
const updateMe = catchAsync(async (req, res, next) => {
  let { name, email } = req.body;
  name = req.body.name || req.user.name;
  email = req.body.email || req.user.email;
  const user = await User.update(
    {
      name: name,
      email: email,
    },
    {
      where: {
        id: req.user.id,
      },
    }
  );
  const token = resJson(req.user);
  res.status(200).json({
    status: "success",
    token,
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  let { password, newPass, passConfirm } = req.body;

  if (!password || !newPass || !passConfirm) {
    return next(
      new AppError(
        "Please provide all fields password newPasswor newpasswordConfirm",
        400
      )
    );
  }
  const user = await User.findByPk(req.user.id);
  const pass = user.dataValues.password;
  const shart = await bcrypt.compare(password, pass);
  if (!shart) {
    return next(new AppError("Invalid  password password incorrect", 400));
  }
  if (newPass !== passConfirm) {
    return next(new AppError("Password not match", 400));
  }
  const newPassword = await bcrypt.hash(newPass, 12);

  const update = await User.update(
    {
      password: newPassword,
    },
    {
      where: {
        id: req.user.id,
      },
    }
  );
  let token = resJson(req.user);
  res.status(200).json({
    status: "success",
    token,
  });
});
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("emailingizni kiriting", 400));
  }

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    return next(new AppError("Bu email bilan hech qanday user topilmadi", 404));
  }

  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date().getTime(new Date()) + 10 * 60 * 1000;
  console.log(now);
  const hashToken = await crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  await User.update(
    {
      hashToken: hashToken,
      tokenExpires: now,
    },
    {
      where: {
        id: user.dataValues.id,
      },
    }
  );
  let url = `http://localhost:8000/resetPassword?token=${token}`;
  await new Mail(user.dataValues, url).sentResetPassword();
  res.status(200).json({
    status: "success",
    message: "Email sent succesfully",
  });
});
const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.query;
  console.log(token);
  if (!token) {
    return next(new AppError("Token not found", 400));
  }
  const hashToken = await crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  console.log(hashToken);
  const user = await User.findOne({
    where: {
      hashToken,
      tokenExpires: {
        [Db.Op.gt]: Date.now(),
      },
    },
  });
  console.log(user);
  if (!user) {
    return next(
      new AppError("Invalid token token eskirgan yoki kalla bo'lgan", 400)
    );
  }

  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm) {
    return next(new AppError("Please provide all fields ", 400));
  }
  if (password !== passwordConfirm) {
    return next(
      new AppError("Password bilan paswordConfirm bir xil emas", 400)
    );
  }
  const newPassword = await bcrypt.hash(password, 12);
  await User.update(
    {
      password: newPassword,
      hashToken: null,
      tokenExpires: null,
    },
    {
      where: {
        id: user.dataValues.id,
      },
    }
  );

  res.status(200).json({
    status: "success",
    message: "Password updated succesfully",
    token: null,
  });
});

const emailVerify = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  if (!code) {
    return next(new AppError("Code not found", 400));
  }

  const user = await User.findOne({
    where: {
      id: req.user.id,
      randomSon: code,
      emailExpires: {
        [Db.Op.gt]: Date.now(),
      },
    },
  });
  if (!user) {
    return next(new AppError("user not found or jwt malwormet ", 400));
  }

  await User.update(
    {
      emailActiv: true,
    },
    {
      where: {
        id: user.dataValues.id,
      },
    }
  );
  res.status(200).json({
    status: "success",
    message: "Email verified succesfully",
  });
});
module.exports = {
  signin,
  login,
  protect,
  role,
  updateMe,
  updatePassword,
  forgotPassword,
  resetPassword,
  emailVerify,
};
