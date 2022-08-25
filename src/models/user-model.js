/* eslint-disable no-shadow */
const { Schema, model } = require('mongoose');
const { DB_COLLECTION } = require('../config/constants');
const { createJwt } = require('../utils/data-crypto');

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    title: {
      type: String,
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
    contactImformation: {
      instagram: String,
      facebook: String,
      twitter: String,
    },
    businessInformation: {
      businessName: String,
      businessAddress: String,
      businessCategory: String,
    },
    website_url: {String},
    specialization: {
      type: [String],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['agent', 'user'],
      default: 'user',
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

    resetPasswordToken: {
      type: String,
    },
  },
  { timestamps: true },
);

UserSchema.methods.createAndSignJwtToken = function () {
  return createJwt({ id: this._id, email: this.email }, '2h');
};

const UserModel = model(DB_COLLECTION.USER, UserSchema);
module.exports = UserModel;
