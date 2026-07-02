const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      index: true,
    },
    answer: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      index: true,
      default: [],
    },
    category: {
      type: String,
      enum: ['booking', 'facilities', 'dining', 'activities', 'policies', 'general'],
      default: 'general',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FAQ', faqSchema);
