/* eslint-disable no-shadow */
const { Schema, model } = require('mongoose');
const { hashPassword } = require('../utils/data-crypto');
const { DB_COLLECTION } = require('../config/constants');

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['agent', 'user'],
    required: true,
  },

  image: {
    publicId: {
      type: String,
    },
    url: {
      type: String,
    },
  },

  noOfPropertyListed: {
    type: Number,
  },

  noOfPropertySold: {
    type: Number,
  },

  noOfClients: {
    type: Number,
  },
});

UserSchema.pre('save', async function passHash(next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  return next();
});

const UserModel = model(DB_COLLECTION.USER, UserSchema);
module.exports = UserModel;
