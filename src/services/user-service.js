const {
  UnAuthorizedError,
  BadRequestError,
  NotFound,
  AlreadyExist,
} = require('../error/errors');
const { MESSAGES, BASE_URL, FRONTEND_URL } = require('../config/constants');
const { comparePassword, decryptData, hashPassword } = require('../utils/data-crypto');

const sendEmail = require('../utils/email');
const UserModel = require('../models/user-model');

class UserService {
  registerUser = async (req) => {
    const { email, firstName, password } = req.body;

    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      throw new AlreadyExist(MESSAGES.USER_EXIST);
    }

    // This creates and save the user
    const newUser = await UserModel.create(req.body);
    newUser.password = await hashPassword(password);

    // Create token for the user
    const token = await newUser.createAndSignJwtToken();
    await newUser.save();

    //  Send Email To User
    const link = `${BASE_URL}/user/confirmaccount/${token}`;
    await sendEmail(email, 'Verify Your Account', { firstName, link });
    return { email: newUser.email, id: newUser._id };
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

  resendConfirmation = async (req) => {
    const { email } = req.body;
    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      throw new NotFound(MESSAGES.USER_NOT_EXIST);
    }

    if (userExist.isValid) {
      throw new BadRequestError(MESSAGES.ALREADY_VERIFIED);
    }

    const token = await userExist.createAndSignJwtToken();
    const link = `${BASE_URL}/user/confirmaccount/${token}`;
    await sendEmail(email, 'Verify Your Account', {
      firstName: userExist.firstName,
      link,
    });
  };

  login = async (req) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Please Input Email or Password');
    }

    const userExist = await UserModel.findOne({ email }).select('+password');
    if (!userExist) {
      throw new NotFound(MESSAGES.USER_NOT_EXIST);
    }
    if (userExist.isValid !== true) {
      throw new UnAuthorizedError(MESSAGES.CONFIRM_EMAIL);
    }

    const isMatch = await comparePassword(password, userExist.password);

    if (!isMatch) {
      throw new UnAuthorizedError(MESSAGES.INVALID_PASSWORD);
    }

    const token = await userExist.createAndSignJwtToken();
    const responseUser = await UserModel.findOne({ email });
    return { token, responseUser };
  };

  forgotPassword = async (req) => {
    /**
     * The user click on this link because the user has forgotten password
     * This link accepts the user email and sends a link which directs them to
     * a form where they reset their password
     */
    const { email } = req.body;
    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      throw new NotFound(MESSAGES.USER_NOT_EXIST);
    }
    if (!userExist.isValid) {
      throw new BadRequestError('Your account is not verified');
    }

    const token = await userExist.createAndSignJwtToken();
    const link = `${FRONTEND_URL}/reset/${token}`;
    await sendEmail(email, 'Password Reset Request', {
      email,
      link,
    });

    userExist.resetPasswordToken = token;
    await userExist.save();
  };

  resetLostPassword = async (req) => {
    // The user shouldnt be allowed to get hold of the

    const { token } = req.params;
    const { password } = req.body;

    const { id } = await decryptData(token);
    const userExist = await UserModel.findById(id);

    if (!userExist) {
      throw new NotFound(MESSAGES.USER_NOT_EXIST);
    }

    if (token !== userExist.resetPasswordToken) {
      throw new BadRequestError('Invalid Request');
    }

    const hashedPassword = await hashPassword(password);

    userExist.resetPasswordToken = undefined;
    userExist.password = hashedPassword;
    userExist.save();

    // Send email to user that their email has been reset
  };

  resetCurrentPassword = async (req) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    const userExist = await UserModel.findById(userId).select('+password');

    if (!userExist) {
      throw new NotFound(MESSAGES.USER_NOT_EXIST);
    }

    const isMatch = await comparePassword(currentPassword, userExist.password);
    if (!isMatch) {
      throw new BadRequestError(MESSAGES.PASSWORD_MISMATCH);
    }

    const hashedPassword = await hashPassword(newPassword);
    userExist.password = hashedPassword;
    await userExist.save();
  };

  getUserById = async (req) => {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError('Input Id');
    }
    const user = await UserModel.findById(id);
    if (!user) {
      throw new NotFound(MESSAGES.USER_NOT_EXIST);
    }
    return user;
  };

  checkUserValidity = async (req) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      throw new NotFound(MESSAGES.USER_NOT_EXIST);
    }
    if (user.isValid) {
      return true;
    }
    return false;
  };
}

module.exports = new UserService();
