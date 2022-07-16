const UserService = require('../services/user-service');
const constants = require('../config/constants');

class UserController {
  registrationHandler = async (req, res) => {
    await UserService.registerUser(req);
    res.status(200).json({ message: constants.MESSAGES.USER_CREATED });
  };

  loginHandler = async () => {};

  resetPasswordHandler = async () => {};
}

module.exports = new UserController();
