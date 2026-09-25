import express from 'express';
import mongoose from 'mongoose';
import EmotionVerse from '../models/EmotionVerse.js';
import { seedEmotions } from '../seed/data.js';

const router = express.Router();

/**
 * GET /api/emotions
 * Returns list of emotions from MongoDB (or graceful fallback if DB is offline)
 */
router.get('/', async (req, res) => {
  try {
    let emotions;

    if (mongoose.connection.readyState === 1) {
      emotions = await EmotionVerse.find(
        {},
        'emotion displayName category reflection'
      ).sort({ category: 1, displayName: 1 });
    } else {
      // In-memory fallback
      emotions = seedEmotions.map((e) => ({
        emotion: e.emotion,
        displayName: e.displayName,
        category: e.category,
        reflection: e.reflection,
      }));
    }

    return res.json({
      success: true,
      count: emotions.length,
      source: mongoose.connection.readyState === 1 ? 'mongodb' : 'in-memory-store',
      data: emotions,
    });
  } catch (error) {
    console.error('Error fetching emotions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve emotions from database',
      error: error.message,
    });
  }
});

export default router;
