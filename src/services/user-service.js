const BadRequestError = require('../error/bad-request-error');
const { MESSAGES, BASE_URL } = require('../config/constants');
const {
  comparePassword, decryptData, hashPassword, createJwt,
} = require('../utils/data-crypto');

const sendEmail = require('../utils/email');
const UserModel = require('../models/user-model');

class UserService {
  registerUser = async (req) => {
    const { email, firstName, password } = req.body;

    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      throw new BadRequestError(MESSAGES.USER_EXIST);
    }

    // hash user password
    const hashedPassword = await hashPassword(password);

    // This creates and save the user
    const newUser = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });

    // Create token for the user
    const token = await createJwt({ id: newUser._id, email: newUser.email });
    //  Send Email To User
    const link = `${BASE_URL}/user/confirmaccount/${token}`;
    await sendEmail(email, 'Verify Your Account', { firstName, link });
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

  resendConfirmation = async (req) => {
    const { email } = req.body;
    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      throw new BadRequestError(MESSAGES.USER_NOT_EXIST);
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
      throw new BadRequestError(MESSAGES.USER_NOT_EXIST);
    }
    if (userExist.isValid !== true) {
      throw new BadRequestError(MESSAGES.CONFIRM_EMAIL);
    }

    const isMatch = await comparePassword(password, userExist.password);

    if (!isMatch) {
      throw new BadRequestError(MESSAGES.INVALID_PASSWORD);
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
      throw new BadRequestError(MESSAGES.USER_NOT_EXIST);
    }
    if (!userExist.isValid) {
      throw new BadRequestError('Your account is not verified');
    }

    const token = await userExist.createAndSignJwtToken();
    const link = `${BASE_URL}/user/reset-lost-password/${token}`;
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
      throw new BadRequestError(MESSAGES.USER_NOT_EXIST);
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
      throw new BadRequestError(MESSAGES.USER_NOT_EXIST);
    }

    const isMatch = await comparePassword(currentPassword, userExist.password);
    if (!isMatch) {
      throw new BadRequestError(MESSAGES.PASSWORD_MISMATCH);
    }

    const hashedPassword = await hashPassword(newPassword);
    userExist.password = hashedPassword;
    await userExist.save();
  };
}

module.exports = new UserService();
