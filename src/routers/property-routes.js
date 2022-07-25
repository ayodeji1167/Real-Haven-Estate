const { Router } = require('express');
const PropertyController = require('../controllers/propertyController');
const { protect, authorize } = require('../middlewares/protect-route');

const propertyRouter = Router();

// Since every users must be loggedIn to use access any property,
// I made every route in this controller to be protected

propertyRouter.use(protect);

propertyRouter.post('/create', authorize('agent'), PropertyController.createPropertyHandler);

module.exports = propertyRouter;
