const BadRequestError = require('../error/bad-request-error');
const UserModel = require('../models/user-model');
const { MESSAGES } = require('../config/constants');
const {hashPassword, comparePassword} = require('../utils/data-crypto')
const crypto = require('crypto')

class UserService {
  registerUser = async (req) => {
    const { email } = req.body;

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      throw new BadRequestError(MESSAGES.AGENT_EXIST);
    }

    // This creates and save the user
    await UserModel.create(req.body)
  
    // Send confirmation email
    // will work on this tomorrow
  };

  login = async (req) => {
    const {email, password} = req.body;
    const userExist = await UserModel.findOne({email}).select('+password');
    const isMatch = await comparePassword(password, userExist.password);
    if(!isMatch){
      throw new BadRequestError(MESSAGES.INVALID_PASSWORD);
    }
    const token = userExist.createAndSignJwtToken();
    return{ token, userExist};
  };


  forgotPassword = async (req) => {
    const {email} = req.body
    const userExist = await UserModel.findOne({email})
    if(!userExist){
      throw new BadRequestError(MESSAGES.INVALID_CREDENTIALS); 
    }
    
    const confirmResetToken = userExist.createResetPasswordToken();
    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/user/resetpassword?token=${confirmResetToken}`;
    const resetPasswordMessage = ` You are receiving this email because you (or someone else) has requested the reset of a password. Please make a put request to: ${resetUrl}`
    await userExist.save()
    return resetPasswordMessage;
  }


  resetLostPassword = async (req) => {
    const {token} = req.query
    const {password} = req.body
    const userExist = await UserModel.findOne({
      resetPasswordToken:token,
      resetPasswordTokenExpire:{ $gt: Date.now() }
    })
  
    if(!userExist){
      throw new BadRequestError(MESSAGES.INVALID_TOKEN); 
    }

    userExist.password = password
    userExist.resetPasswordToken = undefined
    userExist.resetPasswordTokenExpire = undefined
    await userExist.save()
  
};


  resetCurrentPassword = async (req) => {

  const {currentPassword, newPassword} = req.body
  const userId = req.params.id

  const userExist = await UserModel.findById(userId).select('+password')

  if(!userExist){
    throw new BadRequestError(MESSAGES.INVALID_CREDENTIALS); 
  }

  const isMatch = await comparePassword(currentPassword, userExist.password)
  if(!isMatch){
    throw new BadRequestError(MESSAGES.PASSWORD_MISMATCH); 
  }

  userExist.password  = newPassword
  await userExist.save()
  }
}

module.exports = new UserService();
