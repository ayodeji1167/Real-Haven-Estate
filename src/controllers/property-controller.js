const PropertyService = require('../services/property-service');

class PropertyController {
  postProperty = async (req, res) => {
    const property = await PropertyService.createProperty(req);
    res.status(200).json({
      message: 'Property Created',
      property,
    });
  };

  getAllProperties = async (req, res) => {
    const properties = await PropertyService.getAllProperties(req);
    res.status(200).send(properties);
  };
}

module.exports = new PropertyController();
