const { Router } = require('express');
const UserController = require('../controllers/userController');

const userRouter = Router();

userRouter.post('/register', UserController.registrationHandler);
userRouter.post('/login', UserController.loginHandler);
userRouter.post('/forgotpassword', UserController.forgotPasswordHandler);
userRouter.put('/resetpassword', UserController.resetLostPasswordHandler);
userRouter.put('/:id/resetcurrentpassword', UserController.resetCurrentPasswordHandler);
userRouter.get('/confirmaccount/:token', UserController.confirmAccountHandler);

module.exports = userRouter;
