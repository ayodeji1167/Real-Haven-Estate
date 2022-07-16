const BadRequestError = require('../error/bad-request-error');
const UserModel = require('../models/user-model');
const { MESSAGES } = require('../config/constants');

class UserService {
  registerUser = async (req) => {
    const { email } = req.body;

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      throw new BadRequestError(MESSAGES.AGENT_EXIST);
    }

    const user = new UserModel({ ...req.body });
    await user.save();
    // Send confirmation email
  };

  login = async () => {};

  resetPassword = async () => {};
}

module.exports = new UserService();
