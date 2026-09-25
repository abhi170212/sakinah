import axios from 'axios';
import { SURAH_METADATA } from './surahMetadata.js';

// In-process cache with TTL (15 minutes)
const CACHE_TTL_MS = 15 * 60 * 1000;
const verseCache = new Map();

/**
 * Strips HTML tags, footnote superscripts, and cleans up extra whitespace
 */
function cleanTranslationText(text) {
  if (!text) return '';
  return text
    .replace(/<sup[^>]*>.*?<\/sup>/gi, '') // remove footnotes
    .replace(/<\/?[^>]+(>|$)/g, '') // remove HTML tags
    .replace(/\s+/g, ' ') // normalize whitespace
    .trim();
}

/**
 * Generates official high-quality Mishary Rashid Alafasy audio URL
 * Audio filenames on verses.quran.com follow 6-digit format: SSSAAA (3 digits surah, 3 digits ayah)
 */
function getAudioUrl(surah, ayah) {
  const s = String(surah).padStart(3, '0');
  const a = String(ayah).padStart(3, '0');
  return `https://verses.quran.com/Alafasy/mp3/${s}${a}.mp3`;
}

/**
 * Fetches verse data (Arabic Uthmani text + English translation) from Quran.com API
 * with in-memory caching.
 *
 * @param {string|number} surah
 * @param {string|number} ayah
 * @returns {Promise<Object>}
 */
export async function getVerseFromQuranApi(surah, ayah) {
  const cacheKey = `${surah}:${ayah}`;
  const now = Date.now();

  // Check cache
  if (verseCache.has(cacheKey)) {
    const cached = verseCache.get(cacheKey);
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    verseCache.delete(cacheKey);
  }

  // Request from Quran.com v4 API
  // Translation ID 20 = Saheeh International, ID 131 = The Clear Quran (Dr. Mustafa Khattab)
  const url = `https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?language=en&words=false&translations=20,131&fields=text_uthmani`;

  try {
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Sakinah-App/1.0',
      },
    });

    const verseData = response.data?.verse;
    if (!verseData) {
      throw new Error(`Verse ${surah}:${ayah} not found in Quran.com response.`);
    }

    const arabicText = verseData.text_uthmani || '';
    
    // Choose translation: Saheeh International (id 20) or fallback to first available
    let rawTranslation = '';
    let translatorName = 'Saheeh International';

    if (Array.isArray(verseData.translations) && verseData.translations.length > 0) {
      const sahih = verseData.translations.find((t) => t.resource_id === 20);
      if (sahih) {
        rawTranslation = sahih.text;
        translatorName = 'Saheeh International';
      } else {
        rawTranslation = verseData.translations[0].text;
        translatorName = 'Quran.com English Translation';
      }
    }

    const cleanedTranslation = cleanTranslationText(rawTranslation);
    const surahMeta = SURAH_METADATA[Number(surah)] || {
      name: `Surah ${surah}`,
      arabic: '',
      english: '',
    };

    const formattedResult = {
      verseKey: `${surah}:${ayah}`,
      surah: Number(surah),
      ayah: Number(ayah),
      arabic: arabicText,
      translation: cleanedTranslation,
      translator: translatorName,
      surahName: surahMeta.name,
      surahArabic: surahMeta.arabic,
      surahMeaning: surahMeta.english,
      audioUrl: getAudioUrl(surah, ayah),
    };

    // Store in cache
    verseCache.set(cacheKey, {
      timestamp: now,
      data: formattedResult,
    });

    return formattedResult;
  } catch (error) {
    console.error(`Error querying Quran.com API for ${surah}:${ayah}:`, error.message);
    throw new Error(
      error.response?.data?.message ||
        `Unable to retrieve verse ${surah}:${ayah} from Quran.com. Please check your connection.`
    );
  }
}
