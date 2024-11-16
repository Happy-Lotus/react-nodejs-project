const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const USER_EMAIL = process.env.USER_EMAIL;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: USER_EMAIL,
    pass: EMAIL_PASS,
  },
});

module.exports = transporter;
