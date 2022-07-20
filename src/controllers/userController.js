const UserService = require('../services/user-service');
const constants = require('../config/constants');

class UserController {
  registrationHandler = async (req, res) => {
    const confirmAccountMessage = await UserService.registerUser(req);
    res.status(200).json({
      message: constants.MESSAGES.USER_CREATED,
      confirmAccountMessage,
    });
  };

  confirmAccountHandler = async (req, res) => {
    await UserService.confirmRegisteredEmail(req);
    res.status(200).json({ message: constants.MESSAGES.EMAIL_CONFIRMED });
  };

  loginHandler = async (req, res) => {
    // I sent the user object inorder to easily retrieve user._id
    // when in prod it will be removed

    const { userToken, userExist } = await UserService.login(req);
    res.status(200).json({
      message: constants.MESSAGES.USER_CREATED,
      token: userToken,
      user: userExist,
    });
  };

  forgotPasswordHandler = async (req, res) => {
    // I sent the confirmEmail message into here for testing and visibilty,
    // when we a service for this i will remove it

    const resetPasswordMessage = await UserService.forgotPassword(req);
    res.status(200).json({
      message: constants.MESSAGES.PASSWORD_RESET_EMAIL_SENT,
      resetPasswordMessage,
    });
  };

  resetLostPasswordHandler = async (req, res) => {
    await UserService.resetLostPassword(req);
    res.status(200).json({ message: constants.MESSAGES.PASSWORD_RESET_SUCCESS });
  };

  resetCurrentPasswordHandler = async (req, res) => {
    await UserService.resetCurrentPassword(req);
    res.status(200).json({ message: constants.MESSAGES.PASSWORD_RESET_SUCCESS });
  };
}

module.exports = new UserController();
