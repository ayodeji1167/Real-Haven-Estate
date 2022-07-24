const { MESSAGES } = require("../config/constants");
const BadRequestError = require("../error/bad-request-error");
const { decryptData } = require("./data-crypto");
const UserModel = require('../models/user-model')

exports.protect =  async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        throw new BadRequestError(MESSAGES.INVALID_TOKEN)
    }
    
    try {
        const user = await decryptData(token)
        req.user = await UserModel.findById(user.id)
        next()
    } catch (error) {
        return next( new BadRequestError("You do not have the permission to access this page") )   
    }
}

exports.authorize = (...roles) => {
    return (req,res,next) => {
       if(!roles.includes(req.user.role)){
        return next(new BadRequestError(`User role: ${req.user.role} is not authorized to access this route`))
       }
       next()
    }
}


