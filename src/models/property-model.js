const { Schema, model } = require('mongoose');
const constants = require('../config/constants');

const PropertySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },

  aptUnit: {
    type: String,
  },

  price: {
    type: String,
    required: true,
  },

  pricePer: {
    type: String,
  },

  propertyType: {
    type: String,
    required: true,
  },

  purpose: {
    type: String,
    required: true,
  },

  noOfBedroom: {
    type: String,
    required: true,
  },
  noOfBathroom: {
    type: String,
    required: true,
  },
  noOfToilet: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  stateOfBuilding: {
    type: [String],
    required: true,
  },

  promoted: {
    type: Boolean,
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
  otherImages: {
    url: {
      type: [String],
    },
    cloudinaryId: {
      type: [String],
    },
  },
}, { timestamps: true });

const PropertyModel = model(constants.DB_COLLECTION.PROPERTY, PropertySchema);
module.exports = PropertyModel;
