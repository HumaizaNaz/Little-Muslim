'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Confetti from '@/components/confetti';
import { useT } from '@/lib/language-context';

interface RewardsScreenProps {
  onBack: () => void;
}

const BADGES = [
  { id: 1, name: 'First Prayer', emoji: '🕌', condition: 'Complete Salah guide once', unlocked: false },
  { id: 2, name: 'Fasting Warrior', emoji: '🌙', condition: 'Track 5 days of Roza', unlocked: false },
  { id: 3, name: 'Story Master', emoji: '📖', condition: 'Read all 3 stories', unlocked: false },
  { id: 4, name: 'Dua Scholar', emoji: '🤲', condition: 'Learn 5 duas', unlocked: false },
  { id: 5, name: 'Star Collector', emoji: '⭐', condition: 'Collect 50 stars', unlocked: false },
  { id: 6, name: 'Perfect Student', emoji: '🏆', condition: 'Complete all challenges', unlocked: false }
];

export default function RewardsScreen({ onBack }: RewardsScreenProps) {
  const t = useT();
  const [stars, setStars] = useState(0);
  const [badges, setBadges] = useState(BADGES);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const savedStars = localStorage.getItem('stars');
    const starsCount = parseInt(savedStars || '0') || 0;
    setStars(starsCount);
    
    // Show confetti for high achievements
    if (starsCount >= 50 && !showConfetti) {
      setShowConfetti(true);
    }

    // Check for badge unlocks
    const rozaData = localStorage.getItem('roza-data');
    const learnedDuas = localStorage.getItem('learned-duas');

    const unlockedBadges = [...BADGES];

    // Star Collector
    if (starsCount >= 50) {
      unlockedBadges[4].unlocked = true;
    }

    setBadges(unlockedBadges);
  }, []);

  const totalBadgesUnlocked = badges.filter(b => b.unlocked).length;

  return (
    <div className="min-h-screen flex flex-col px-4 py-6">
      <Confetti active={showConfetti && stars >= 50} />
      
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary font-bold text-base px-5 py-3 rounded-2xl mb-6 transition-all"
      >
        <ArrowLeft size={24} />
        <span>{t('Back', 'واپس')}</span>
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold text-primary mb-8">{t('My Rewards', 'میرے انعامات')}</h1>

      {/* Star Count */}
      <Card className="w-full p-8 text-center border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-secondary/10 backdrop-blur mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-6xl animate-pulse">⭐</span>
          <div>
            <p className="text-5xl font-bold text-accent">{stars}</p>
            <p className="text-muted-foreground">{t('Total Stars Earned', 'کل ستارے کمائے')}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Keep learning and earning more stars!
        </p>
      </Card>

      {/* Achievements Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary">{t('Badges Unlocked', 'بیجز حاصل کیے')}</h2>
          <span className="text-sm text-muted-foreground">{totalBadgesUnlocked}/{badges.length}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              className={`p-6 text-center transition-all border-2 backdrop-blur ${
                badge.unlocked
                  ? 'border-accent/50 bg-accent/10 shadow-lg'
                  : 'border-muted/30 bg-muted/5 opacity-60'
              }`}
            >
              <div className={`text-4xl mb-2 ${!badge.unlocked && 'grayscale'}`}>
                {badge.emoji}
              </div>
              <h3 className="font-bold text-primary mb-1 text-sm">{badge.name}</h3>
              <p className="text-xs text-muted-foreground">{badge.condition}</p>

              {badge.unlocked && (
                <div className="mt-3 pt-3 border-t border-accent/20">
                  <span className="text-xs font-semibold text-accent">✓ {t('Unlocked', 'کھل گیا')}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Level Progress */}
      <Card className="p-6 border-2 border-primary/30 bg-card/50 backdrop-blur mb-8">
        <h3 className="font-bold text-primary mb-4">{t('Explorer Level', 'ایکسپلورر درجہ')}</h3>

        <div className="space-y-4">
          {[
            { level: 'Beginner', stars: 0, current: stars >= 0 },
            { level: 'Learner', stars: 25, current: stars >= 25 },
            { level: 'Scholar', stars: 50, current: stars >= 50 },
            { level: 'Master', stars: 100, current: stars >= 100 }
          ].map((level) => (
            <div key={level.level}>
              <div className="flex justify-between items-center mb-2">
                <span className={`font-semibold ${level.current ? 'text-primary' : 'text-muted-foreground'}`}>
                  {level.level}
                </span>
                <span className={`text-sm ${level.current ? 'text-accent' : 'text-muted-foreground'}`}>
                  {level.stars} ⭐
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    level.current ? 'bg-primary' : 'bg-muted'
                  }`}
                  style={{
                    width: level.current ? '100%' : '0%'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-primary/10 border-l-4 border-primary">
          <p className="text-sm">
            <span className="font-bold text-primary">{t('Current Level:', 'موجودہ درجہ:')}</span>
            <span className="text-muted-foreground ml-2">
              {stars >= 100
                ? t('Master Explorer 🏆', 'ماہر ایکسپلورر 🏆')
                : stars >= 50
                  ? t('Scholar 📚', 'عالم 📚')
                  : stars >= 25
                    ? t('Learner 🌱', 'سیکھنے والا 🌱')
                    : t('Beginner 🌟', 'ابتدائی 🌟')}
            </span>
          </p>
        </div>
      </Card>

      {/* Certificate Preview */}
      {stars >= 50 && (
        <Card className="p-8 text-center border-4 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 backdrop-blur mb-8 relative">
          {/* Decorative Stars */}
          <div className="absolute top-4 left-4 text-2xl">⭐</div>
          <div className="absolute top-4 right-4 text-2xl">⭐</div>
          <div className="absolute bottom-4 left-4 text-2xl">⭐</div>
          <div className="absolute bottom-4 right-4 text-2xl">⭐</div>

          <p className="text-sm text-amber-700 mb-2 font-semibold">Certificate of Excellence</p>
          <h3 className="text-2xl font-bold text-amber-900 mb-4">Little Muslim Explorer</h3>
          <p className="text-muted-foreground mb-4">
            This certifies that you have shown dedication to Islamic learning and have earned 50+ stars!
          </p>
          <p className="text-lg font-semibold text-amber-700">🎖️ Ramadan Achievement 🎖️</p>

          <Button className="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white">
            Download Certificate
          </Button>
        </Card>
      )}

      {/* Statistics */}
      <Card className="p-6 border-2 border-primary/20 bg-card/50 backdrop-blur mb-8">
        <h3 className="font-bold text-primary mb-4">Your Journey</h3>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-2xl font-bold text-primary">5</p>
            <p className="text-xs text-muted-foreground">Duas Learned</p>
          </div>

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-2xl font-bold text-accent">3</p>
            <p className="text-xs text-muted-foreground">Stories Read</p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
            <p className="text-2xl font-bold text-secondary">7</p>
            <p className="text-xs text-muted-foreground">Days Fasting</p>
          </div>

          <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/20">
            <p className="text-2xl font-bold text-chart-3">1</p>
            <p className="text-xs text-muted-foreground">Times Prayed</p>
          </div>
        </div>
      </Card>

      {/* Motivational Message */}
      <Card className="p-6 border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur">
        <p className="text-center text-foreground">
          <span className="text-2xl mr-2">💫</span>
          <span className="font-semibold">{t("You're doing amazing!", 'تم بہت شاندار کر رہے ہو!')}</span>
          <span className="text-2xl ml-2">💫</span>
        </p>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {t('Keep learning, stay faithful, and grow closer to Allah every day.', 'سیکھتے رہو، ایمان پر قائم رہو، اور روز اللہ کے قریب ہوتے جاؤ۔')}
        </p>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground py-4">
        <p>Last Updated: Today</p>
      </div>
    </div>
  );
}
