const { Router } = require('express');
const validator = require('express-joi-validation').createValidator({});
const { protect, authorize } = require('../middlewares/protect-route');
const upload = require('../config/multer');

const UserController = require('../controllers/userController');
const {
  register,
  confirmEmailToken,
  login,
  resendConfirmation,
  forgotPassword,
  resetLostPassword,
  resetLostPasswordToken,
  resetCurrentPassword,
  resetCurrentPasswordId,
  verifyAgentProfileInfo,
} = require('../middlewares/joi-verify/joi-user-validation');

const userRouter = Router();

userRouter.post('/register', validator.body(register), UserController.registrationHandler);
userRouter.post('/oauth/save', UserController.saveOauthUserHandler);
userRouter.post('/resend-confirmaccount/', validator.body(resendConfirmation), UserController.resendEmailConfirmation);
userRouter.post('/login', validator.body(login), UserController.loginHandler);
userRouter.get('/check/valid/:id', UserController.checkUserValidityHandler);
userRouter.post('/forgotpassword', validator.body(forgotPassword), UserController.forgotPasswordHandler);
userRouter.get('/:id', UserController.getUserByIdHandler);
userRouter.get('/business/name/:name', UserController.getUserByBusinessName);
userRouter.put(
  '/reset-lost-password/:token',
  validator.params(resetLostPasswordToken),
  validator.body(resetLostPassword),
  UserController.resetLostPasswordHandler,
);

userRouter.put(
  '/:id/reset-current-password',
  validator.params(resetCurrentPasswordId),
  validator.body(resetCurrentPassword),
  UserController.resetCurrentPasswordHandler,
);
userRouter.get('/confirmaccount/:token', validator.params(confirmEmailToken), UserController.confirmAccountHandler);
userRouter.put('/profile/photo/:id', upload.single('file'), UserController.uploadProfilePhoto);
userRouter.put('/cover/photo/:id', upload.single('file'), UserController.uploadCoverPhoto);

userRouter.put(
  '/update-agent-profile/:id',
  // protect,
  // authorize('agent'),
  validator.body(verifyAgentProfileInfo),
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'businessLogo', maxCount: 1 }]),
  UserController.editAgentProfileHandler,
);

module.exports = userRouter;
