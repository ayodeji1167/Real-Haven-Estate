const { Router } = require('express');
const UserController = require('../controllers/userController');

const userRouter = Router();

userRouter.post('/register', UserController.registrationHandler);
module.exports = userRouter;
