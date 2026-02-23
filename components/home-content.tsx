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
    borderClass: 'border-blue-400/30 hover:border-blue-400/70',
    bgClass:     '',
    titleClass:  'text-blue-600 dark:text-blue-400',
  },
  {
    screen: 'salah' as Screen,
    emoji: '🕌',
    en: { title: 'Namaz Guide',        desc: 'Learn complete Salah step by step!',                 btn: '🕌 Learn Namaz' },
    ur: { title: 'نماز گائیڈ',          desc: 'قدم بہ قدم پوری نماز سیکھو!',                        btn: '🕌 نماز سیکھو' },
    btnClass:    'bg-primary hover:bg-primary/90 text-primary-foreground',
    borderClass: 'border-primary/30 hover:border-primary/70',
    bgClass:     '',
    titleClass:  'text-primary',
  },
  {
    screen: 'roza' as Screen,
    emoji: '🌙',
    en: { title: 'Roza Tracker',       desc: 'Track your fasts and earn stars!',                   btn: '🌙 Track Roza' },
    ur: { title: 'روزہ ٹریکر',          desc: 'اپنا روزہ ٹریک کرو اور ستارے کماؤ!',                  btn: '🌙 روزہ ٹریک کرو' },
    btnClass:    'bg-accent hover:bg-accent/90 text-accent-foreground',
    borderClass: 'border-accent/30 hover:border-accent/70',
    bgClass:     '',
    titleClass:  'text-accent',
  },
  {
    screen: 'stories' as Screen,
    emoji: '📖',
    en: { title: 'Islamic Stories',    desc: 'Read amazing stories of the Prophets!',               btn: '📖 Read Stories' },
    ur: { title: 'اسلامی کہانیاں',      desc: 'انبیاء کرام کی حیرت انگیز کہانیاں پڑھو!',              btn: '📖 کہانی پڑھو' },
    btnClass:    'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
    borderClass: 'border-secondary/50 hover:border-secondary/80',
    bgClass:     '',
    titleClass:  'text-secondary-foreground',
  },
  {
    screen: 'duas' as Screen,
    emoji: '🤲',
    en: { title: 'Learn Duas',         desc: 'Memorize beautiful prayers for every moment!',        btn: '🤲 Learn Duas' },
    ur: { title: 'دعائیں سیکھو',        desc: 'ہر وقت کی پیاری دعائیں یاد کرو!',                    btn: '🤲 دعا سیکھو' },
    btnClass:    'bg-chart-3 hover:bg-chart-3/90 text-white',
    borderClass: 'border-chart-3/30 hover:border-chart-3/70',
    bgClass:     '',
    titleClass:  'text-chart-3',
  },
  {
    screen: 'ramadan' as Screen,
    emoji: '⭐',
    en: { title: '30 Day Challenge',   desc: 'Do daily tasks and earn rewards!',                    btn: '⭐ Start Challenge' },
    ur: { title: '۳۰ دن چیلنج',        desc: 'روز کام کرو اور انعام پاؤ!',                          btn: '⭐ چیلنج کرو' },
    btnClass:    'bg-primary hover:bg-primary/90 text-primary-foreground',
    borderClass: 'border-primary/30 hover:border-primary/70',
    bgClass:     'bg-gradient-to-br from-primary/5 to-accent/5',
    titleClass:  'text-primary',
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

      {/* ── Header ── */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary leading-tight">
            Little Muslim<br />Explorer 🌙
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            {t('Assalamu Alaikum,', 'السلام علیکم،')}{' '}
            {username
              ? <span className="font-bold text-primary">{username}!</span>
              : <span>{t('young explorer!', 'میرے پیارے دوست!')}</span>}
          </p>
        </div>

        {/* Stars Button — bigger for kids */}
        <button
          onClick={() => onNavigate('rewards')}
          className="flex flex-col items-center bg-secondary/20 hover:bg-secondary/30 active:scale-95 border-2 border-secondary/40 rounded-2xl px-4 py-3 transition-all"
        >
          <StarsDisplay stars={stars} />
          <span className="text-xs font-bold text-muted-foreground mt-1">{t('My Stars ⭐', 'میرے ستارے ⭐')}</span>
        </button>
      </div>

      {/* ── Mascot ── */}
      <div className="flex justify-center mb-6">
        <Mascot />
      </div>

      {/* ── Feature Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {FEATURE_CARDS.map((card) => (
          <Card
            key={card.screen}
            onClick={() => onNavigate(card.screen)}
            className={`cursor-pointer hover:shadow-xl active:scale-[0.97] transition-all duration-200 p-6 border-2 ${card.borderClass} ${card.bgClass} bg-card/60 backdrop-blur`}
          >
            <div className="flex flex-col items-center text-center">
              {/* Big 3D emoji */}
              <div className="mb-3 drop-shadow-xl">
                <Emoji3D emoji={card.emoji} size={80} />
              </div>

              {/* Title — bigger for kids */}
              <h2 className={`text-xl font-extrabold mb-2 ${card.titleClass}`}>
                {t(card.en.title, card.ur.title)}
              </h2>

              {/* Description — readable size */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {t(card.en.desc, card.ur.desc)}
              </p>

              {/* Button — tall for easy tapping */}
              <Button className={`w-full py-4 text-base font-bold rounded-xl ${card.btnClass}`}>
                {t(card.en.btn, card.ur.btn)}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Daily Challenge ── */}
      <Card className={`p-5 border-2 mb-6 transition-all ${
        challengeDone
          ? 'border-green-400/50 bg-green-50 dark:bg-green-950/30'
          : 'border-primary/30 bg-card/60'
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
