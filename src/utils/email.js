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

const googleMailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GOOGLE_MAIL_USERNAME,
    pass: process.env.GOOGLE_MAIL_PASSWORD,
    accessToken: process.env.GMAIL_ACESSTOKEN,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESHTOKEN,
  },
});

const normalGoogleSender = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'akintundegbenga30@gmail.com',
    pass: 'gqbmmzhsgdhpowni',
  },
});

const sendEmail = async (to, subject, payload) => {
  let html;

  const { firstName, link } = payload;
  if (subject === 'Welcome To Haven') {
    html = verifyEmailTemplate({ firstName, link });
  } else if (subject === 'Password Reset Request') {
    html = passwordResetTemplate({ firstName, link });
  }
  // const { firstName, link } = payload;

  const info = {
    from: 'Real Haven <afuwapeayodeji2018@gmail.com>',
    to,
    subject,
    html,
  };

  await googleMailTransporter.sendMail(info);
};

module.exports = sendEmail;
