const notFound = (req, res) => {
  res.status(404).json({ message: 'Route Doesnt Exist' });
};
module.exports = notFound;
