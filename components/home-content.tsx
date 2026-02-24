'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Mascot from '@/components/mascot';
import StarsDisplay from '@/components/stars-display';
import Confetti from '@/components/confetti';
import { playStarSound } from '@/lib/audio-utils';
import { useT } from '@/lib/language-context';
import Emoji3D from '@/components/emoji3d';

type Screen = 'home' | 'wudu' | 'salah' | 'roza' | 'stories' | 'duas' | 'rewards' | 'ramadan';

interface HomeContentProps {
  onNavigate: (screen: Screen) => void;
  username?: string;
}

const FEATURE_CARDS = [
  {
    screen: 'wudu' as Screen,
    emoji: '💧',
    en: { title: 'Wudu Guide',        desc: 'Learn how to perform Wudu before prayer!',           btn: '💧 Learn Wudu' },
    ur: { title: 'وضو گائیڈ',          desc: 'نماز سے پہلے وضو کرنا سیکھو!',                       btn: '💧 وضو سیکھو' },
    btnClass:    'bg-blue-500 hover:bg-blue-600 text-white',
    borderClass: 'border-blue-400/50 hover:border-blue-500',
    bgClass:     'bg-gradient-to-br from-blue-400/25 via-cyan-300/15 to-sky-400/20',
    titleClass:  'text-blue-700 dark:text-blue-300',
  },
  {
    screen: 'salah' as Screen,
    emoji: '🕌',
    en: { title: 'Namaz Guide',        desc: 'Learn complete Salah step by step!',                 btn: '🕌 Learn Namaz' },
    ur: { title: 'نماز گائیڈ',          desc: 'قدم بہ قدم پوری نماز سیکھو!',                        btn: '🕌 نماز سیکھو' },
    btnClass:    'bg-emerald-600 hover:bg-emerald-700 text-white',
    borderClass: 'border-emerald-400/50 hover:border-emerald-500',
    bgClass:     'bg-gradient-to-br from-emerald-400/25 via-green-300/15 to-teal-400/20',
    titleClass:  'text-emerald-700 dark:text-emerald-300',
  },
  {
    screen: 'roza' as Screen,
    emoji: '🌙',
    en: { title: 'Roza Tracker',       desc: 'Track your fasts and earn stars!',                   btn: '🌙 Track Roza' },
    ur: { title: 'روزہ ٹریکر',          desc: 'اپنا روزہ ٹریک کرو اور ستارے کماؤ!',                  btn: '🌙 روزہ ٹریک کرو' },
    btnClass:    'bg-purple-600 hover:bg-purple-700 text-white',
    borderClass: 'border-purple-400/50 hover:border-purple-500',
    bgClass:     'bg-gradient-to-br from-purple-400/25 via-indigo-300/15 to-violet-400/20',
    titleClass:  'text-purple-700 dark:text-purple-300',
  },
  {
    screen: 'stories' as Screen,
    emoji: '📖',
    en: { title: 'Islamic Stories',    desc: 'Read amazing stories of the Prophets!',               btn: '📖 Read Stories' },
    ur: { title: 'اسلامی کہانیاں',      desc: 'انبیاء کرام کی حیرت انگیز کہانیاں پڑھو!',              btn: '📖 کہانی پڑھو' },
    btnClass:    'bg-amber-500 hover:bg-amber-600 text-white',
    borderClass: 'border-amber-400/50 hover:border-amber-500',
    bgClass:     'bg-gradient-to-br from-amber-400/25 via-orange-300/15 to-yellow-400/20',
    titleClass:  'text-amber-700 dark:text-amber-300',
  },
  {
    screen: 'duas' as Screen,
    emoji: '🤲',
    en: { title: 'Learn Duas',         desc: 'Memorize beautiful prayers for every moment!',        btn: '🤲 Learn Duas' },
    ur: { title: 'دعائیں سیکھو',        desc: 'ہر وقت کی پیاری دعائیں یاد کرو!',                    btn: '🤲 دعا سیکھو' },
    btnClass:    'bg-teal-600 hover:bg-teal-700 text-white',
    borderClass: 'border-teal-400/50 hover:border-teal-500',
    bgClass:     'bg-gradient-to-br from-teal-400/25 via-cyan-300/15 to-emerald-400/20',
    titleClass:  'text-teal-700 dark:text-teal-300',
  },
  {
    screen: 'ramadan' as Screen,
    emoji: '⭐',
    en: { title: '30 Day Challenge',   desc: 'Do daily tasks and earn rewards!',                    btn: '⭐ Start Challenge' },
    ur: { title: '۳۰ دن چیلنج',        desc: 'روز کام کرو اور انعام پاؤ!',                          btn: '⭐ چیلنج کرو' },
    btnClass:    'bg-rose-500 hover:bg-rose-600 text-white',
    borderClass: 'border-rose-400/50 hover:border-rose-500',
    bgClass:     'bg-gradient-to-br from-rose-400/25 via-pink-300/15 to-red-400/20',
    titleClass:  'text-rose-700 dark:text-rose-300',
  },
];

