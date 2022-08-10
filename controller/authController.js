const Db = require("../model");
console.log(Db.user);

const AppError = require("../utility/appError");
const catchAsync = require("../utility/catchAsync");

const Mail = require("../utility/email");
const { promisify } = require("util");
const sendPhoneSms = require("../utility/sendPhoneSms");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = Db.user;

const saveTokenCookie = (res, token, req) => {
  // shu cookieni ishlashini sorimiz
  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    // httpOnly: true,
    // secure: req.protocol === "https" ? true : false,
  });
};

const resJson = (id) => {
  return jwt.sign({ id: id.id }, process.env.SECRET, { expiresIn: "10h" });
};

const signin = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role, phone } = req.body;

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

  let random = randomSon.join("");
  const rand = random;
  random = await bcrypt.hash(random, 10);
  const emailExpires = new Date().getTime() + 2 * 60 * 1000;
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    randomSon: random,
    emailExpires,
    number: phone,
  });
  await new Mail(user, rand).emailVerify();
  const token = resJson(user);
  saveTokenCookie(res, token, req);
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
    if (req.cookies) {
      token = req.cookies.jwt;
    } else
      return next(
        new AppError("Please log in to get access Bearer token not found", 401)
      );
  }

  // console.log(token);
  const decod = await promisify(jwt.verify)(token, process.env.SECRET);
  if (!decod) {
    return next(new AppError("Invalid tokencha ", 401));
  }

  // console.log(decod);
  const user = await User.findByPk(decod.id);

  // console.log(user);
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
  let url = `http://localhost:8000/api/v1/users/resetpassword?token=${token}`;
  await new Mail(user.dataValues, url).sentResetPassword();
  res.status(200).json({
    status: "success",
    message: "Email sent succesfully",
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.query;
  if (!token) {
    return next(new AppError("Token not found", 400));
  }
  const hashToken = await crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    where: {
      hashToken,
      tokenExpires: {
        [Db.Op.gt]: Date.now(),
      },
    },
  });
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

      emailExpires: {
        [Db.Op.gt]: Date.now(),
      },
    },
  });

  // console.log(code);

  const shart = await bcrypt.compare(code, user.dataValues.randomSon);
  if (!shart) {
    return next(new AppError("Invalid code", 400));
  }
  if (!user) {
    return next(new AppError("user not found or jwt malwormet ", 400));
  }

  await User.update(
    {
      emailActiv: true,
      emailExpires: null,
      randomSon: null,
    },
    {
      where: {
        id: user.dataValues.id,
      },
    }
  );
  // saveTokenCookie(res,token)
  res.status(200).json({
    status: "success",
    message: "Email verified succesfully",
  });
});

const sendNumberVerifyCode = catchAsync(async (req, res, next) => {
  const { phone } = req.body;
  if (!phone) {
    return next(new AppError("Phone not found", 400));
  }
  const user = await User.findOne({
    where: {
      number: phone,
    },
  });
  if (!user) {
    return next(new AppError("user not found number", 400));
  }

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

  let random = randomSon.join("");
  const sended = await sendPhoneSms(phone, random);
  // console.log(sended);
  if (!sended) {
    return next(new AppError("Sms not send", 400));
  }
  random = await bcrypt.hash(random, 12);
  const numberExpires = new Date().getTime() + 2 * 60 * 1000;
  await User.update(
    {
      NumberCode: random,
      numberExpires: numberExpires,
    },
    {
      where: {
        id: user.dataValues.id,
      },
    }
  );

  res.status(200).json({
    status: "success",
    message: "send phone number verify code succesfully",
  });
});

const verifyCode = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  // console.log(code);
  if (!code) {
    return next(new AppError("sizning kod raqamingiz eskirgan"), 400);
  }
  let user = await User.findByPk(req.user.id);
  user = user.dataValues;
  const hashCode = user.NumberCode;
  const expires = user.numberExpires;

  if (expires < Date.now()) {
    return next(
      new AppError(
        "sizning kod raqamingiz eskirdi qaytadan foydalanib ko'ring",
        400
      )
    );
  }

  const shart = await bcrypt.compare(code, hashCode);

  if (!shart) {
    return next(
      new AppError("sizning kod raqamingiz xato qaytdan kiritb ko'ring ", 400)
    );
  }

  const data = await User.update(
    {
      numberExpires: null,
      NumberCode: null,
      phoneActiv: true,
    },
    {
      where: {
        id: user.id,
      },
    }
  );
  if (!data) {
    return next(new AppError("xatolik  yuz berdi ", 404));
  }
  res.status(200).json({
    status: "succes",
    message: "phone number verified succesfully",
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
  sendNumberVerifyCode,
  verifyCode,
};
