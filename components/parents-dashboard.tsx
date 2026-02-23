'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Moon, BookOpen, Heart } from 'lucide-react';

interface ParentsDashboardProps {
  onBack: () => void;
  onLogout?: () => void;
}

export default function ParentsDashboard({ onBack, onLogout }: ParentsDashboardProps) {
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
    if (savedStars >= 100) { level = 'Master';  nextLevelStars = 100; }
    else if (savedStars >= 50) { level = 'Scholar'; nextLevelStars = 100; }
    else if (savedStars >= 25) { level = 'Learner'; nextLevelStars = 50; }
    else { nextLevelStars = 25; }

    setStats({ totalStars: savedStars, rozaDays, duasLearned, challengesDone, level, levelStars: savedStars, nextLevelStars });
  }, []);

  const progress = Math.min((stats.levelStars / stats.nextLevelStars) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background px-4 py-6">

      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary font-bold text-base px-5 py-3 rounded-2xl mb-6 transition-all font-medium"
      >
        <ArrowLeft size={22} />
        <span>Back to Kid Zone</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-1">Parent Dashboard</h1>
        <p className="text-muted-foreground text-sm">Your child's Islamic learning progress</p>
      </div>

      {/* Level Badge */}
      <Card className="p-5 border-2 border-secondary/40 bg-gradient-to-r from-secondary/10 to-accent/10 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Level</p>
            <p className="text-2xl font-bold text-primary">{stats.level} 🎓</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Stars to next level</p>
            <p className="text-lg font-bold text-accent">{stats.nextLevelStars - Math.min(stats.totalStars, stats.nextLevelStars)} ⭐</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
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
          <p className="text-xs text-muted-foreground">Total Stars Earned</p>
        </Card>

        <Card className="p-4 text-center border-2 border-accent/20 bg-card/80">
          <Moon className="mx-auto mb-2 text-primary" size={28} />
          <div className="text-3xl font-bold text-accent mb-1">{stats.rozaDays}</div>
          <p className="text-xs text-muted-foreground">Roza Days Kept</p>
        </Card>

        <Card className="p-4 text-center border-2 border-chart-3/20 bg-card/80">
          <Heart className="mx-auto mb-2 text-chart-3" size={28} />
          <div className="text-3xl font-bold text-chart-3 mb-1">{stats.duasLearned}</div>
          <p className="text-xs text-muted-foreground">Duas Learned</p>
        </Card>

        <Card className="p-4 text-center border-2 border-secondary/20 bg-card/80">
          <BookOpen className="mx-auto mb-2 text-secondary-foreground" size={28} />
          <div className="text-3xl font-bold text-secondary-foreground mb-1">{stats.challengesDone}</div>
          <p className="text-xs text-muted-foreground">Challenges Done Today</p>
        </Card>
      </div>

      {/* Activity Tips for Parents */}
      <Card className="p-5 border-2 border-primary/20 bg-card/80 mb-6">
        <h2 className="text-lg font-bold text-primary mb-3">Tips for Parents</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2"><span>🕌</span> Salah Guide mein apne bacha ke saath baitho aur steps sikhao</li>
          <li className="flex gap-2"><span>🌙</span> Roza tracker se bachon ko roza ki ahmiyat samjhao</li>
          <li className="flex gap-2"><span>🤲</span> Duas yaad karwao — subah shaam practice karwao</li>
          <li className="flex gap-2"><span>📖</span> Stories padhne ke baad quiz mein madad karo</li>
          <li className="flex gap-2"><span>⭐</span> Stars collect karne par tarif zaroor karo!</li>
        </ul>
      </Card>

      {/* PIN Change Note */}
      <Card className="p-4 border border-muted bg-muted/30 mb-4">
        <p className="text-xs text-muted-foreground">
          <strong>Default PIN:</strong> 1234 — PIN change karna ho toh localStorage mein <code>parent-pin</code> key set karo.
        </p>
      </Card>

      {/* Logout */}
      {onLogout && (
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full py-4 text-base font-bold border-2 border-destructive/40 text-destructive hover:bg-destructive/10"
        >
          🚪 Logout (Account Se Bahar)
        </Button>
      )}

      <p className="text-center text-xs text-muted-foreground mt-4">
        Yeh data sirf aapke device par saved hai. Koi bhi personal info share nahi hoti.
      </p>
    </div>
  );
}
