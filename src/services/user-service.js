const BadRequestError = require('../error/bad-request-error');
const UserModel = require('../models/user-model');
const { MESSAGES } = require('../config/constants');
const { comparePassword, decryptData } = require('../utils/data-crypto');

const sendEmail = require('../utils/email');

class UserService {
  registerUser = async (req) => {
    const { email } = req.body;

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      throw new BadRequestError(MESSAGES.AGENT_EXIST);
    }

    // This creates and save the user
    const newUser = await UserModel.create(req.body);

    // Create token for the user
    const token = await newUser.createAndSignJwtToken();
    await newUser.save();

    // Send Email To User
    await sendEmail(email, 'Verify Your Account', token);
    return newUser;
  };

  confirmRegisteredEmail = async (req) => {
    const { token } = req.params;

    if (!token) {
      throw new BadRequestError('Please Input Your Token');
    }

    const { id } = await decryptData(token);

    const user = await UserModel.findOneAndUpdate(
      {
        _id: id,
      },
      { isValid: true },
      { new: true },
    );

    return user;
  };

  login = async (req) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Please Input Email or Password');
    }

    const userExist = await UserModel.findOne({ email }).select('+password');
    if (!userExist) {
      throw new BadRequestError(MESSAGES.USER_NOT_EXIST);
    }
    if (userExist.confirmedAccount !== true) {
      throw new BadRequestError(MESSAGES.CONFIRM_EMAIL);
    }

    const isMatch = await comparePassword(password, userExist.password);

    if (!isMatch) {
      throw new BadRequestError(MESSAGES.INVALID_PASSWORD);
    }

    const token = userExist.createAndSignJwtToken();
    return { token, userExist };
  };

  forgotPassword = async (req) => {
    const { email } = req.body;
    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      throw new BadRequestError(MESSAGES.INVALID_CREDENTIALS);
    }

    const confirmResetToken = userExist.createAndSignJwtToken();
    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/user/resetpassword?token=${confirmResetToken}`;
    const resetPasswordMessage = ` You are receiving this email because you (or someone else) has requested the reset of a password. Please make a put request to: ${resetUrl}`;

    // Send Email

    return resetPasswordMessage;
  };

  resetLostPassword = async (req) => {
    const { token } = req.params;
    const { password } = req.body;

    const { id } = await decryptData(token);

    const userExist = await UserModel.findById(id);

    if (!userExist) {
      throw new BadRequestError(MESSAGES.INVALID_TOKEN);
    }

    await UserModel.findByIdAndUpdate(id, { $set: { password } });

    // Send email to user that their email has been reset
  };

  resetCurrentPassword = async (req) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    const userExist = await UserModel.findById(userId).select('+password');

    if (!userExist) {
      throw new BadRequestError(MESSAGES.INVALID_CREDENTIALS);
    }

    const isMatch = await comparePassword(currentPassword, userExist.password);
    if (!isMatch) {
      throw new BadRequestError(MESSAGES.PASSWORD_MISMATCH);
    }

    await UserModel.findByIdAndUpdate(userId, { $set: { newPassword } });
  };
}

module.exports = new UserService();
