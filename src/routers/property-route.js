const { Router } = require('express');
const upload = require('../config/multer');
const propertyController = require('../controllers/property-controller');
const PropertyController = require('../controllers/property-controller');

const router = Router();

router.post(
  '/',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'file', maxCount: 5 }]),
  PropertyController.postProperty,
);
router.get('/:id', propertyController.getPropertyById);
router.get('/find', PropertyController.getAllProperties);
router.put('/edit/:id', PropertyController.updateProperty);
module.exports = router;
