const mongoose = require('mongoose');
const constants = require('../src/config/constants');

const connectDb = async () => {
  const conn = await mongoose.connect(constants.DATABASE_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`)
};
module.exports = connectDb;
