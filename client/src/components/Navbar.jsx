import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Compass, Volume2, VolumeX } from 'lucide-react';

export default function Navbar({ onSelectEmotion, onScrollToEmotions }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#080a0f]/80 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500/30 to-amber-400/20 border border-white/20 flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 group-hover:bg-rose-300 shadow-[0_0_12px_rgba(244,114,182,0.8)] transition-all"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-[0.25em] text-white group-hover:text-rose-200 transition-colors uppercase">
              Sakinah
            </span>
            <span className="text-[10px] font-arabic text-slate-400 -mt-0.5 tracking-wider">
              سَكِينَة
            </span>
          </div>
        </a>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a
            href="#emotions"
            className="hover:text-rose-300 transition-colors focus:outline-none"
          >
            Emotions
          </a>
          <a
            href="#solace"
            className="hover:text-rose-300 transition-colors focus:outline-none"
          >
            Solace
          </a>
          <a
            href="#uplifting"
            className="hover:text-rose-300 transition-colors focus:outline-none"
          >
            Gratitude & Hope
          </a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={onScrollToEmotions}
            className="px-5 py-2 rounded-full text-xs sm:text-sm font-medium text-slate-900 bg-white hover:bg-slate-100 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Find Solace</span>
          </button>
        </div>
      </div>
    </header>
  );
}
