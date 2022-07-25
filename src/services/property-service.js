class PropertyService {
  createProperty = async (req) => {
    console.log(req.body);
  };
}

module.exports = new PropertyService();
