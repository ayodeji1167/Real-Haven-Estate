const { Schema, model } = require('mongoose');
const constants = require('../config/constants');

const PropertySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['BUY', 'SELL', 'RENT', 'SHORTLET'],
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },

  noOfBedroom: {
    type: Number,
    required: true,
  },
  noOfBathroom: {
    type: Number,
    required: true,
  },
  noOfToilet: {
    type: Number,
    required: true,
  },
  stateOfBuilding: {
    type: String,
    enum: ['FURNISHED', 'SERVICED', 'NEWLY-BUILT'],
  },

  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ['NAIRA', 'DOLLAR', 'EURO', 'POUND'],
  },
  additionalFeatures: {
    type: [String],
  },
  mainImage: {
    url: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
  },
  video: {
    url: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
  },
  otherImages: {
    url: {
      type: [String],
    },
    cloudinaryId: {
      type: [String],
    },
  },
});

const PropertyModel = model(constants.DB_COLLECTION.PROPERTY, PropertySchema);
module.exports = PropertyModel;
