const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASSWORD } = require('../config/constants');
const {
  verifyEmailHandlebars,
  resetPasswordHandlebar,
} = require('../views/index');
// const pathToMjml = path.join(__dirname, '../views/mjml/first.mjml');
// const mjmlToCompile = fs.readFileSync(pathToMjml);
// const firstTemplate = handlebars.compile(mjmlToCompile.toString());

// const context = {
//   name: 'Afuwape Ayodeji',
// };

// const mjmlToUse = firstTemplate(context);
// const { html } = mjml2html(mjmlToUse);

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  ssl: false,
  tls: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  },
});

const sendEmail = async (to, subject, payload) => {
  let html;

  if (subject === 'Verify Your Account') {
    html = verifyEmailHandlebars(payload);
  }

  if (subject === 'Password Reset Request') {
    html = resetPasswordHandlebar(payload);
  }
  // const { firstName, link } = payload;

  const info = {
    from: EMAIL_USER,
    to,
    subject,
    html,
  };

  await transport.sendMail(info);
};

module.exports = sendEmail;
