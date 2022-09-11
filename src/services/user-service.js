const {
  UnAuthorizedError,
  BadRequestError,
  NotFound,
  AlreadyExist,
} = require('../error/errors');
const {
  MESSAGES, BASE_URL, FRONTEND_URL, UPLOAD_PATH,
} = require('../config/constants');
const {
  comparePassword,
  decryptData,
  hashPassword,
  createJwt,
} = require('../utils/data-crypto');

const { uploadSingleFile } = require('../config/cloudinary');
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

    //  Send Email For Verification To User
    const link = `${BASE_URL}/user/confirmaccount/${token}`;
    await sendEmail(email, 'Verify Email Haven', { firstName, link });
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
    const { email, firstName, role } = user;
    const link = 'https://realhaven.herokuapp.com';

    // After Verification, sends welcome email to the user or Agent
    if (role === 'user') {
      await sendEmail(email, 'Welcome To Haven User', { firstName, link });
    } else {
      await sendEmail(email, 'Welcome To Haven Agent', {
        firstName,
        link: 'https://realhaven.herokuapp.com/dashboard',
      });
    }

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
    const link = `${FRONTEND_URL}/reset/password/${token}`;
    await sendEmail(email, 'We Recieved A Request', {
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
    await userExist.save();

    // Send email to user that their email has been reset
    const { firstName, email } = userExist;
    const link = 'https://realhaven.herokuapp.com/login';
    await sendEmail(email, 'Operation Successfull', {
      firstName,
      link,
    });
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

  saveAuthUser = async (req) => {
    const {
      email, firstName, lastName, image,
    } = req.body;
    if (!email) {
      throw new BadRequestError('No email sent');
    }

    const user = await UserModel.findOneAndUpdate(
      {
        email,
      },
      {
        email,
        'image.url': image,
        isValid: true,
        firstName,
        lastName,
      },
      { upsert: true, new: true },
    );

    const token = await createJwt({ id: user._id, email: user.email }, '12h');

    const responseObject = {
      sucess: true,
      user,
      token,
    };
    // redirect
    return responseObject;
  };

  async updateAgentProfile(req) {
    const userId = req.params.id;
    let user = await UserModel.findById(userId);
    
    const { businessName } = req.body;
    const { mainImage, businessLogo } = req.files;

    let mainImageSecureUrl;
    let mainImagePublicId;
    let businessLogoSecureUrl;
    let businessLogoPublicId;

    if (!user) {
      throw new NotFound(MESSAGES.USER_NOT_EXIST);
    }

    try {
      const mainImageUpload = await uploadSingleFile(
        mainImage[0].path,
        UPLOAD_PATH.PROPERTY_IMAGES,

        'image',
      );
      mainImageSecureUrl = mainImageUpload.secure_url
      mainImagePublicId = mainImageUpload.public_id
        
    } catch (error) {
      console.log(error)
    }

    try {
      const businessLogoUpload = await uploadSingleFile(
      businessLogo[0].path,
        UPLOAD_PATH.PROPERTY_IMAGES,

        'image',
      );
      businessLogoSecureUrl = businessLogoUpload.secure_url
      businessLogoPublicId = businessLogoUpload.public_id
        
    } catch (error) {
      console.log(error)
    }

    user = await UserModel.findByIdAndUpdate(
      userId,
      {
        ...req.body,
      businessInformation: {  businessName },
      mainImage: {
        url: mainImageSecureUrl,
        publicId: mainImagePublicId
      },
      businessLogo:{
        url: businessLogoSecureUrl,
        publicId: businessLogoPublicId
      }
      },
      { new: true, upsert:true },
    );
   
    return user;
  }


  
}

module.exports = new UserService();
