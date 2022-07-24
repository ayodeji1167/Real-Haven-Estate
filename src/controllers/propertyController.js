const PropertyService = require('../services/property-service');
const constants = require('../config/constants');

class UserController {
    createPropertyHandler = async (req, res) => {
        const property = await PropertyService.createProperty(req)
        res.status(200).json({
          message: constants.MESSAGES.PROPERTY_CREATED,
          property,
        });
      };
}

module.exports = new UserController();
