# 🌿 Sakinah (سكينة) — Quranic Emotional Support Web App
https://sakinahh-9cya.onrender.com/#
> *"Unquestionably, by the remembrance of Allah hearts are assured."* — Surah Ar-Ra'd [13:28]

**Sakinah** is a calm, minimal, full-stack MERN application that offers spiritual solace and emotional reassurance. A user selects what their heart is experiencing, and the application fetches and displays a relevant Quran verse (Arabic Uthmani text + English translation + Surah/Ayah reference) live from the free public Quran.com REST API, accompanied by a compassionate human-written reflection and recitations.

---

## ✨ Design & Visual Philosophy

- **Dynamic 5-Minute Atmospheric Backgrounds:** Cycles smoothly between 4 serene scenes every 5 minutes with cinematic crossfade transitions:
  1. *Oasis Sanctuary at Sunset* (Desert palms, tranquil water & mosque)
  2. *Riverside Valley Mosque* (Mountain wildflower meadow & crystal river)
  3. *Alpine Dawn Solace* (Alpine peaks, stone cottage & sunlight)
  4. *Twilight Floral Meadow* (Lush wildflower bloom in twilight)
  Includes a discreet floating scene switcher to allow manual previewing or scene selection.
- **Full Responsiveness Across All Devices:** Fully adaptive design optimized for mobile phones (iPhone/Android touch targets ≥44px), tablets, and high-resolution desktop screens.
- **Deep Frosted Glass Contrast:** High-contrast frosted glass panels (`backdrop-blur-2xl`) ensure pristine readability of Arabic calligraphy, translations, and reflections regardless of background brightness.
- **Calm, Non-Clinical Emotion Palette:** 21 emotions organized into two visual moods:
  - **Seeking Solace & Steadfastness** *(Anxiety, Stress, Sadness, Depression, Grief/Loss, Anger, Fear, Loneliness, Hopelessness, Overwhelm, Guilt/Regret, Jealousy/Envy, Impatience, Uncertainty/Doubt, Fatigue/Burnout)*
  - **Gratitude, Peace & Elevation** *(Gratitude, Happiness/Joy, Contentment, Hope, Love, Forgiveness)*
- **Immersive Typography:** Authentic Arabic calligraphy in **Amiri** font with proper line-height and Tashkeel, paired with **Cormorant Garamond** headlines and **Plus Jakarta Sans** for modern clarity.
- **Audio Reciter Integration:** Sheikh Mishary Rashid Alafasy live recitation playback.
- **Zero Authentication / Zero Friction:** 100% private, no login, no accounts, no cookies.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Google Fonts (Amiri, Cormorant Garamond, Plus Jakarta Sans)
- **Backend:** Node.js, Express, Axios, CORS, Dotenv
- **Database:** MongoDB & Mongoose (collection: `emotionVerses`)
- **Data Source:** Quran.com REST API v4 (`https://api.quran.com/api/v4`)
  - Verse endpoint: `GET /verses/by_key/{surah}:{ayah}?language=en&words=false&translations=20,131&fields=text_uthmani`
  - Translation: Saheeh International (`resource_id: 20`) & The Clear Quran
  - In-memory TTL caching prevents excessive rate-limiting.

---

## 📁 Project Structure

```text
├── .env                       # Environment variables (PORT, MONGO_URI, CLIENT_URL)
├── package.json               # Root workspace scripts
├── README.md                  # Documentation and setup instructions
├── server/
│   ├── models/
│   │   └── EmotionVerse.js    # Mongoose schema for collection 'emotionVerses'
│   ├── routes/
│   │   ├── emotions.js        # GET /api/emotions
│   │   └── verses.js          # GET /api/verses/:emotion (with live Quran.com fetch)
│   ├── services/
│   │   ├── quranApi.js        # Quran.com REST API client & in-memory cache
│   │   └── surahMetadata.js   # 114 Surah names in English, Arabic & translations
│   ├── seed/
│   │   ├── data.js            # 21 emotions with authentic verse references & reflections
│   │   └── seed.js            # Standalone MongoDB seed script
│   ├── server.js              # Express server entry point
│   └── package.json           # Server dependencies
└── client/
    ├── public/
    │   ├── hero-bg.png        # Meadow hero background image
    │   └── favicon.svg        # Sakinah icon
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx     # Floating header with branding & solace action
    │   │   ├── Hero.jsx       # Atmospheric hero with image and headline
    │   │   ├── EmotionGrid.jsx# 21 soft emotion chips in two intuitive groups
    │   │   ├── VerseDisplay.jsx# Arabic text, translation, reflection & audio
    │   │   └── Footer.jsx     # Attribution, API credits, and information
    │   ├── App.jsx            # Main app controller
    │   ├── main.jsx           # React DOM root
    │   └── index.css          # Tailwind directives & glassmorphism utilities
    ├── index.html             # HTML shell with Google Fonts
    ├── tailwind.config.js     # Tailwind design system configuration
    ├── vite.config.js         # Vite dev configuration with proxy to port 5000
    └── package.json           # Client dependencies
```

---

## 📋 Data Model (MongoDB collection: `emotionVerses`)

The database stores **only** the emotion-to-verse-reference mapping and human reflections (never full verse texts, which are fetched live):

```json
{
  "emotion": "anxiety",
  "displayName": "Anxiety",
  "category": "solace",
  "verseRefs": ["94:5", "94:6", "65:3", "13:28"],
  "reflection": "When your chest feels tight and the future feels uncertain, remember that ease is not merely promised after hardship—it travels right beside it. Breathe, release what you cannot control, and entrust your heart to the One who never leaves it alone."
}
```

---

## 🚀 Quickstart & Setup Instructions

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **MongoDB**: (Optional) A local MongoDB daemon running on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI in `.env`.
  > *Note: If MongoDB is offline or not installed locally, the server automatically operates with the active in-memory seed dataset, ensuring zero setup friction.*

### 2. Install Dependencies

From the project root:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 3. Environment Variables (`.env`)
Create or edit `.env` in the root:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sakinah
CLIENT_URL=http://localhost:5173
```

### 4. Seed the Database
Populate the `emotionVerses` collection with all 21 emotions and authentic verse references:
```bash
npm run seed
# or
node server/seed/seed.js
```

### 5. Run the Application

**Option A — Run both concurrently:**
```bash
# Terminal 1: Start Express Backend (Port 5000)
npm run server

# Terminal 2: Start Vite React Frontend (Port 5173)
npm run client
```

Then visit: **`http://localhost:5173`**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/emotions` | Returns list of emotions (keys, display names, categories) |
| `GET` | `/api/verses/:emotion` | Fetches a random verse for the given emotion from Quran.com |
| `GET` | `/api/verses/:emotion?exclude=94:5` | Fetches an alternate verse, avoiding repeats |
| `GET` | `/api/health` | Healthcheck returning DB connection state and emotion count |

---

## ⚖️ Non-Goals & Integrity
- No authentication, user accounts, or tracking.
- No storage of static scripture in the database; verses are always streamed live via Quran.com.
- Respectful presentation of sacred text in verified Uthmani script and authentic translations.
