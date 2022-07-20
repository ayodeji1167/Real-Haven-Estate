const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_PUBLIC_KEY } = require('../config/constants');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

const createJwt = async (payload, expTime, secretKey = JWT_PUBLIC_KEY) => {
  const token = jwt.sign(payload, secretKey, { expiresIn: expTime });
  return token;
};

const decryptData = async (token, secretKey = JWT_PUBLIC_KEY) => {
  const data = jwt.verify(token, secretKey);
  return data;
};
module.exports = {
  hashPassword, comparePassword, createJwt, decryptData,
};
