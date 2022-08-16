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

const welcomeEmailUserSource = fs.readFileSync(path.resolve(__dirname, './welcome-user.handlebars'), 'utf-8');
const welcomeEmailAgentSource = fs.readFileSync(path.resolve(__dirname, './welcome-agent.handlebars'), 'utf-8');
const passwordResetSuccessfull = fs.readFileSync(path.resolve(__dirname, './password-sucess.handlebars'), 'utf-8');

const verifyEmailTemplate = handlebars.compile(verifyEmailSource);
const passwordResetTemplate = handlebars.compile(passwordResetSource);
const welcomeUserTemplate = handlebars.compile(welcomeEmailUserSource);
const welcomeAgentTemplate = handlebars.compile(welcomeEmailAgentSource);
const passwordSuccessTemplate = handlebars.compile(passwordResetSuccessfull);

module.exports = {
  verifyEmailTemplate,
  passwordResetTemplate,
  welcomeUserTemplate,
  welcomeAgentTemplate,
  passwordSuccessTemplate,
};
