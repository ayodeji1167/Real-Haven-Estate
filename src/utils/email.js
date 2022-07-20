const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASSWORD } = require('../config/constants');
const theHtml = require('../views/passwordReset');

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  ssl: false,
  tls: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, payload) => {
  console.log(payload);
  const info = {
    from: EMAIL_USER,
    to,
    subject,
    html: theHtml(payload),
  };

  await transport.sendMail(info);
};

module.exports = sendEmail;
