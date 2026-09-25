import React from 'react';
import { ArrowDown, Sparkles, BookOpen, Clock } from 'lucide-react';

export default function Hero({ onExploreClick, currentScene }) {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] md:min-h-screen flex flex-col justify-between overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-8 px-4 sm:px-6">
      {/* Top subtle spacing to account for fixed navbar */}
      <div className="h-4 sm:h-8" />

      {/* Hero Content (Cleanly centered & responsive for phone, tablet, desktop) */}
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center my-auto flex flex-col items-center">
        {/* Subtle Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-rose-200 mb-5 sm:mb-6 shadow-inner animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
          <span>Emotional Solace Through Revelation</span>
        </div>

        {/* Main Serif Headline - fully responsive */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white max-w-3xl leading-[1.18] sm:leading-[1.15] mb-4 sm:mb-5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] px-2">
          Find Peace in the Words of Your Creator
        </h1>

        {/* Subtitle - responsive sizing and comfortable line height */}
        <p className="text-slate-200/90 text-sm sm:text-base md:text-lg lg:text-xl font-light max-w-2xl mb-8 sm:mb-10 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] px-4">
          Select what your heart is experiencing, and receive authentic Quranic verses, gentle reflections, and live recitations.
        </p>

        {/* Primary Action Buttons - responsive column on mobile, row on tablet/desktop */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-slate-900 font-medium text-sm sm:text-base hover:bg-slate-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2.5 group cursor-pointer shadow-lg shadow-black/30"
          >
            <span>Explore Emotions</span>
            <ArrowDown className="w-4 h-4 text-slate-700 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <a
            href="#solace"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white font-medium text-sm border border-white/15 backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20"
          >
            <Sparkles className="w-4 h-4 text-rose-300" />
            <span>Seek Solace</span>
          </a>
        </div>

        {/* Dynamic Scene Indicator Note */}
        {currentScene && (
          <div className="mt-8 inline-flex items-center gap-2 text-[11px] sm:text-xs text-slate-300/80 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <Clock className="w-3 h-3 text-rose-300" />
            <span>Atmosphere: {currentScene.title} (Auto-rotates every 30s)</span>
          </div>
        )}
      </div>

      {/* Scroll Hint at Bottom */}
      <div className="relative z-10 pt-4 pb-2 text-center flex flex-col items-center gap-2 text-xs text-white/70">
        <span className="tracking-widest uppercase text-[9px] sm:text-[10px] text-white/50">
          Scroll to explore feelings
        </span>
        <div className="w-5 h-7 sm:h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
          <span className="w-1 h-2 rounded-full bg-rose-400 animate-bounce"></span>
        </div>
      </div>
    </section>
  );
}
