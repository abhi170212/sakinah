import React from 'react';
import { Heart, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="about" className="border-t border-white/10 bg-[#06080b] py-16 text-slate-400 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-white/5">
          {/* Col 1: About Sakinah */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span className="text-base font-semibold tracking-wider text-white uppercase">
                Sakinah
              </span>
              <span className="text-xs font-arabic text-slate-400">سَكِينَة</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400/90 leading-relaxed">
              "Sakinah" represents the profound serenity and peace of mind descended into the hearts of believers. This app pairs everyday human emotions with timeless revelation.
            </p>
          </div>

          {/* Col 2: Dedication */}
          <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-rose-500/25 backdrop-blur-md relative overflow-hidden shadow-lg shadow-black/30">
            <div className="flex items-center gap-2 text-rose-300 text-xs uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>A Heartfelt Note</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed font-light italic">
              "Happy Birthday Esraa.May Allah bless you and grant you things you deserve. I do not know you as whole but as i know you, you are a soul whom Allah loves so much, I can not tell how much happy I am that you are in my life. I hope Allah will make your life so beautiful that you will not have any words to explain. &nbsp;&nbsp;&nbsp;&nbsp;~ Abhishek "
            </p>
          </div>

          {/* Col 3: Sources & APIs */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
              Sources & Gratitude
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scripture data and audio streams are gracefully retrieved via the free public{' '}
              <a
                href="https://quran.com"
                target="_blank"
                rel="noreferrer"
                className="text-rose-300 hover:text-rose-200 inline-flex items-center gap-1 underline underline-offset-2"
              >
                Quran.com API <ExternalLink className="w-3 h-3" />
              </a>
              . Recitations by Sheikh Mishary Rashid Alafasy.
            </p>
          </div>
        </div>

        {/* Bottom copyright / peace note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Sakinah. Built with peace, mindfulness, and contemplation.</p>
          <div className="flex items-center gap-2 text-rose-300/80">
            <span>May you find stillness wherever you are</span>
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
          </div>
        </div>
      </div>
    </footer>
  );
}
