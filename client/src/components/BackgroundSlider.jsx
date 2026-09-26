import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const BACKGROUND_SCENES = [
  {
    id: 'oasis-sunset',
    src: '/backgrounds/bg-1.jpg',
    title: 'Oasis Sanctuary at Sunset',
    location: 'Desert Palms & Evening Glow',
  },
  {
    id: 'mountain-mosque',
    src: '/backgrounds/bg-2.jpg',
    title: 'Riverside Valley Mosque',
    location: 'Mountain Meadows & Wildflowers',
  },
  {
    id: 'alpine-meadow',
    src: '/backgrounds/bg-3.jpg',
    title: 'Alpine Dawn Solace',
    location: 'Sunlight over Mountain Peaks',
  },
  {
    id: 'river-city-mosque',
    src: '/backgrounds/bg-5.jpg',
    title: 'River City Mosque at Dawn',
    location: 'Arched Bridge & Mountain Sunrise',
  },
];

// Auto-change every 30 seconds
const ROTATION_INTERVAL_MS = 30 * 1000;

export default function BackgroundSlider({ currentIndex, onIndexChange }) {
  const [activeIdx, setActiveIdx] = useState(currentIndex || 0);
  const timerRef = useRef(null);

  // Synchronize with external index if passed
  useEffect(() => {
    if (currentIndex !== undefined && currentIndex !== activeIdx) {
      setActiveIdx(currentIndex);
    }
  }, [currentIndex]);

  // Helper to start or reset the 30-second timer
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % BACKGROUND_SCENES.length;
        if (onIndexChange) onIndexChange(next);
        return next;
      });
    }, ROTATION_INTERVAL_MS);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onIndexChange]);

  const goToScene = (index) => {
    setActiveIdx(index);
    if (onIndexChange) onIndexChange(index);
    resetTimer(); // Reset 30s timer on user manual interaction
  };

  const nextScene = (e) => {
    e?.stopPropagation();
    const next = (activeIdx + 1) % BACKGROUND_SCENES.length;
    goToScene(next);
  };

  const prevScene = (e) => {
    e?.stopPropagation();
    const prev = (activeIdx - 1 + BACKGROUND_SCENES.length) % BACKGROUND_SCENES.length;
    goToScene(prev);
  };

  return (
    <>
      {/* 1. Background Visual Layers (Behind content: -z-10, pointer-events-none) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden select-none">
        {BACKGROUND_SCENES.map((scene, idx) => {
          const isActive = idx === activeIdx;
          return (
            <div
              key={scene.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            >
              <img
                src={scene.src}
                alt={scene.title}
                className={`w-full h-full object-cover object-center sm:object-center transition-transform duration-[20000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                loading={idx <= 1 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Global Dark Overlays for maximum text contrast across all devices */}
        <div className="absolute inset-0 bg-[#080a0f]/55 md:bg-[#080a0f]/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080a0f]/90 via-[#080a0f]/45 to-[#080a0f]/95 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,10,15,0.7)_100%)] pointer-events-none" />
      </div>

      {/* 2. Floating Background Scene Switcher Widget (Separate stacking context: z-50, pointer-events-auto) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-auto">
        <div className="glass-panel px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-white/20 shadow-2xl shadow-black/80 flex items-center gap-2 sm:gap-2.5 text-xs text-slate-200 backdrop-blur-xl bg-[#0c1017]/90">
          {/* Previous Button */}
          <button
            onClick={prevScene}
            title="Previous Background (or waits 30s)"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/15 active:bg-white/25 flex items-center justify-center transition-all cursor-pointer text-white"
            aria-label="Previous scene"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Indicator dots for all 5 scenes */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-1">
            {BACKGROUND_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={(e) => {
                  e.stopPropagation();
                  goToScene(idx);
                }}
                title={`${scene.title} (${idx + 1}/${BACKGROUND_SCENES.length})`}
                className={`transition-all rounded-full py-2 cursor-pointer flex items-center justify-center`}
                aria-label={`Switch to ${scene.title}`}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    idx === activeIdx
                      ? 'w-6 h-2 bg-rose-400 shadow-[0_0_10px_rgba(244,114,182,0.8)]'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextScene}
            title="Next Background (or waits 30s)"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/15 active:bg-white/25 flex items-center justify-center transition-all cursor-pointer text-white"
            aria-label="Next scene"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Current scene name & 30s indicator on tablet & desktop */}
          <div className="hidden md:flex flex-col border-l border-white/15 pl-2.5 pr-1 text-left">
            <span className="text-[11px] font-medium text-white max-w-[170px] truncate">
              {BACKGROUND_SCENES[activeIdx].title}
            </span>
            <span className="text-[9px] text-rose-300/80">
              Rotates every 30s • {activeIdx + 1} of {BACKGROUND_SCENES.length}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
