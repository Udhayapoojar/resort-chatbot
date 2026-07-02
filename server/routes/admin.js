const express = require('express');
const FAQ = require('../models/FAQ');
const TouristPlace = require('../models/TouristPlace');
const ResortInfo = require('../models/ResortInfo');
const ChatLog = require('../models/ChatLog');

const router = express.Router();

// Simple auth middleware (can be improved with JWT)
const adminAuth = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey === process.env.ADMIN_KEY || process.env.ADMIN_KEY === 'dev-key') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// FAQ endpoints
router.post('/faq', adminAuth, async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    await faq.save();
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/faq', async (req, res) => {
  try {
    const faqs = await FAQ.find().limit(50);
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/faq/:id', adminAuth, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/faq/:id', adminAuth, async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Tourist Places endpoints
router.post('/tourist-places', adminAuth, async (req, res) => {
  try {
    const place = new TouristPlace(req.body);
    await place.save();
    res.json({ success: true, data: place });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/tourist-places', async (req, res) => {
  try {
    const places = await TouristPlace.find().limit(50);
    res.json({ success: true, data: places });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/tourist-places/:id', adminAuth, async (req, res) => {
  try {
    const place = await TouristPlace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: place });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/tourist-places/:id', adminAuth, async (req, res) => {
  try {
    await TouristPlace.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Resort Info endpoints
router.post('/resort-info', adminAuth, async (req, res) => {
  try {
    const info = new ResortInfo(req.body);
    await info.save();
    res.json({ success: true, data: info });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/resort-info', async (req, res) => {
  try {
    const infos = await ResortInfo.find().limit(50);
    res.json({ success: true, data: infos });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/resort-info/:id', adminAuth, async (req, res) => {
  try {
    const info = await ResortInfo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: info });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/resort-info/:id', adminAuth, async (req, res) => {
  try {
    await ResortInfo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Chat analytics endpoints
router.get('/analytics/chat-logs', adminAuth, async (req, res) => {
  try {
    const { days = 30, limit = 100 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const logs = await ChatLog.find({ timestamp: { $gte: startDate } })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/analytics/stats', adminAuth, async (req, res) => {
  try {
    const totalChats = await ChatLog.countDocuments();
    const successfulChats = await ChatLog.countDocuments({ responseType: { $ne: 'no_match' } });
    const avgConfidence = await ChatLog.aggregate([
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: '$confidence' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalChats,
        successfulChats,
        successRate: ((successfulChats / totalChats) * 100).toFixed(2),
        averageConfidence: avgConfidence[0]?.avgConfidence?.toFixed(2) || 0,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
