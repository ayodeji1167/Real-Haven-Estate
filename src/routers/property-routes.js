const { Router } = require('express');
const PropertyController = require('../controllers/propertyController')
const {protect, authorize} = require('../utils/protect-route')
const propertyRouter = Router();


propertyRouter.post('/create', protect, authorize('agent'), PropertyController.createPropertyHandler);


module.exports = propertyRouter;
