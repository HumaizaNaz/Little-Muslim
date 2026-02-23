'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { playStarSound } from '@/lib/audio-utils';
import { useT } from '@/lib/language-context';

interface RozaTrackerProps {
  onBack: () => void;
}

export default function RozaTracker({ onBack }: RozaTrackerProps) {
  const t = useT();
  const [rozaToday, setRozaToday] = useState(false);
  const [rozaDays, setRozaDays] = useState<boolean[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('roza-data');
    const data = savedData ? JSON.parse(savedData) : { date: today, days: [], today: false };

    if (data.date !== today) {
      // New day, reset
      localStorage.setItem('roza-data', JSON.stringify({ date: today, days: data.days, today: false }));
      setRozaDays(data.days);
      setRozaToday(false);
    } else {
      setRozaDays(data.days);
      setRozaToday(data.today);
    }
  }, []);

  const handleToggleRoza = () => {
    const newStatus = !rozaToday;
    setRozaToday(newStatus);

    const savedStars = parseInt(localStorage.getItem('stars') || '0');
    const today = new Date().toDateString();

    let newDays: boolean[];
    if (newStatus) {
      // Marking roza done — add a day, award stars
      newDays = [...rozaDays, true];
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
      localStorage.setItem('stars', String(savedStars + 5));
      playStarSound();
    } else {
      // Unmarking — remove last day, deduct stars
      newDays = rozaDays.slice(0, -1);
      localStorage.setItem('stars', String(Math.max(0, savedStars - 5)));
    }

    setRozaDays(newDays);
    localStorage.setItem('roza-data', JSON.stringify({
      date: today,
      days: newDays,
      today: newStatus
    }));
  };

  const rozaStreak = rozaDays.filter(d => d).length;

  return (
    <div className="min-h-screen flex flex-col px-4 py-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary font-bold text-base px-5 py-3 rounded-2xl mb-6 transition-all"
      >
        <ArrowLeft size={24} />
        <span>{t('Back', 'واپس')}</span>
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Title */}
        <h1 className="text-4xl font-bold text-primary mb-8">{t('Roza Tracker', 'روزہ ٹریکر')}</h1>

        {/* Today's Roza Status */}
        <Card className="w-full max-w-md p-8 text-center border-2 border-accent/30 bg-card/50 backdrop-blur mb-8">
          <p className="text-muted-foreground mb-4">{t("Today's Status", 'آج کی صورتحال')}</p>

          {/* Toggle Button */}
          <button
            onClick={handleToggleRoza}
            className={`w-full py-16 rounded-2xl mb-6 transition-all duration-300 flex items-center justify-center text-6xl font-bold border-4 ${
              rozaToday
                ? 'bg-accent/20 border-accent text-accent'
                : 'bg-muted border-muted text-muted-foreground'
            }`}
          >
            {rozaToday ? t('✅ ROZA DONE!', '✅ روزہ مکمل!') : t('⏳ Not Yet', '⏳ ابھی نہیں')}
          </button>

          <p className="text-sm text-muted-foreground mb-4">
            {rozaToday ? t('Mashallah! Great job today!', 'ماشاءاللہ! آج بہت اچھا کیا!') : t('Tap to mark your roza complete', 'روزہ مکمل کرنے کے لیے دبائو')}
          </p>

          {/* Celebration Animation */}
          {showCelebration && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-6xl animate-bounce">🌟</div>
              <div className="absolute text-5xl animate-bounce" style={{ animationDelay: '0.1s', left: '20%' }}>✨</div>
              <div className="absolute text-5xl animate-bounce" style={{ animationDelay: '0.2s', right: '20%' }}>⭐</div>
            </div>
          )}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
          <Card className="p-6 text-center border-2 border-primary/20 bg-card/50 backdrop-blur">
            <div className="text-4xl font-bold text-primary mb-2">{rozaStreak}</div>
            <p className="text-sm text-muted-foreground">{t('Days Completed', 'دن مکمل')}</p>
          </Card>

          <Card className="p-6 text-center border-2 border-secondary/20 bg-card/50 backdrop-blur">
            <div className="text-4xl font-bold text-secondary mb-2">{rozaToday ? 5 : 0}</div>
            <p className="text-sm text-muted-foreground">{t("Today's Stars", 'آج کے ستارے')}</p>
          </Card>
        </div>

        {/* Roza Information */}
        <Card className="w-full max-w-md p-6 border-2 border-primary/30 bg-primary/5 backdrop-blur mb-8">
          <h3 className="font-bold text-primary mb-3">{t('About Roza (Fasting)', 'روزہ کے بارے میں')}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'Roza is one of the Five Pillars of Islam. It teaches us discipline, compassion, and gratitude for what Allah has blessed us with. During Ramadan, we fast from dawn to sunset.',
              'روزہ اسلام کے پانچ ارکان میں سے ایک ہے۔ یہ ہمیں نظم و ضبط، ہمدردی اور اللہ کی نعمتوں پر شکر گزاری سکھاتا ہے۔ رمضان میں ہم سحر سے غروب آفتاب تک روزہ رکھتے ہیں۔'
            )}
          </p>
        </Card>

        {/* Tips */}
        <Card className="w-full max-w-md p-6 border-2 border-accent/30 bg-card/50 backdrop-blur">
          <h3 className="font-bold text-accent mb-3">{t('Roza Tips for Kids', 'بچوں کے لیے روزے کے مشورے')}</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>✓ {t('Eat a nutritious Sehri (pre-dawn meal)', 'سحری میں اچھا کھانا کھاؤ')}</li>
            <li>✓ {t('Drink plenty of water before sunset', 'غروب آفتاب سے پہلے خوب پانی پیو')}</li>
            <li>✓ {t('Read the Quran while fasting', 'روزے میں قرآن پڑھو')}</li>
            <li>✓ {t('Be kind and patient with others', 'دوسروں کے ساتھ مہربان اور صبر والے رہو')}</li>
          </ul>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground py-4">
        <p>{t('Keep up the great work! Ramadan is about spiritual growth. 🌙', 'شاباش! رمضان روحانی ترقی کا مہینہ ہے۔ 🌙')}</p>
      </div>
    </div>
  );
}
