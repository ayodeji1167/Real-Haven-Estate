const PropertyService = require('../services/property-service');

class PropertyController {
  postProperty = async (req, res) => {
    const property = await PropertyService.createProperty(req);
    res.status(200).json({
      message: 'Property Created',
      property,
    });
  };


  postPropertyForDraft = async (req, res) => {
    const property = await PropertyService.createPropertyDraft(req);
    res.status(200).json({
      message: 'Property Created',
      property,
    });
  };

  getAllProperties = async (req, res) => {
    const properties = await PropertyService.getAllProperties(req);
    res.status(200).send(properties);
  };

  updateProperty = async (req, res) => {
    const updatedProperty = await PropertyService.updateProperty(req);
    res.status(200).send(updatedProperty);
  };
}

module.exports = new PropertyController();
