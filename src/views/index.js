const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

const verifyEmailSource = fs.readFileSync(
  path.resolve(__dirname, './verify.handlebars'),
  'utf8',
);
const verifyEmailTemplate = handlebars.compile(verifyEmailSource);

module.exports = { verifyEmailTemplate };
