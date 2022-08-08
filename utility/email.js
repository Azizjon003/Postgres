const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const pug = require("pug");
dotenv.config({ path: "../config.env" });
class Mail {
  constructor(user, url) {
    this.email = user.email;
    this.from = process.env.EMAIL_FROM;
    this.url = url;
    this.name = user.name;
  }

  //1 transporter created   2 transporter used
  transporter() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // 1 host
      port: 465, // 2 port
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }, // 3 auth user and pass
    });
  }
  // 2 sent message options
  async sentMessage(template) {
    const htmlRender = `${__dirname}/../views/${template}.pug`;
    let html = pug.renderFile(htmlRender, {
      name: this.name,
      url: this.url,
    });
    const emailOption = {
      from: "Aliqulov Azizjon <aliqulovazizjon79@gmail.com>",
      to: this.email,
      subject: "Reset your password",
      html: html,
    };
    await this.transporter().sendMail(emailOption);
  }
  sentResetPassword() {
    this.sentMessage("reset");
  }
}

module.exports = Mail;
