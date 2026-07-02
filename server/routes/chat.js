const express = require('express');
const { search, formatResponse, logChat } = require('../services/searchService');

const router = express.Router();

/**
 * POST /api/chat
 * Main chat endpoint
 * Body: { message: string, sessionId: string }
 */
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    if (!sessionId || !sessionId.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required',
      });
    }

    // Search for relevant information
    const searchResult = await search(message);

    // Format the response
    const botResponse = formatResponse(searchResult);

    // Log the interaction
    await logChat(
      sessionId,
      message,
      botResponse,
      botResponse.type,
      botResponse.sourceId,
      searchResult.confidence
    );

    return res.json({
      success: true,
      response: botResponse.text,
      type: botResponse.type,
      confidence: searchResult.confidence,
      alternatives: searchResult.alternatives || [],
    });
  } catch (error) {
    console.error('[v0] Chat endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/chat/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
  });
});

module.exports = router;
