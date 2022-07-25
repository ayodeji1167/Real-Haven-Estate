const PropertyService = require('../services/property-service');
const constants = require('../config/constants');

class PropertyController {
  createPropertyHandler = async (req, res) => {
    await PropertyService.createProperty(req);
    res.json({ messages: constants.MESSAGES.PROPERTY_CREATED });
  };
}

module.exports = new PropertyController();
