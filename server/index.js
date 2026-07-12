require('express-async-errors');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/database');

const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://resort-chatbot-swart.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean).map(url => url.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman and server-to-server requests
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.trim().replace(/\/$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      // Gracefully deny origin instead of throwing an error which triggers Express 500 handler
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: NODE_ENV,
    timestamp: new Date(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Resort Chatbot API',
    version: '1.0.0',
    endpoints: {
      chat: '/api/chat/message',
      health: '/health',
      admin: '/api/admin',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[v0] Error:', err);
  res.status(500).json({
    success: false,
    error: NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(PORT, () => {
      console.log(`[v0] Resort Chatbot API running on port ${PORT}`);
      console.log(`[v0] Environment: ${NODE_ENV}`);
      console.log(`[v0] API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[v0] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
