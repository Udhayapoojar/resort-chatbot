const mongoose = require('mongoose');

const touristPlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    distance: {
      type: Number, // in kilometers
    },
    travelTime: {
      type: String, // e.g., "30 minutes"
    },
    attractions: [String],
    keywords: {
      type: [String],
      index: true,
      default: [],
    },
    category: {
      type: String,
      enum: ['nature', 'historical', 'adventure', 'cultural', 'shopping', 'dining'],
      default: 'nature',
      index: true,
    },
    entryFee: String,
    bestTimeToVisit: String,
    activities: [String],
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TouristPlace', touristPlaceSchema);
