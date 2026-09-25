import express from 'express';
import mongoose from 'mongoose';
import EmotionVerse from '../models/EmotionVerse.js';
import { seedEmotions } from '../seed/data.js';
import { getVerseFromQuranApi } from '../services/quranApi.js';

const router = express.Router();

/**
 * GET /api/verses/:emotion
 * Looks up verseRefs + reflection for that emotion in MongoDB (or seed data fallback)
 * Fetches Arabic text + English translation from Quran.com API server-side
 * Returns combined JSON with reflection & Surah metadata
 */
router.get('/:emotion', async (req, res) => {
  const { emotion } = req.params;
  const excludeRef = req.query.exclude; // optional parameter to cycle verses

  try {
    const normalizedEmotion = emotion.toLowerCase().trim();
    let entry = null;

    if (mongoose.connection.readyState === 1) {
      entry = await EmotionVerse.findOne({
        $or: [
          { emotion: normalizedEmotion },
          { displayName: new RegExp(`^${normalizedEmotion}$`, 'i') },
        ],
      });
    } else {
      entry = seedEmotions.find(
        (item) =>
          item.emotion.toLowerCase() === normalizedEmotion ||
          item.displayName.toLowerCase() === normalizedEmotion
      );
    }

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: `No verse mapping found for emotion: "${emotion}".`,
      });
    }

    if (!entry.verseRefs || entry.verseRefs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No verse references configured for "${emotion}".`,
      });
    }

    // Select verse reference: if exclude is set and multiple exist, pick another one
    let candidates = entry.verseRefs;
    if (excludeRef && candidates.length > 1) {
      const filtered = candidates.filter((ref) => ref !== excludeRef);
      if (filtered.length > 0) candidates = filtered;
    }
    const chosenRef = candidates[Math.floor(Math.random() * candidates.length)];
    const [surah, ayah] = chosenRef.split(':');

    if (!surah || !ayah) {
      return res.status(500).json({
        success: false,
        message: `Invalid verse reference format: "${chosenRef}"`,
      });
    }

    // Fetch Arabic text and translation from Quran.com API
    const verseData = await getVerseFromQuranApi(surah, ayah);

    // Return combined response
    return res.json({
      success: true,
      emotion: entry.displayName || entry.emotion,
      emotionKey: entry.emotion,
      category: entry.category,
      verseRef: chosenRef,
      surah: verseData.surah,
      ayah: verseData.ayah,
      arabic: verseData.arabic,
      translation: verseData.translation,
      translator: verseData.translator,
      surahName: verseData.surahName,
      surahArabic: verseData.surahArabic,
      surahMeaning: verseData.surahMeaning,
      reflection: entry.reflection,
      audioUrl: verseData.audioUrl,
      totalVerses: entry.verseRefs.length,
      availableRefs: entry.verseRefs,
    });
  } catch (error) {
    console.error(`Error in /api/verses/${emotion}:`, error);
    return res.status(502).json({
      success: false,
      message:
        'We were temporarily unable to fetch the verse from the Quran service. Please try again in a few moments.',
      error: error.message,
    });
  }
});

export default router;
