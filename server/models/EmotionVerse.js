import mongoose from 'mongoose';

const emotionVerseSchema = new mongoose.Schema(
  {
    emotion: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['solace', 'uplifting'],
      default: 'solace',
    },
    verseRefs: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one verse reference is required.',
      },
    },
    reflection: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: 'emotionVerses',
    timestamps: true,
  }
);

const EmotionVerse = mongoose.model('EmotionVerse', emotionVerseSchema);

export default EmotionVerse;
