import React, { useState } from 'react';
import {
  Wind,
  Flame,
  Droplets,
  Moon,
  HeartCrack,
  ShieldAlert,
  Compass,
  Eye,
  Anchor,
  Layers,
  RotateCcw,
  Shield,
  Hourglass,
  HelpCircle,
  BatteryLow,
  Sun,
  Smile,
  Feather,
  Sunrise,
  Heart,
  Sparkles,
  Search,
} from 'lucide-react';

// Icon mapping per emotion key
const EMOTION_ICONS = {
  anxiety: Wind,
  stress: ShieldAlert,
  sadness: Droplets,
  depression: Moon,
  'grief-loss': HeartCrack,
  anger: Flame,
  fear: Compass,
  loneliness: Eye,
  hopelessness: Anchor,
  overwhelm: Layers,
  'guilt-regret': RotateCcw,
  'jealousy-envy': Shield,
  impatience: Hourglass,
  'uncertainty-doubt': HelpCircle,
  'fatigue-burnout': BatteryLow,
  gratitude: Sun,
  'happiness-joy': Smile,
  contentment: Feather,
  hope: Sunrise,
  love: Heart,
  forgiveness: Sparkles,
};

// Subtle mood color schemes for chips with strong frosted glass for phone & tablet readability
const MOOD_STYLES = {
  solace: {
    badge:
      'border-white/10 bg-[#0c1017]/80 text-slate-200 hover:border-rose-400/50 hover:bg-rose-950/40 hover:text-white backdrop-blur-md',
    iconColor: 'text-rose-300',
    glow: 'group-hover:shadow-[0_0_20px_rgba(244,114,182,0.25)]',
  },
  uplifting: {
    badge:
      'border-white/10 bg-[#0c1017]/80 text-slate-200 hover:border-amber-400/50 hover:bg-amber-950/40 hover:text-white backdrop-blur-md',
    iconColor: 'text-amber-300',
    glow: 'group-hover:shadow-[0_0_20px_rgba(230,195,135,0.28)]',
  },
};

export default function EmotionGrid({
  emotions,
  onSelectEmotion,
  selectedEmotion,
  isLoading,
}) {
  const [search, setSearch] = useState('');

  // Filter emotions based on search query
  const filteredEmotions = emotions.filter((item) =>
    (item.displayName || item.emotion).toLowerCase().includes(search.toLowerCase())
  );

  const solaceEmotions = filteredEmotions.filter(
    (e) => e.category === 'solace' || !e.category
  );
  const upliftingEmotions = filteredEmotions.filter(
    (e) => e.category === 'uplifting'
  );

  return (
    <section id="emotions" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      {/* Section Header with frosted backing for high contrast on all devices */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-3 sm:mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          What is your heart carrying today?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] px-2">
          Select any feeling to receive a curated verse from the Quran, accompanied by a soothing reflection and live recitation.
        </p>

        {/* Search Box - Touch-friendly and responsive */}
        <div className="mt-6 sm:mt-8 max-w-md mx-auto relative px-2 sm:px-0">
          <Search className="absolute left-6 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feelings (e.g. anxiety, hope, patience)..."
            className="w-full pl-11 pr-10 py-3 sm:py-2.5 rounded-full bg-[#0c1017]/90 border border-white/15 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-rose-400/60 focus:bg-[#121824] shadow-lg shadow-black/40 backdrop-blur-md transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-6 sm:right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Group 1: Seeking Solace & Steadfastness (Heavier / Reflective) */}
      <div id="solace" className="mb-12 sm:mb-14">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-rose-200/90 px-3.5 py-1 rounded-full bg-[#0c1017]/85 border border-white/15 backdrop-blur-md shadow-sm">
            Seeking Solace & Comfort
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
        </div>

        <div className="flex flex-wrap gap-2.5 sm:gap-3.5 justify-center">
          {solaceEmotions.map((item) => {
            const Icon = EMOTION_ICONS[item.emotion] || Wind;
            const style = MOOD_STYLES.solace;
            const isSelected = selectedEmotion === item.emotion;

            return (
              <button
                key={item.emotion}
                onClick={() => onSelectEmotion(item.emotion)}
                disabled={isLoading}
                className={`group relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full border text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer shadow-md shadow-black/30 min-h-[44px] ${
                  isSelected
                    ? 'border-rose-400 bg-rose-500/30 text-white shadow-[0_0_25px_rgba(244,114,182,0.45)] scale-105'
                    : style.badge
                } ${style.glow} active:scale-95`}
              >
                <Icon
                  className={`w-3.5 sm:w-4 h-3.5 sm:h-4 transition-transform group-hover:scale-110 shrink-0 ${
                    isSelected ? 'text-rose-300' : style.iconColor
                  }`}
                />
                <span className="whitespace-nowrap">{item.displayName || item.emotion}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Group 2: Gratitude, Peace & Elevation (Lighter / Positive) */}
      <div id="uplifting" className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-amber-200/90 px-3.5 py-1 rounded-full bg-[#0c1017]/85 border border-white/15 backdrop-blur-md shadow-sm">
            Gratitude, Peace & Joy
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
        </div>

        <div className="flex flex-wrap gap-2.5 sm:gap-3.5 justify-center">
          {upliftingEmotions.map((item) => {
            const Icon = EMOTION_ICONS[item.emotion] || Sun;
            const style = MOOD_STYLES.uplifting;
            const isSelected = selectedEmotion === item.emotion;

            return (
              <button
                key={item.emotion}
                onClick={() => onSelectEmotion(item.emotion)}
                disabled={isLoading}
                className={`group relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full border text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer shadow-md shadow-black/30 min-h-[44px] ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/30 text-white shadow-[0_0_25px_rgba(230,195,135,0.45)] scale-105'
                    : style.badge
                } ${style.glow} active:scale-95`}
              >
                <Icon
                  className={`w-3.5 sm:w-4 h-3.5 sm:h-4 transition-transform group-hover:scale-110 shrink-0 ${
                    isSelected ? 'text-amber-300' : style.iconColor
                  }`}
                />
                <span className="whitespace-nowrap">{item.displayName || item.emotion}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredEmotions.length === 0 && (
        <div className="text-center py-12 text-slate-300 text-sm bg-[#0c1017]/80 rounded-2xl border border-white/10 max-w-md mx-auto">
          No feelings matched "{search}". Try searching for another feeling or clear the search.
        </div>
      )}
    </section>
  );
}
