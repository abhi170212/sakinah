import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import EmotionGrid from './components/EmotionGrid.jsx';
import VerseDisplay from './components/VerseDisplay.jsx';
import BackgroundSlider, { BACKGROUND_SCENES } from './components/BackgroundSlider.jsx';

// Fallback emotions if server takes a moment on initial start
import { seedEmotions } from '../../server/seed/data.js';

export default function App() {
  const [emotions, setEmotions] = useState(seedEmotions || []);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [verseData, setVerseData] = useState(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(false);
  const [verseError, setVerseError] = useState(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const verseDisplayRef = useRef(null);
  const emotionsGridRef = useRef(null);

  // Fetch emotions list from backend on mount
  useEffect(() => {
    fetch('/api/emotions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setEmotions(data.data);
        }
      })
      .catch((err) => {
        console.warn('Using seeded default emotions while server connects:', err);
      });
  }, []);

  // Fetch verse for the chosen emotion
  const handleSelectEmotion = async (emotionKey, excludeRef = null) => {
    setSelectedEmotion(emotionKey);
    setIsLoadingVerse(true);
    setVerseError(null);

    // Scroll to verse display area smoothly
    setTimeout(() => {
      if (verseDisplayRef.current) {
        verseDisplayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);

    try {
      const url = excludeRef
        ? `/api/verses/${emotionKey}?exclude=${encodeURIComponent(excludeRef)}`
        : `/api/verses/${emotionKey}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Unable to retrieve verse from sanctuary.');
      }

      setVerseData(data);
    } catch (err) {
      console.error('Verse fetch error:', err);
      setVerseError(err.message || 'Network error fetching the verse. Please try again.');
    } finally {
      setIsLoadingVerse(false);
    }
  };

  const handleShowAnother = () => {
    if (selectedEmotion && verseData?.verseRef) {
      handleSelectEmotion(selectedEmotion, verseData.verseRef);
    } else if (selectedEmotion) {
      handleSelectEmotion(selectedEmotion);
    }
  };

  const handleBackToEmotions = () => {
    setVerseData(null);
    setSelectedEmotion(null);
    if (emotionsGridRef.current) {
      emotionsGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToEmotions = () => {
    const el = document.getElementById('emotions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200 relative">
      {/* 5-minute Auto-Changing Fullscreen Background Slider */}
      <BackgroundSlider
        currentIndex={currentBgIndex}
        onIndexChange={setCurrentBgIndex}
      />

      {/* Top Floating Navbar */}
      <Navbar
        onSelectEmotion={handleSelectEmotion}
        onScrollToEmotions={handleScrollToEmotions}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Responsive Hero Section */}
        <Hero
          onExploreClick={handleScrollToEmotions}
          currentScene={BACKGROUND_SCENES[currentBgIndex]}
        />

        {/* Dynamic Verse Display View (Rendered when an emotion is clicked) */}
        {(selectedEmotion || isLoadingVerse) && (
          <div ref={verseDisplayRef} className="scroll-mt-20">
            <VerseDisplay
              verseData={verseData}
              isLoading={isLoadingVerse}
              error={verseError}
              onShowAnother={handleShowAnother}
              onBack={handleBackToEmotions}
            />
          </div>
        )}

        {/* Responsive Emotion Chips Grid Section */}
        <div ref={emotionsGridRef} className="scroll-mt-16">
          <EmotionGrid
            emotions={emotions}
            onSelectEmotion={(key) => handleSelectEmotion(key)}
            selectedEmotion={selectedEmotion}
            isLoading={isLoadingVerse}
          />
        </div>
      </main>
    </div>
  );
}
