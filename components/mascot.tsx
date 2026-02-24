'use client';

import { useState, useEffect } from 'react';
import Emoji3D from '@/components/emoji3d';
import { useT } from '@/lib/language-context';

const GREETINGS = [
  { en: 'Ready to learn today? 🌟', ur: 'آج سیکھنے کے لیے تیار؟ 🌟' },
  { en: 'MashaAllah, keep going! ✨', ur: 'ماشاءاللہ، جاری رکھو! ✨' },
  { en: 'Every dua brings you closer to Allah 🤲', ur: 'ہر دعا تمھیں اللہ سے قریب کرتی ہے 🤲' },
  { en: "You're doing amazing! 💪", ur: 'تم بہت اچھا کر رہے ہو! 💪' },
];

export default function Mascot() {
  const t = useT();
  const [greetingIdx, setGreetingIdx] = useState(0);
  const [bounce, setBounce] = useState(true);

  useEffect(() => {
    // Stop bounce after 1.2s
    const b = setTimeout(() => setBounce(false), 1200);
    // Rotate greeting every 4s
    const g = setInterval(() => {
      setGreetingIdx(i => (i + 1) % GREETINGS.length);
    }, 4000);
    return () => { clearTimeout(b); clearInterval(g); };
  }, []);

  return (
    <div className="flex flex-col items-center mb-2 animate-fade-in-up">
      {/* Glow ring behind mascot */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-44 h-44 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 blur-2xl animate-pulse" />

        {/* 3D Mosque icon as hero mascot */}
        <div className={`relative z-10 drop-shadow-2xl ${bounce ? 'animate-bounce' : 'animate-float'}`}>
          <Emoji3D emoji="🕌" size={120} alt="Mosque" />
        </div>

        {/* Floating sparkles */}
        <div className="absolute -top-2 -right-2 animate-twinkle">
          <Emoji3D emoji="⭐" size={28} />
        </div>
        <div className="absolute -bottom-1 -left-3 animate-twinkle" style={{ animationDelay: '0.8s' }}>
          <Emoji3D emoji="✨" size={22} />
        </div>
        <div className="absolute top-4 -left-4 animate-twinkle" style={{ animationDelay: '0.4s' }}>
          <Emoji3D emoji="🌙" size={24} />
        </div>
      </div>

      {/* Rotating greeting */}
      <div className="mt-4 px-5 py-2 bg-primary/10 dark:bg-primary/20 rounded-2xl border border-primary/20 text-center max-w-xs">
        <p className="text-sm font-semibold text-primary">
          {t(GREETINGS[greetingIdx].en, GREETINGS[greetingIdx].ur)}
        </p>
      </div>
    </div>
  );
}
