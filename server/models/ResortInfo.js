const mongoose = require('mongoose');

const resortInfoSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      index: true,
      enum: ['overview', 'amenities', 'rooms', 'dining', 'activities', 'contact', 'location'],
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      index: true,
      default: [],
    },
    displayOrder: Number,
    details: mongoose.Schema.Types.Mixed, // flexible schema for various details
  },
  { timestamps: true }
);

module.exports = mongoose.model('ResortInfo', resortInfoSchema);
