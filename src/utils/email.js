const nodemailer = require('nodemailer');
require('dotenv').config();
const { EMAIL_USER, EMAIL_PASSWORD } = require('../config/constants');
const {
  verifyEmailTemplate,
  passwordResetTemplate,
} = require('../views/index');

const mailTrapTransport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  ssl: false,
  tls: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

const googleMailTransporter = nodemailer.createTransport(

  {
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.GOOGLE_MAIL_USERNAME,
      pass: process.env.GOOGLE_MAIL_PASSWORD,
    },
  },
);

const sendEmail = async (to, subject, payload) => {
  let html;

  const { firstName, link } = payload;
  if (subject === 'Verify Your Account') {
    html = verifyEmailTemplate({ firstName, link });
    console.log(html)
  } else if (subject === 'Password Reset Request') {
    html = passwordResetTemplate({ firstName, link });
  }
  // const { firstName, link } = payload;

  const info = {
    from: EMAIL_USER,
    to,
    subject,
    html,
  };

  await googleMailTransporter.sendMail(info);
};

module.exports = sendEmail;
