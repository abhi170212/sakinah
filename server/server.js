import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import emotionsRouter from './routes/emotions.js';
import versesRouter from './routes/verses.js';
import EmotionVerse from './models/EmotionVerse.js';
import { seedEmotions } from './seed/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sakinah';

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/emotions', emotionsRouter);
app.use('/api/verses', versesRouter);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const count = isConnected
    ? await EmotionVerse.countDocuments().catch(() => 0)
    : seedEmotions.length;

  res.json({
    status: 'ok',
    app: 'Sakinah — Quran Emotional Solace',
    database: isConnected ? 'connected (MongoDB)' : 'active (in-memory dataset fallback)',
    mongoUri: isConnected ? MONGO_URI : 'not connected (using seed store)',
    emotionsCount: count,
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend static build if present (for single-port deployment or preview)
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexHtml = path.join(clientDistPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) next();
  });
});

// Database connection helper
async function connectToMongo() {
  console.log('Connecting to MongoDB at:', MONGO_URI);
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log('Successfully connected to MongoDB.');

    // Auto-seed if collection is empty
    const count = await EmotionVerse.countDocuments();
    if (count === 0) {
      console.log('Collection empty. Seeding emotionVerses...');
      await EmotionVerse.insertMany(seedEmotions);
      console.log(`Seeded ${seedEmotions.length} emotions into MongoDB.`);
    }
  } catch (err) {
    console.warn('MongoDB connection note:', err.message);
    console.log('🌿 Running with active in-memory seed store (21 emotions ready).');
  }
}

// Start Server
async function startServer() {
  await connectToMongo();

  app.listen(PORT, () => {
    console.log(`🌿 Sakinah Backend Server is running at http://localhost:${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  - GET http://localhost:${PORT}/api/emotions`);
    console.log(`  - GET http://localhost:${PORT}/api/verses/:emotion`);
    console.log(`  - GET http://localhost:${PORT}/api/health`);
  });
}

startServer();
