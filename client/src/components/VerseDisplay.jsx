import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw,
  ArrowLeft,
  Copy,
  Check,
  Play,
  Pause,
  Sparkles,
  Heart,
} from 'lucide-react';

export default function VerseDisplay({
  verseData,
  isLoading,
  error,
  onShowAnother,
  onBack,
}) {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);

  // Reset audio when verse changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setAudioProgress(0);
    }
  }, [verseData?.verseRef]);

  const handleCopy = () => {
    if (!verseData) return;
    const textToCopy = `"${verseData.arabic}"\n\n"${verseData.translation}"\n\n— Surah ${verseData.surahName} [${verseData.verseRef}]\n(Sakinah App)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Audio playback failed:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration || 1;
      setAudioProgress((current / total) * 100);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <section className="min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="bg-[#0c1017]/90 backdrop-blur-2xl max-w-lg w-full p-8 sm:p-12 rounded-3xl text-center border border-white/15 shadow-2xl relative overflow-hidden animate-fade-in">
          <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-rose-400/40 animate-ping opacity-60"></div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-rose-500/20 to-amber-400/20 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-rose-300 animate-spin" />
            </div>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-2">
            Seeking Tranquility
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
            Gathering a comforting verse and reflection for your heart...
          </p>
        </div>
      </section>
    );
  }

  // 2. Error State
  if (error || !verseData) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="bg-[#0c1017]/90 backdrop-blur-2xl max-w-md w-full p-6 sm:p-8 rounded-3xl text-center border border-white/15 shadow-2xl animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto mb-4 text-rose-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-white mb-2">
            A Momentary Pause
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
            {error || 'Unable to load verse. Please try again.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onShowAnother}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-slate-900 font-medium text-xs sm:text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white/10 text-slate-200 font-medium text-xs sm:text-sm hover:bg-white/15 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Emotions</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 3. Verse Display View
  return (
    <section className="min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center px-3 sm:px-6 py-12 sm:py-16 md:py-20 relative">
      <div className="relative max-w-3xl w-full mx-auto">
        {/* Top Navigation Row - fully responsive for phones */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6 px-1">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#0c1017]/80 border border-white/15 flex items-center justify-center group-hover:bg-white/15 transition-all">
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
            <span>Back to all emotions</span>
          </button>

          {/* Emotion Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c1017]/85 border border-white/15 text-xs font-medium text-slate-200 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>Verses for {verseData.emotion}</span>
          </div>
        </div>

        {/* Main Verse Card - deep frosted glass for crystal clarity */}
        <div className="bg-[#0c1017]/92 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.85)] relative overflow-hidden animate-fade-up">
          {/* Subtle Top Accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-400/50 to-transparent" />

          {/* Surah & Ayah Reference Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/10 gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base font-semibold text-white tracking-wide">
                  Surah {verseData.surahName}
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  ({verseData.surahMeaning})
                </span>
              </div>
              <div className="text-xs text-rose-300 mt-0.5 font-medium">
                Ayah {verseData.ayah} • Reference {verseData.verseRef}
              </div>
            </div>

            {/* Arabic Surah Name Badge & Audio Reciter Button */}
            <div className="flex items-center gap-2.5 sm:gap-3 self-start sm:self-auto">
              <span className="font-arabic text-lg sm:text-xl text-amber-200/90 hidden sm:inline-block">
                سُورَة {verseData.surahArabic}
              </span>

              {/* Mishary Audio Reciter */}
              {verseData.audioUrl && (
                <>
                  <audio
                    ref={audioRef}
                    src={verseData.audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleAudioEnded}
                    preload="none"
                  />
                  <button
                    onClick={toggleAudio}
                    title="Listen to recitation by Mishary Rashid Alafasy"
                    className="relative flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-200 text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isPlaying ? 'Pause' : 'Recitation'}</span>
                    {isPlaying && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Audio Progress Bar (if playing) */}
          {isPlaying && (
            <div className="w-full bg-white/10 h-1 rounded-full my-3 sm:my-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-amber-300 h-full transition-all duration-200"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
          )}

          {/* Arabic Text Display */}
          <div className="my-6 sm:my-8 md:my-10 text-right">
            <p
              className="font-arabic text-2xl sm:text-3xl md:text-4xl text-slate-100 font-normal leading-[2.1] sm:leading-[2.3] tracking-wide select-text drop-shadow-md"
              dir="rtl"
            >
              {verseData.arabic}
            </p>
          </div>

          {/* English Translation */}
          <div className="mb-6 sm:mb-8 pt-4 border-t border-white/10">
            <p className="text-sm sm:text-base md:text-lg text-slate-200 font-light leading-relaxed select-text italic">
              "{verseData.translation}"
            </p>
            <div className="mt-2 text-right">
              <span className="text-[11px] text-slate-400 tracking-wider">
                — {verseData.translator || 'Saheeh International'}
              </span>
            </div>
          </div>

          {/* Heartfelt Human Reflection Card */}
          <div className="rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 p-4 sm:p-6 mb-6 sm:mb-8 relative">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-rose-300">
              <Heart className="w-3.5 h-3.5 fill-rose-400/30 text-rose-400 shrink-0" />
              <span>Heartfelt Reflection</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
              {verseData.reflection}
            </p>
          </div>

          {/* Action Toolbar - stack on phones, row on tablet/desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-white/10">
            {/* Left: Copy Verse Button */}
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[42px]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Verse</span>
                </>
              )}
            </button>

            {/* Right: Show another verse button */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onShowAnother}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-500/90 hover:to-rose-600 text-white text-xs sm:text-sm font-medium shadow-[0_0_20px_rgba(244,114,182,0.35)] transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer min-h-[42px]"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Show another verse</span>
              </button>
            </div>
          </div>
        </div>

        {/* Counter of available verses for this emotion */}
        {verseData.totalVerses > 1 && (
          <div className="text-center mt-3 sm:mt-4 text-[11px] sm:text-xs text-slate-400 drop-shadow">
            This emotion has {verseData.totalVerses} curated verses. Click "Show another verse" to cycle through them.
          </div>
        )}
      </div>
    </section>
  );
}
