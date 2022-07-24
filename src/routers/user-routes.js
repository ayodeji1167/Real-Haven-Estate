const { Router } = require('express');
const UserController = require('../controllers/userController');
const userRouter = Router();

userRouter.post('/register', UserController.registrationHandler);
userRouter.get(
  '/resend-confirmaccount/',
  UserController.resendEmailConfirmation,
);

userRouter.post('/login', UserController.loginHandler);
userRouter.get('/forgotpassword', UserController.forgotPasswordHandler);
userRouter.put('/reset-lost-password/:token', UserController.resetLostPasswordHandler);
userRouter.put('/:id/reset-current-password', UserController.resetCurrentPasswordHandler);
userRouter.get('/confirmaccount/:token', UserController.confirmAccountHandler);

module.exports = userRouter;
