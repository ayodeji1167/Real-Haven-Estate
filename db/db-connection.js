const mongoose = require('mongoose');
const constants = require('../src/config/constants');

const connectDb = () => {
  mongoose.connect(constants.DATABASE_URI);
};
module.exports = connectDb;
