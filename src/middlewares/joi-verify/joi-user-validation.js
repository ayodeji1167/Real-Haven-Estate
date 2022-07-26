const Joi = require('joi')


const register = Joi.object().keys({
    firstName: Joi.string().min(3).max(20).trim(true).required(),
    lastName: Joi.string().min(3).max(20).trim(true).required(),
    email: Joi.string().email().trim(true).pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required(),
    phoneNumber:Joi.string().pattern(/^(?:(?:(?:\+?234(?:\h1)?|01)\h*)?(?:\(\d{3}\)|\d{3})|\d{4})(?:\W*\d{3})?\W*\d{4}$/).required(),
    password: Joi.string().min(6).required().strict()
});

const login = Joi.object().keys({
    email:Joi.string().email().trim(true).pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required(),
    password: Joi.string().min(7).required().strict()
})

const resendConfirmation =  Joi.object().keys({
    email:Joi.string().email().trim(true).pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required()
})

const confirmEmailToken = Joi.object().keys({
    token: Joi.string().required() 
})

const forgotPassword = Joi.object().keys({
    email:Joi.string().email().trim(true).pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required()  
})

const resetLostPassword = Joi.object().keys({
    password: Joi.string().min(7).required().strict()
})

const resetLostPasswordToken = Joi.object().keys({
    token: Joi.string().required() 
})

const resetCurrentPassword = Joi.object().keys({
    currentPassword: Joi.string().min(7).required().strict(),
    newPassword: Joi.string().min(7).required().strict()
})

const resetCurrentPasswordId = Joi.object().keys({
    id: Joi.string().min(24).max(24).required() 
})

module.exports = {
    register, 
    login, 
    confirmEmailToken, 
    resendConfirmation, 
    forgotPassword, 
    resetLostPassword, 
    resetCurrentPassword, 
    resetCurrentPasswordId,
    resetLostPasswordToken
}
