const { Schema, model } = require('mongoose');
const { DB_COLLECTION } = require('../config/constants');

const InsightSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  totalViews: {
    type: Number,
  },
  topCountries: {
    type: [String],
  },
  topStates: {
    type: [String],
  },
});

const InsightModel = model(DB_COLLECTION.INSIGHT, InsightSchema);
module.exports = InsightModel;
