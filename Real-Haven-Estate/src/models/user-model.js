/* eslint-disable no-shadow */
const { Schema, model } = require('mongoose');
const { hashPassword } = require('../utils/data-crypto');
const { DB_COLLECTION } = require('../config/constants');
const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const crypto = require('crypto')

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
    select:false
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
  confirmedAccount:{
    type:Boolean,
    default:false
  },
  resetPasswordToken: {
    type:String
  },
  resetPasswordTokenExpire:{
    type:Date
  },
  comfirmEmailToken:{
    type:String
  },
  comfirmEmailTokenExpire:{
    type:Date
  }
}, {timestamps:true});


UserSchema.pre('save', async function passHash(next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  return next();
});

UserSchema.methods.createAndSignJwtToken = function(){
  return jwt.sign({id: this._id}, constants.JWT_PUBLIC_KEY, {
    expiresIn:constants.JWT_USER_LOGIN_EXPIRATION
})
}

UserSchema.methods.createResetPasswordToken =  function(){
  const token = crypto.randomBytes(15).toString("hex")
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

  this.resetPasswordTokenExpire = Date.now() + 10 * 60 * 1000
  return this.resetPasswordToken
}

UserSchema.methods.createConfirmEmailToken =  function(){
  const token = crypto.randomBytes(15).toString("hex")
  this.comfirmEmailToken = crypto.createHash('sha256').update(token).digest('hex')

  this.comfirmEmailTokenExpire = Date.now() + 10 * 60 * 1000
  return this.comfirmEmailToken
}

const UserModel = model(DB_COLLECTION.USER, UserSchema);
module.exports = UserModel;
