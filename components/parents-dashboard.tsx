'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Moon, BookOpen, Heart } from 'lucide-react';
import { useT } from '@/lib/language-context';

interface ParentsDashboardProps {
  onBack: () => void;
  onLogout?: () => void;
}

export default function ParentsDashboard({ onBack, onLogout }: ParentsDashboardProps) {
  const t = useT();
  const [stats, setStats] = useState({
    totalStars: 0,
    rozaDays: 0,
    duasLearned: 0,
    challengesDone: 0,
    level: 'Beginner',
    levelStars: 0,
    nextLevelStars: 25,
  });

  useEffect(() => {
    const savedStars   = parseInt(localStorage.getItem('stars') || '0');
    const rozaRaw      = localStorage.getItem('roza-data');
    const duasRaw      = localStorage.getItem('learned-duas');
    const challengeRaw = localStorage.getItem('challenge-date');

    let rozaDays = 0;
    try { rozaDays = rozaRaw ? JSON.parse(rozaRaw).days.length : 0; } catch {}

    let duasLearned = 0;
    try { duasLearned = duasRaw ? JSON.parse(duasRaw).length : 0; } catch {}

    const challengesDone = challengeRaw ? 1 : 0;

    let level = 'Beginner';
    let nextLevelStars = 25;
    if (savedStars >= 100)      { level = 'Master';  nextLevelStars = 100; }
    else if (savedStars >= 50)  { level = 'Scholar'; nextLevelStars = 100; }
    else if (savedStars >= 25)  { level = 'Learner'; nextLevelStars = 50; }
    else                        { nextLevelStars = 25; }

    setStats({ totalStars: savedStars, rozaDays, duasLearned, challengesDone, level, levelStars: savedStars, nextLevelStars });
  }, []);

  const progress = Math.min((stats.levelStars / stats.nextLevelStars) * 100, 100);

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">

      {/* ── Back to Kids Zone — big & obvious ── */}
      <button
        onClick={onBack}
        className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 active:scale-95 text-white font-extrabold text-lg px-6 py-4 rounded-2xl mb-6 transition-all shadow-lg"
      >
        <ArrowLeft size={24} />
        <span>🧒 {t("Back to Kids Zone", "بچوں کے زون میں واپس جائیں")}</span>
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-1">
          🔐 {t('Parent Dashboard', 'والدین کا ڈیش بورڈ')}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("Your child's Islamic learning progress", "آپ کے بچے کی اسلامی تعلیم کی پیش رفت")}
        </p>
      </div>

      {/* Level Badge */}
      <Card className="p-5 border-2 border-secondary/40 bg-gradient-to-r from-secondary/10 to-accent/10 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{t('Current Level', 'موجودہ سطح')}</p>
            <p className="text-2xl font-bold text-primary">{stats.level} 🎓</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">{t('Stars to next level', 'اگلی سطح کے لیے ستارے')}</p>
            <p className="text-lg font-bold text-accent">
              {stats.nextLevelStars - Math.min(stats.totalStars, stats.nextLevelStars)} ⭐
            </p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{t('Progress', 'پیش رفت')}</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="h-3 bg-primary rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 text-center border-2 border-primary/20 bg-card/80">
          <Star className="mx-auto mb-2 text-secondary" size={28} fill="currentColor" />
          <div className="text-3xl font-bold text-primary mb-1">{stats.totalStars}</div>
          <p className="text-xs text-muted-foreground">{t('Total Stars Earned', 'کل ستارے کمائے')}</p>
        </Card>

        <Card className="p-4 text-center border-2 border-accent/20 bg-card/80">
          <Moon className="mx-auto mb-2 text-primary" size={28} />
          <div className="text-3xl font-bold text-accent mb-1">{stats.rozaDays}</div>
          <p className="text-xs text-muted-foreground">{t('Roza Days Kept', 'روزے رکھے گئے')}</p>
        </Card>

        <Card className="p-4 text-center border-2 border-chart-3/20 bg-card/80">
          <Heart className="mx-auto mb-2 text-chart-3" size={28} />
          <div className="text-3xl font-bold text-chart-3 mb-1">{stats.duasLearned}</div>
          <p className="text-xs text-muted-foreground">{t('Duas Learned', 'دعائیں سیکھیں')}</p>
        </Card>

        <Card className="p-4 text-center border-2 border-secondary/20 bg-card/80">
          <BookOpen className="mx-auto mb-2 text-secondary-foreground" size={28} />
          <div className="text-3xl font-bold text-secondary-foreground mb-1">{stats.challengesDone}</div>
          <p className="text-xs text-muted-foreground">{t('Challenges Done', 'چیلنج مکمل کیے')}</p>
        </Card>
      </div>

      {/* Tips for Parents */}
      <Card className="p-5 border-2 border-primary/20 bg-card/80 mb-6">
        <h2 className="text-lg font-bold text-primary mb-3">
          💡 {t('Tips for Parents', 'والدین کے لیے مشورے')}
        </h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span>🕌</span>
            <span>{t(
              'Sit with your child in the Salah Guide and learn each step together.',
              'نماز گائیڈ میں اپنے بچے کے ساتھ بیٹھیں اور ہر قدم مل کر سیکھیں۔'
            )}</span>
          </li>
          <li className="flex gap-2">
            <span>🌙</span>
            <span>{t(
              'Use the Roza Tracker to teach your child the importance of fasting.',
              'روزہ ٹریکر سے بچے کو روزے کی اہمیت سمجھائیں۔'
            )}</span>
          </li>
          <li className="flex gap-2">
            <span>🤲</span>
            <span>{t(
              'Help your child memorize duas — practice morning and evening.',
              'بچے کو دعائیں یاد کروائیں — صبح شام مشق کروائیں۔'
            )}</span>
          </li>
          <li className="flex gap-2">
            <span>📖</span>
            <span>{t(
              'Read Islamic Stories together and discuss the lessons learned.',
              'اسلامی کہانیاں مل کر پڑھیں اور سبق پر بات کریں۔'
            )}</span>
          </li>
          <li className="flex gap-2">
            <span>⭐</span>
            <span>{t(
              'Praise your child whenever they collect stars — encouragement matters!',
              'جب بھی بچہ ستارے کمائے، اس کی تعریف ضرور کریں!'
            )}</span>
          </li>
        </ul>
      </Card>

      {/* PIN info */}
      <Card className="p-4 border border-muted bg-muted/30 mb-4">
        <p className="text-xs text-muted-foreground">
          <strong>{t('Default PIN:', 'ڈیفالٹ پن:')}</strong> 1234
          {' — '}
          {t(
            'To change the PIN, set the "parent-pin" key in localStorage.',
            'پن تبدیل کرنے کے لیے localStorage میں "parent-pin" key سیٹ کریں۔'
          )}
        </p>
      </Card>

      {/* Logout */}
      {onLogout && (
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full py-4 text-base font-bold border-2 border-destructive/40 text-destructive hover:bg-destructive/10"
        >
          🚪 {t('Logout', 'لاگ آؤٹ')}
        </Button>
      )}

      <p className="text-center text-xs text-muted-foreground mt-4">
        {t(
          'All data is saved on this device only. No personal info is shared.',
          'تمام ڈیٹا صرف اس ڈیوائس پر محفوظ ہے۔ کوئی ذاتی معلومات شیئر نہیں ہوتی۔'
        )}
      </p>
    </div>
  );
}
