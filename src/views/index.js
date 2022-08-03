const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

const verifyEmailSource = fs.readFileSync(
  path.resolve(__dirname, './verify.handlebars'),
  'utf8',
);

const passwordResetSource = fs.readFileSync(
  path.resolve(__dirname, './reset-password.handlebars'),
  'utf-8',
);

const verifyEmailTemplate = handlebars.compile(verifyEmailSource);
const passwordResetTemplate = handlebars.compile(passwordResetSource);

module.exports = { verifyEmailTemplate, passwordResetTemplate };
