import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import EmotionVerse from '../models/EmotionVerse.js';
import { seedEmotions } from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sakinah';

export async function seedDatabase() {
  console.log('Connecting to MongoDB at:', MONGO_URI);
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    console.log('Clearing existing emotionVerses collection...');
    await EmotionVerse.deleteMany({});

    console.log(`Seeding ${seedEmotions.length} emotions into emotionVerses...`);
    const inserted = await EmotionVerse.insertMany(seedEmotions);
    console.log(`Successfully seeded ${inserted.length} emotions!`);

    return inserted;
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
}

// If run directly via node seed/seed.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed. Exiting process.');
      mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Fatal error during seed:', err);
      process.exit(1);
    });
}
