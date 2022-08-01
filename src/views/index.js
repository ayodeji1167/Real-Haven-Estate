const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

const verifyEmailHtml = fs.readFileSync(path.join(__dirname, '../views/verify-email.html'), { encoding: 'utf8', flag: 'r' });
const resetPasswordRequestHtml = fs.readFileSync(
  path.join(__dirname, './reset-password-request.html'),
  { encoding: 'utf8', flag: 'r' },
);

const verifyEmailHandlebars = handlebars.compile(verifyEmailHtml);
const resetPasswordHandlebar = handlebars.compile(resetPasswordRequestHtml);

module.exports = { verifyEmailHandlebars, resetPasswordHandlebar };