export default function HomeContent({ onNavigate, username }: HomeContentProps) {
  const t = useT();
  const [stars, setStars] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const savedStars = localStorage.getItem('stars');
    if (savedStars) setStars(parseInt(savedStars));
    const today = new Date().toDateString();
    setChallengeDone(localStorage.getItem('challenge-date') === today);
  }, [mounted]);

  const handleChallengeComplete = () => {
    if (challengeDone) return;
    const newStars = stars + 5;
    setStars(newStars);
    setChallengeDone(true);
    setShowConfetti(true);
    localStorage.setItem('stars', String(newStars));
    localStorage.setItem('challenge-date', new Date().toDateString());
    playStarSound();
    setTimeout(() => setShowConfetti(false), 2500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-2xl mx-auto">
      <Confetti active={showConfetti} />

      {/* ── Hero Banner ── */}
      <div className="relative rounded-3xl overflow-hidden mb-6 bg-gradient-to-br from-primary via-blue-700 to-indigo-800 dark:from-primary/90 dark:via-blue-800 dark:to-indigo-900 shadow-2xl">
        {/* Subtle star pattern inside banner */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="banner-stars" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M25 3L27.5 18L43 14L32.5 25L43 36L27.5 32L25 47L22.5 32L7 36L17.5 25L7 14L22.5 18Z"
                  fill="white" opacity="0.6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#banner-stars)"/>
          </svg>
        </div>

        <div className="relative z-10 px-6 py-5 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl">🌙</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight drop-shadow">
                Little Muslim<br/>Explorer
              </h1>
            </div>
            <p className="text-blue-100 text-sm font-medium mt-1">
              {t('Assalamu Alaikum,', 'السلام علیکم،')}{' '}
              <span className="font-bold text-white">
                {username ? `${username}!` : t('young explorer! 👋', 'میرے پیارے دوست! 👋')}
              </span>
            </p>
          </div>

          {/* Stars button in banner */}
          <button
            onClick={() => onNavigate('rewards')}
            className="flex flex-col items-center bg-white/20 hover:bg-white/30 active:scale-95 border-2 border-white/30 rounded-2xl px-4 py-3 transition-all backdrop-blur-sm"
          >
            <StarsDisplay stars={stars} />
            <span className="text-xs font-bold text-blue-100 mt-1">{t('My Stars', 'میرے ستارے')} ⭐</span>
          </button>
        </div>

        {/* Decorative crescent inside banner */}
        <div className="absolute right-4 bottom-0 opacity-20 pointer-events-none select-none">
          <svg viewBox="0 0 80 80" width="100" height="100">
            <circle cx="40" cy="40" r="36" fill="white"/>
            <circle cx="50" cy="32" r="34" fill="#1e40af"/>
          </svg>
        </div>
      </div>

      {/* ── Mascot ── */}
      <div className="flex justify-center mb-6">
        <Mascot />
      </div>

      {/* ── Feature Cards ── */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {FEATURE_CARDS.map((card) => (
          <Card
            key={card.screen}
            onClick={() => onNavigate(card.screen)}
            className={`cursor-pointer hover:shadow-2xl hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 p-5 border-2 ${card.borderClass} ${card.bgClass} backdrop-blur-sm`}
          >
            <div className="flex flex-col items-center text-center">
              {/* Big 3D emoji with glow */}
              <div className="mb-3 drop-shadow-xl">
                <Emoji3D emoji={card.emoji} size={72} />
              </div>

              {/* Title */}
              <h2 className={`text-base font-extrabold mb-1 ${card.titleClass}`}>
                {t(card.en.title, card.ur.title)}
              </h2>

              {/* Description */}
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {t(card.en.desc, card.ur.desc)}
              </p>

              {/* Button */}
              <Button className={`w-full py-3 text-sm font-bold rounded-xl ${card.btnClass}`}>
                {t(card.en.btn, card.ur.btn)}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Daily Challenge ── */}
      <Card className={`p-5 border-2 mb-6 transition-all backdrop-blur-sm ${
        challengeDone
          ? 'border-green-400/60 bg-gradient-to-r from-green-400/20 to-emerald-400/15'
          : 'border-yellow-400/50 bg-gradient-to-r from-yellow-400/15 via-amber-300/10 to-orange-400/15'
      }`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Emoji3D emoji={challengeDone ? '✅' : '📋'} size={32} />
              <h3 className="text-lg font-extrabold text-primary">{t("Today's Task", 'آج کا کام')}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {challengeDone
                ? t('MashaAllah! Task complete! +5 ⭐', 'ماشاءاللہ! آج کا کام مکمل! +5 ⭐')
                : t('Read one Quran verse today and earn 5 stars!', 'آج قرآن کی ایک آیت پڑھو اور 5 ستارے کماؤ!')}
            </p>
          </div>
          <Button
            onClick={handleChallengeComplete}
            disabled={challengeDone}
            className={`shrink-0 px-5 py-4 text-base font-bold rounded-xl ${
              challengeDone
                ? 'bg-green-500 text-white opacity-80'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
          >
            {challengeDone ? t('✓ Done!', '✓ ہو گیا!') : t('Complete', 'مکمل کرو')}
          </Button>
        </div>
      </Card>

      {/* ── Footer ── */}
      <div className="text-center text-base text-muted-foreground py-2">
        <p className="font-medium">{t('Keep learning — you are doing great! 🌟', 'سیکھتے رہو — تم بہت اچھا کر رہے ہو! 🌟')}</p>
      </div>
    </div>
  );
}
