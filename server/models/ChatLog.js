const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    userMessage: {
      type: String,
      required: true,
    },
    botResponse: {
      type: String,
      required: true,
    },
    responseType: {
      type: String,
      enum: ['faq', 'tourist_place', 'resort_info', 'no_match'],
      default: 'no_match',
    },
    sourceId: mongoose.Schema.Types.ObjectId, // Reference to FAQ/TouristPlace/ResortInfo
    confidence: Number, // 0-100 score for relevance
    userRating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: mongoose.Schema.Types.Mixed, // flexible for additional data
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatLog', chatLogSchema);
