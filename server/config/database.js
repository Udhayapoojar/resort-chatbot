const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/resort-chatbot';

    await mongoose.connect(mongoUri);

    console.log('[v0] MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('[v0] MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = { connectDB };