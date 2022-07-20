/* eslint-disable no-shadow */
const { Schema, model } = require('mongoose');
const { hashPassword } = require('../utils/data-crypto');
const { DB_COLLECTION } = require('../config/constants');
const { createJwt } = require('../utils/data-crypto');

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
    select: false,
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
  isValid: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

UserSchema.pre('save', async function passHash(next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  return next();
});

UserSchema.methods.createAndSignJwtToken = function () {
  return createJwt({ id: this._id, email: this.email }, '2h');
};

UserSchema.pre('findOneAndUpdate', async function (next) {
  const { password } = this.getUpdate().$set;
  if (!password) {
    next();
  }
  const hash = await hashPassword(password);
  this.getUpdate().$set.password = hash;
  return next();
});

const UserModel = model(DB_COLLECTION.USER, UserSchema);
module.exports = UserModel;
