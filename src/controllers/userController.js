const UserService = require('../services/user-service');
const constants = require('../config/constants');

class UserController {
  registrationHandler = async (req, res) => {
    const user = await UserService.registerUser(req);
    res.status(200).json({
      message: constants.MESSAGES.CONFIRM_EMAIL,
      user,
    });
  };

  getUserByBusinessName = async (req, res) => {
    const user = await UserService.getUserByBusinessName(req);
    res.status(200).json({
      message: 'success',
      user,
    });
  };

  confirmAccountHandler = async (req, res) => {
    const result = await UserService.confirmRegisteredEmail(req);
    if (!result) {
      res.status(403).json({ mesage: constants.MESSAGES.USER_NOT_EXIST });
    } else {
      res.redirect('https://realhaven.herokuapp.com/login');
    }
  };

  resendEmailConfirmation = async (req, res) => {
    await UserService.resendConfirmation(req);
    res.status(200).json({ message: constants.MESSAGES.CONFIRM_EMAIL });
  };

  _loginHandler = async (req, res) => {
    const { token, responseUser } = await UserService.login(req);
    res.status(200).json({
      message: constants.MESSAGES.USER_LOGGED,
      token,
      user: responseUser,
    });
  };
  get loginHandler() {
    return this._loginHandler;
  }
  set loginHandler(value) {
    this._loginHandler = value;
  }

  forgotPasswordHandler = async (req, res) => {
    // I sent the confirmEmail message into here for testing and visibilty,
    // when we a service for this i will remove it

    await UserService.forgotPassword(req);
    res.status(200).json({
      message: constants.MESSAGES.PASSWORD_RESET_EMAIL_SENT,

    });
  };

  resetLostPasswordHandler = async (req, res) => {
    await UserService.resetLostPassword(req);
    res
      .status(200)
      .json({ message: constants.MESSAGES.PASSWORD_RESET_SUCCESS });
  };

  resetCurrentPasswordHandler = async (req, res) => {
    await UserService.resetCurrentPassword(req);
    res
      .status(200)
      .json({ message: constants.MESSAGES.PASSWORD_RESET_SUCCESS });
  };

  getUserByIdHandler = async (req, res) => {
    const user = await UserService.getUserById(req);
    res.status(200).send(user);
  };

  checkUserValidityHandler = async (req, res) => {
    const isValid = await UserService.checkUserValidity(req);
    res.status(200).send(isValid);
  };

  saveOauthUserHandler = async (req, res) => {
    const responseObject = await UserService.saveAuthUser(req);
    res.status(200).send(responseObject);
  };

  editAgentProfileHandler = async (req, res) => {
    const updatedProfile = await UserService.editAgentProfile(req);
    res.status(200).send(updatedProfile);
  };
}

module.exports = new UserController();
