import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

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
    id: 'twilight-flowers',
    src: '/backgrounds/bg-4.png',
    title: 'Twilight Floral Meadow',
    location: 'Nocturnal Bloom & Serenity',
  },
];

// 5 minutes in milliseconds
const ROTATION_INTERVAL_MS = 5 * 60 * 1000;

export default function BackgroundSlider({ currentIndex, onIndexChange }) {
  const [activeIdx, setActiveIdx] = useState(currentIndex || 0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Synchronize internal state if controlled from outside
  useEffect(() => {
    if (currentIndex !== undefined && currentIndex !== activeIdx) {
      setActiveIdx(currentIndex);
    }
  }, [currentIndex]);

  // 5-minute interval timer for auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % BACKGROUND_SCENES.length;
        if (onIndexChange) onIndexChange(next);
        return next;
      });
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [onIndexChange]);

  const goToScene = (index) => {
    if (index === activeIdx || isTransitioning) return;
    setIsTransitioning(true);
    setActiveIdx(index);
    if (onIndexChange) onIndexChange(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const nextScene = () => {
    const next = (activeIdx + 1) % BACKGROUND_SCENES.length;
    goToScene(next);
  };

  const prevScene = () => {
    const prev = (activeIdx - 1 + BACKGROUND_SCENES.length) % BACKGROUND_SCENES.length;
    goToScene(prev);
  };

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden select-none">
      {/* Background Images with Crossfade */}
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
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        );
      })}

      {/* Atmospheric Overlays for maximum text contrast across all devices */}
      {/* 1. Global soft dark scrim */}
      <div className="absolute inset-0 bg-[#080a0f]/55 md:bg-[#080a0f]/50" />

      {/* 2. Top-to-bottom vignette gradient to ensure hero and verse readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080a0f]/90 via-[#080a0f]/45 to-[#080a0f]/95 pointer-events-none" />

      {/* 3. Subtle radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,10,15,0.7)_100%)] pointer-events-none" />

      {/* Discreet Scene Switcher Widget (bottom-right / bottom-center on mobile) */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 pointer-events-auto z-40 flex items-center gap-2">
        <div className="glass-panel px-3 py-2 rounded-full border border-white/10 shadow-lg shadow-black/50 flex items-center gap-2 text-xs text-slate-300 backdrop-blur-md">
          <button
            onClick={prevScene}
            title="Previous Scene"
            className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors active:scale-95"
            aria-label="Previous scene"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Indicators for the 4 scenes */}
          <div className="flex items-center gap-1.5 px-1">
            {BACKGROUND_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => goToScene(idx)}
                title={`${scene.title} (${idx + 1}/${BACKGROUND_SCENES.length}) - Changes every 5 min`}
                className={`transition-all rounded-full ${
                  idx === activeIdx
                    ? 'w-5 h-1.5 bg-rose-400'
                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Switch to ${scene.title}`}
              />
            ))}
          </div>

          <button
            onClick={nextScene}
            title="Next Scene"
            className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors active:scale-95"
            aria-label="Next scene"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Current scene name on tablet/desktop */}
          <span className="hidden md:inline-block border-l border-white/10 pl-2 text-[11px] text-slate-400 max-w-[140px] truncate">
            {BACKGROUND_SCENES[activeIdx].title}
          </span>
        </div>
      </div>
    </div>
  );
}
