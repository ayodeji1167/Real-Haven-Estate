const dotenv = require('dotenv');

dotenv.config();

const constants = {
  APP_NAME: 'REAL HAVEN ESTATE',
  PORT: process.env.PORT,
  DATABASE_URI: process.env.DATABASE_URI,
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
  JWT_USER_LOGIN_EXPIRATION: '2h',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

  CLOUDINARY: {
    NAME: process.env.CLOUDINARY_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY,
  },

  DB_COLLECTION: {
    USER: 'USER',
  },

  MESSAGES: {
    USER_EXIST: 'User already exists',
    USER_CREATED: 'User created successfully',
    USER_LOGGED: 'User logged in successfully',
    USER_UPDATED: 'User updated successfully',
    USER_NOT_EXIST: 'User does not exist',
    USER_ACTIVITY_GOTTEN: 'User activities gotten successfully',
    JOB_CREATED: 'New Job Post created successfully',
    UPLOADED: 'Upload Successful',
    ALREADY_EXIST: 'Resource already exists',
    CREATED: 'Resource created successfully',
    FETCHED: 'Resource fetched',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    NOT_FOUND: 'Not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    INVALID_TOKEN: 'Invalid token',
    INVALID_PASSWORD: 'Invalid password',
    TOKEN_VERIFIED: 'Token verified successfully',
    OTP_MESSAGE: 'Hello, your BBWE verification code is',
    OTP_SENT: 'OTP Sent',
    PASSWORD_MISMATCH: 'Password mismatch detected',
    PASSWORD_RESET_EMAIL_SENT:
      'The reset password link has been sent to your email address',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
    AGENT_EXIST: 'Agent already exists',
    AGENT_CREATED: 'Agent created successfully',
    AGENT_UPDATED: 'Agent updated successfully',
    AGENT_NOT_EXIST: 'Agent does not exist',
  },
};

module.exports = constants;
